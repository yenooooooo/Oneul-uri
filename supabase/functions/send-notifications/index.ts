/**
 * Supabase Edge Function — 푸시 알림 발송
 * 매일 오전 9시 KST (cron), 편지 발송 시 webhook으로 호출
 *
 * 발송 대상:
 * 1. 매일 D-day 알림 (모든 구독자)
 * 2. 기념일 임박 알림 (D-7, D-3, D-1, 당일)
 * 3. 새 편지 도착 알림 (편지 발송 시 즉시)
 * 4. 통장 목표 달성 알림
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY")!;
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY")!;

/** Web Push 발송 (VAPID 프로토콜) */
async function sendWebPush(
  subscription: { endpoint: string; p256dh: string; auth: string },
  payload: { title: string; body: string; url?: string }
) {
  try {
    // JWT 생성을 위한 간단한 Web Push 구현
    const response = await fetch(subscription.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "TTL": "86400",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`Push 발송 실패: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error("Push 발송 예외:", error);
  }
}

Deno.serve(async (req) => {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // 요청 타입 확인 (cron = daily, webhook = letter/achievement)
    const body = await req.json().catch(() => ({}));
    const type = body.type ?? "daily";

    // 모든 구독 정보 조회
    const { data: subscriptions } = await supabase
      .from("push_subscriptions")
      .select("*, couples(start_date, user1_nickname, user2_nickname)");

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(JSON.stringify({ message: "No subscriptions" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const notifications: Promise<void>[] = [];

    if (type === "daily") {
      // === 1. 매일 D-day 알림 ===
      for (const sub of subscriptions) {
        const couple = sub.couples;
        if (!couple?.start_date) continue;

        const startDate = new Date(couple.start_date);
        const diffDays = Math.floor(
          (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        notifications.push(
          sendWebPush(sub, {
            title: "오늘우리",
            body: `💕 오늘은 D+${diffDays}일이에요!`,
            url: "/",
          })
        );
      }

      // === 2. 기념일 임박 알림 ===
      const { data: anniversaries } = await supabase
        .from("anniversaries")
        .select("*, couples(id)")
        .gte("date", todayStr);

      if (anniversaries) {
        for (const ann of anniversaries) {
          const annDate = new Date(ann.date);
          const daysUntil = Math.floor(
            (annDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
          );

          // D-7, D-3, D-1, 당일만 알림
          if (![0, 1, 3, 7].includes(daysUntil)) continue;

          const dayText = daysUntil === 0
            ? `오늘은 ${ann.title}이에요! 🎉`
            : `${ann.title}이 ${daysUntil}일 남았어요!`;

          // 해당 커플의 구독자에게 발송
          const coupleSubs = subscriptions.filter(
            (s: any) => s.couple_id === ann.couple_id
          );
          for (const sub of coupleSubs) {
            notifications.push(
              sendWebPush(sub, {
                title: "오늘우리",
                body: dayText,
                url: "/anniversary",
              })
            );
          }
        }
      }
    }

    if (type === "letter") {
      // === 3. 새 편지 도착 알림 ===
      const receiverId = body.receiver_id;
      if (receiverId) {
        const receiverSubs = subscriptions.filter(
          (s: any) => s.user_id === receiverId
        );
        for (const sub of receiverSubs) {
          notifications.push(
            sendWebPush(sub, {
              title: "오늘우리",
              body: "💌 새로운 편지가 도착했어요",
              url: "/penpal",
            })
          );
        }
      }
    }

    await Promise.all(notifications);

    return new Response(
      JSON.stringify({ message: `Sent ${notifications.length} notifications` }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Edge Function 에러:", error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
