"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { subscribePush, unsubscribePush } from "@/lib/pwa/push-subscription";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCouple } from "@/hooks/useCouple";
import { VAPID_PUBLIC_KEY } from "@/lib/env";
import { toast } from "sonner";

/**
 * 푸시 알림 설정 토글 — 설정 페이지에서 사용
 * 구독 시 push_subscriptions 테이블에 저장
 * iOS 16.4+ PWA에서만 작동 (홈 화면 추가 필수)
 */
export default function NotificationToggle() {
  const { user } = useAuth();
  const { couple } = useCouple();
  const [enabled, setEnabled] = useState(false); // 알림 활성 여부
  const [loading, setLoading] = useState(true); // 초기 로딩
  const [toggling, setToggling] = useState(false); // 토글 중
  const supabase = createClient();

  /** 현재 구독 상태 확인 */
  useEffect(() => {
    const check = async () => {
      try {
        if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
          setLoading(false);
          return;
        }
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        setEnabled(!!sub);
      } catch {
        // 지원하지 않는 환경
      } finally {
        setLoading(false);
      }
    };
    check();
  }, []);

  /** 알림 토글 */
  const handleToggle = async () => {
    if (!user || !couple || !VAPID_PUBLIC_KEY) {
      toast.error("알림을 설정할 수 없어요.");
      return;
    }

    setToggling(true);

    if (enabled) {
      // 구독 해제
      const ok = await unsubscribePush();
      if (ok) {
        // DB에서 구독 정보 삭제
        await supabase.from("push_subscriptions").delete().eq("user_id", user.id);
        setEnabled(false);
        toast.success("알림이 꺼졌어요.");
      }
    } else {
      // 구독 요청 (사용자 허용 팝업)
      const sub = await subscribePush(VAPID_PUBLIC_KEY);
      if (sub) {
        const json = sub.toJSON();
        // DB에 구독 정보 저장
        await supabase.from("push_subscriptions").upsert({
          user_id: user.id,
          couple_id: couple.id,
          endpoint: sub.endpoint,
          p256dh: json.keys?.p256dh ?? "",
          auth: json.keys?.auth ?? "",
        }, { onConflict: "user_id" });

        setEnabled(true);
        toast.success("알림이 켜졌어요!");
      } else {
        toast.error("알림 권한이 거부되었어요. 설정에서 허용해주세요.");
      }
    }

    setToggling(false);
  };

  // 푸시 미지원 환경
  if (loading) return null;
  if (typeof window !== "undefined" && !("PushManager" in window)) {
    return (
      <p className="text-xs text-txt-tertiary">
        이 기기에서는 알림을 지원하지 않아요. 홈 화면에 앱을 추가해주세요.
      </p>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={toggling}
      className="flex items-center justify-between w-full py-3"
    >
      <div className="flex items-center gap-3">
        {enabled ? (
          <Bell className="w-5 h-5 text-coral-400" />
        ) : (
          <BellOff className="w-5 h-5 text-txt-tertiary" />
        )}
        <div className="text-left">
          <p className="text-sm font-medium text-txt-primary">푸시 알림</p>
          <p className="text-xs text-txt-tertiary">
            D-day, 기념일, 새 편지 알림
          </p>
        </div>
      </div>
      {toggling ? (
        <Loader2 className="w-5 h-5 animate-spin text-coral-400" />
      ) : (
        <div className={`w-11 h-6 rounded-full transition-colors relative ${
          enabled ? "bg-coral-400" : "bg-gray-200"
        }`}>
          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
            enabled ? "translate-x-5" : "translate-x-0.5"
          }`} />
        </div>
      )}
    </button>
  );
}
