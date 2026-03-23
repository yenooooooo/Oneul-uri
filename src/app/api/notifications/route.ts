import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

/**
 * 푸시 알림 발송 API — /api/notifications
 * Vercel Cron으로 매일 KST 09:00 호출 (daily)
 * 편지 발송 시 클라이언트에서 직접 호출 (letter)
 *
 * body: { type: "daily" | "letter", receiver_id?: string }
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/** Web Push 발송 — 간단한 fetch 기반 */
async function sendPush(
  endpoint: string,
  payload: { title: string; body: string; url?: string }
) {
  try {
    await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "TTL": "86400" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("[sendPush] 실패:", error);
  }
}

export async function POST(req: NextRequest) {
  try {
    // Cron 인증 확인 (Vercel Cron은 CRON_SECRET 헤더를 보냄)
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    const body = await req.json().catch(() => ({}));
    const type = body.type ?? "daily";

    // daily 호출은 cron secret 검증 (letter는 클라이언트에서 호출)
    if (type === "daily" && cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Service Role 키로 Supabase 접속 (RLS 무시)
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // 모든 구독 정보 + 커플 정보 조회
    const { data: subscriptions } = await supabase
      .from("push_subscriptions")
      .select("*, couples(start_date)");

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ message: "No subscriptions", sent: 0 });
    }

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    let sent = 0;

    if (type === "daily") {
      // === 1. D-day 알림 ===
      for (const sub of subscriptions) {
        const startDate = sub.couples?.start_date;
        if (!startDate) continue;

        const diff = Math.floor(
          (today.getTime() - new Date(startDate).getTime()) / 86400000
        );
        await sendPush(sub.endpoint, {
          title: "오늘우리",
          body: `💕 오늘은 D+${diff}일이에요!`,
          url: "/",
        });
        sent++;
      }

      // === 2. 기념일 임박 알림 (D-7, D-3, D-1, 당일) ===
      const { data: anniversaries } = await supabase
        .from("anniversaries")
        .select("*")
        .gte("date", todayStr);

      if (anniversaries) {
        for (const ann of anniversaries) {
          const daysUntil = Math.floor(
            (new Date(ann.date).getTime() - today.getTime()) / 86400000
          );
          if (![0, 1, 3, 7].includes(daysUntil)) continue;

          const msg = daysUntil === 0
            ? `🎉 오늘은 ${ann.title}이에요!`
            : `${ann.title}이 ${daysUntil}일 남았어요!`;

          const coupleSubs = subscriptions.filter(
            (s: { couple_id: string; user_id: string; endpoint: string }) => s.couple_id === ann.couple_id
          );
          for (const sub of coupleSubs) {
            await sendPush(sub.endpoint, {
              title: "오늘우리", body: msg, url: "/anniversary",
            });
            sent++;
          }
        }
      }
    }

    if (type === "letter" && body.receiver_id) {
      // === 3. 새 편지 알림 ===
      const receiverSubs = subscriptions.filter(
        (s: { couple_id: string; user_id: string; endpoint: string }) => s.user_id === body.receiver_id
      );
      for (const sub of receiverSubs) {
        await sendPush(sub.endpoint, {
          title: "오늘우리",
          body: "💌 새로운 편지가 도착했어요",
          url: "/penpal",
        });
        sent++;
      }
    }

    return NextResponse.json({ message: "OK", sent });
  } catch (error) {
    console.error("[notifications API] 에러:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
