"use client";

import { useState } from "react";
import { useLockScroll } from "@/hooks/useLockScroll";
import { Button } from "@/components/ui/button";
import { PartyPopper, Loader2 } from "lucide-react";

/** PlanCompleteModal 컴포넌트 props */
interface PlanCompleteModalProps {
  planTitle: string;
  onComplete: (convertToRecord: boolean) => Promise<void>;
  onClose: () => void;
}

/**
 * 데이트 완료 확인 모달
 * "기록으로 남기기" 또는 "나중에 할게" 선택
 */
export default function PlanCompleteModal({
  planTitle, onComplete, onClose,
}: PlanCompleteModalProps) {
  useLockScroll();
  const [loading, setLoading] = useState(false);

  /** 기록으로 전환 */
  const handleConvert = async () => {
    setLoading(true);
    await onComplete(true);
    setLoading(false);
  };

  /** 완료만 처리 */
  const handleSkip = async () => {
    setLoading(true);
    await onComplete(false);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl p-6 w-full max-w-xs text-center space-y-4">
        <PartyPopper className="w-12 h-12 text-coral-400 mx-auto" />

        <div>
          <p className="font-semibold text-txt-primary text-lg">데이트 완료!</p>
          <p className="text-sm text-txt-secondary mt-1">
            &ldquo;{planTitle}&rdquo; 어땠어?
          </p>
          <p className="text-sm text-txt-secondary">
            기록으로 남길까?
          </p>
        </div>

        <div className="space-y-2">
          <Button
            onClick={handleConvert}
            disabled={loading}
            className="w-full rounded-full bg-coral-500 hover:bg-coral-600 text-white"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "기록으로 남기기"}
          </Button>
          <Button
            onClick={handleSkip}
            disabled={loading}
            variant="outline"
            className="w-full rounded-full border-coral-200 text-txt-secondary"
          >
            나중에 할게
          </Button>
          <button onClick={onClose} className="text-xs text-txt-tertiary">
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
