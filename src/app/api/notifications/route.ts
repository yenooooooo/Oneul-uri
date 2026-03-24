import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";

/**
 * 푸시 알림 발송 API — /api/notifications
 * Vercel Cron으로 매일 KST 09:00 호출 (daily)
 * 편지 발송 시 클라이언트에서 직접 호출 (letter)
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY!;

// VAPID 설정 — 푸시 서버 인증용
if (VAPID_PUBLIC && VAPID_PRIVATE) {
  webpush.setVapidDetails("mailto:noreply@oneul-uri.app", VAPID_PUBLIC, VAPID_PRIVATE);
}

/** Web Push 발송 — VAPID 인증 + 암호화 페이로드 */
async function sendPush(
  sub: { endpoint: string; p256dh: string; auth: string },
  payload: { title: string; body: string; url?: string }
) {
  try {
    await webpush.sendNotification(
      { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
      JSON.stringify(payload)
    );
  } catch (error: unknown) {
    const statusCode = (error as { statusCode?: number })?.statusCode;
    // 410 Gone = 구독 만료 → DB에서 삭제
    if (statusCode === 410 || statusCode === 404) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
      await supabase.from("push_subscriptions").delete().eq("endpoint", sub.endpoint);
      console.log("[sendPush] 만료된 구독 삭제:", sub.endpoint);
    } else {
      console.error("[sendPush] 실패:", error);
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    const body = await req.json().catch(() => ({}));
    const type = body.type ?? "daily";

    if (type === "daily" && cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // 구독 정보 + 커플 정보 조회
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
      // 1. D-day 알림
      for (const sub of subscriptions) {
        const startDate = sub.couples?.start_date;
        if (!startDate) continue;
        const diff = Math.floor(
          (today.getTime() - new Date(startDate).getTime()) / 86400000
        );
        await sendPush(sub, {
          title: "오늘우리", body: `💕 오늘은 D+${diff}일이에요!`, url: "/",
        });
        sent++;
      }

      // 2. 기념일 임박 알림
      const { data: anniversaries } = await supabase
        .from("anniversaries").select("*").gte("date", todayStr);

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
            (s: { couple_id: string }) => s.couple_id === ann.couple_id
          );
          for (const sub of coupleSubs) {
            await sendPush(sub, { title: "오늘우리", body: msg, url: "/anniversary" });
            sent++;
          }
        }
      }

      // 3. 캘린더 일정 리마인더 (오늘 + 내일)
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split("T")[0];

      const { data: events } = await supabase
        .from("calendar_events").select("*")
        .in("date", [todayStr, tomorrowStr]);

      if (events) {
        for (const evt of events) {
          const isToday = evt.date === todayStr;
          const timeStr = evt.time ? ` ${evt.time.slice(0, 5)}` : "";
          const msg = isToday
            ? `📅 오늘 일정: ${evt.title}${timeStr}`
            : `📅 내일 일정: ${evt.title}${timeStr}`;

          const evtSubs = subscriptions.filter(
            (s: { couple_id: string }) => s.couple_id === evt.couple_id
          );
          for (const sub of evtSubs) {
            await sendPush(sub, { title: "오늘우리", body: msg, url: "/calendar" });
            sent++;
          }
        }
      }

      // 4. 데이트 플래너 리마인더 (오늘 + 내일, planned만)
      const { data: plans } = await supabase
        .from("date_plans").select("*")
        .eq("status", "planned")
        .in("date", [todayStr, tomorrowStr]);

      if (plans) {
        for (const plan of plans) {
          const isToday = plan.date === todayStr;
          const msg = isToday
            ? `📋 오늘 데이트! "${plan.title}" 플래너를 확인해보세요`
            : `📋 내일 데이트가 있어요! "${plan.title}"`;

          const planSubs = subscriptions.filter(
            (s: { couple_id: string }) => s.couple_id === plan.couple_id
          );
          for (const sub of planSubs) {
            await sendPush(sub, { title: "오늘우리", body: msg, url: `/calendar/plan/${plan.id}` });
            sent++;
          }
        }
      }
    }

    if (type === "test") {
      // 테스트 알림 — 모든 구독자에게 발송
      for (const sub of subscriptions) {
        await sendPush(sub, {
          title: "오늘우리", body: "🔔 테스트 알림이에요! 정상 작동 중!", url: "/",
        });
        sent++;
      }
    }

    if (type === "letter" && body.receiver_id) {
      // 새 편지 알림
      const receiverSubs = subscriptions.filter(
        (s: { user_id: string }) => s.user_id === body.receiver_id
      );
      for (const sub of receiverSubs) {
        await sendPush(sub, {
          title: "오늘우리", body: "💌 새로운 편지가 도착했어요", url: "/penpal",
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
