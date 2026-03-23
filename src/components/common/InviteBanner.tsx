"use client";

import { useState } from "react";
import { Copy, Check, X, UserPlus } from "lucide-react";
import { toast } from "sonner";

/** 배너 닫힘 상태 localStorage 키 */
const BANNER_DISMISSED_KEY = "invite-banner-dismissed";

/** InviteBanner 컴포넌트 props */
interface InviteBannerProps {
  inviteCode: string; // 6자리 초대 코드
}

/**
 * 상대방 초대 배너 — user2 미연결 시 표시
 * 초대 코드 복사 버튼 포함, 닫기 시 다시 안 보여줌
 */
export default function InviteBanner({ inviteCode }: InviteBannerProps) {
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(BANNER_DISMISSED_KEY) === "true";
  }); // 배너 닫힘 상태
  const [copied, setCopied] = useState(false); // 복사 완료 상태

  // 이미 닫은 경우 렌더링하지 않음
  if (dismissed) return null;

  /** 초대 코드 클립보드 복사 */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      toast.success("초대 코드가 복사되었어요!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("복사에 실패했어요. 직접 코드를 전달해주세요.");
    }
  };

  /** 배너 닫기 — localStorage에 기록 */
  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem(BANNER_DISMISSED_KEY, "true");
  };

  return (
    <div className="bg-coral-50 border border-coral-200 rounded-2xl p-4 relative">
      {/* 닫기 버튼 */}
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 text-coral-300 hover:text-coral-500"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3">
        {/* 아이콘 */}
        <div className="w-9 h-9 bg-coral-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <UserPlus className="w-4 h-4 text-coral-400" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-coral-600">
            상대방을 초대해보세요
          </p>
          <p className="text-xs text-coral-400 mt-0.5">
            아래 코드를 공유하면 함께 사용할 수 있어요
          </p>

          {/* 초대 코드 + 복사 버튼 */}
          <button
            onClick={handleCopy}
            className="mt-2 flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-coral-200 hover:border-coral-400 transition-colors"
          >
            <span className="text-lg font-bold tracking-widest text-coral-400">
              {inviteCode}
            </span>
            {copied ? (
              <Check className="w-4 h-4 text-green-soft" />
            ) : (
              <Copy className="w-4 h-4 text-coral-300" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
