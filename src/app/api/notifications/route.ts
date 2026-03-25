import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";

/**
 * 푸시 알림 발송 API — /api/notifications
 * GET: Vercel Cron이 매일 KST 09:00 호출 (daily 알림)
 * POST: 클라이언트에서 호출 (letter, test)
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY!;

if (VAPID_PUBLIC && VAPID_PRIVATE) {
  webpush.setVapidDetails("mailto:noreply@oneul-uri.app", VAPID_PUBLIC, VAPID_PRIVATE);
}

/** Web Push 발송 — VAPID 인증 + 암호화 */
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
    const code = (error as { statusCode?: number })?.statusCode;
    if (code === 410 || code === 404) {
      const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
      await sb.from("push_subscriptions").delete().eq("endpoint", sub.endpoint);
    } else {
      console.error("[sendPush] 실패:", error);
    }
  }
}

/** 매일 알림 로직 (D-day + 기념일 + 캘린더 + 플래너) */
async function sendDailyNotifications(): Promise<number> {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const { data: subs } = await supabase
    .from("push_subscriptions").select("*, couples(start_date)");

  if (!subs || subs.length === 0) return 0;

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];
  let sent = 0;

  // 1. D-day 알림
  for (const sub of subs) {
    const start = sub.couples?.start_date;
    if (!start) continue;
    const diff = Math.floor((today.getTime() - new Date(start).getTime()) / 86400000);
    await sendPush(sub, { title: "", body: `💕 오늘은 D+${diff}일이에요!`, url: "/" });
    sent++;
  }

  // 2. 기념일 임박 (D-7, D-3, D-1, 당일)
  const { data: anns } = await supabase
    .from("anniversaries").select("*").gte("date", todayStr);
  if (anns) {
    for (const ann of anns) {
      const d = Math.floor((new Date(ann.date).getTime() - today.getTime()) / 86400000);
      if (![0, 1, 3, 7].includes(d)) continue;
      const msg = d === 0 ? `🎉 오늘은 ${ann.title}이에요!` : `${ann.title}이 ${d}일 남았어요!`;
      const targets = subs.filter((s: { couple_id: string }) => s.couple_id === ann.couple_id);
      for (const sub of targets) {
        await sendPush(sub, { title: "", body: msg, url: "/anniversary" });
        sent++;
      }
    }
  }

  // 3. 캘린더 일정 (오늘 + 내일)
  const { data: events } = await supabase
    .from("calendar_events").select("*").in("date", [todayStr, tomorrowStr]);
  if (events) {
    for (const evt of events) {
      const isToday = evt.date === todayStr;
      const time = evt.time ? ` ${evt.time.slice(0, 5)}` : "";
      const msg = isToday ? `📅 오늘 일정: ${evt.title}${time}` : `📅 내일 일정: ${evt.title}${time}`;
      const targets = subs.filter((s: { couple_id: string }) => s.couple_id === evt.couple_id);
      for (const sub of targets) {
        await sendPush(sub, { title: "", body: msg, url: "/calendar" });
        sent++;
      }
    }
  }

  // 4. 플래너 리마인더 (오늘 + 내일)
  const { data: plans } = await supabase
    .from("date_plans").select("*").eq("status", "planned").in("date", [todayStr, tomorrowStr]);
  if (plans) {
    for (const plan of plans) {
      const isToday = plan.date === todayStr;
      const msg = isToday
        ? `📋 오늘 데이트! "${plan.title}" 플래너를 확인해보세요`
        : `📋 내일 데이트가 있어요! "${plan.title}"`;
      const targets = subs.filter((s: { couple_id: string }) => s.couple_id === plan.couple_id);
      for (const sub of targets) {
        await sendPush(sub, { title: "", body: msg, url: `/calendar/plan/${plan.id}` });
        sent++;
      }
    }
  }

  return sent;
}

/** GET — Vercel Cron이 호출 (매일 KST 09:00) */
export async function GET() {
  try {
    const sent = await sendDailyNotifications();
    return NextResponse.json({ message: "Daily OK", sent });
  } catch (error) {
    console.error("[notifications GET] 에러:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

/** POST — 클라이언트에서 호출 (letter, test) */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const type = body.type ?? "daily";

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const { data: subs } = await supabase
      .from("push_subscriptions").select("*, couples(start_date)");

    if (!subs || subs.length === 0) {
      return NextResponse.json({ message: "No subscriptions", sent: 0 });
    }

    let sent = 0;

    if (type === "daily") {
      sent = await sendDailyNotifications();
    }

    if (type === "test" && body.user_id) {
      const targets = subs.filter((s: { user_id: string }) => s.user_id === body.user_id);
      for (const sub of targets) {
        await sendPush(sub, { title: "", body: "🔔 테스트 알림이에요! 정상 작동 중!", url: "/" });
        sent++;
      }
    }

    if (type === "letter" && body.receiver_id) {
      const targets = subs.filter((s: { user_id: string }) => s.user_id === body.receiver_id);
      for (const sub of targets) {
        await sendPush(sub, { title: "", body: "💌 새로운 편지가 도착했어요", url: "/penpal" });
        sent++;
      }
    }

    return NextResponse.json({ message: "OK", sent });
  } catch (error) {
    console.error("[notifications POST] 에러:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
