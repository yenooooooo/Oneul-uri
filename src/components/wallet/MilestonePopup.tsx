"use client";

import { useEffect } from "react";
import { useLockScroll } from "@/hooks/useLockScroll";
import { MILESTONES } from "@/types/wallet";
import confetti from "canvas-confetti";

/** MilestonePopup 컴포넌트 props */
interface MilestonePopupProps {
  percent: number; // 달성된 마일스톤 퍼센트 (10, 25, 50, 75, 100)
  onClose: () => void;
}

/**
 * 마일스톤 축하 팝업 — 풀스크린 오버레이
 * 100% 달성 시 confetti 이펙트 발사
 * 3초 후 자동 닫기, 탭으로 수동 닫기 가능
 */
export default function MilestonePopup({ percent, onClose }: MilestonePopupProps) {
  useLockScroll();
  const milestone = MILESTONES.find((m) => m.percent === percent);

  useEffect(() => {
    // 100% 달성 시 confetti 이펙트
    if (percent >= 100) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#FF6B6B", "#FFD66B", "#7EC8A0", "#F5A0B8", "#7EB8E0"],
      });
    }

    // 3초 후 자동 닫기
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [percent, onClose]);

  if (!milestone) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center animate-fade-up"
    >
      <div className="bg-white rounded-3xl p-8 text-center max-w-xs mx-6 shadow-float">
        {/* 이모지 */}
        <p className="text-6xl mb-4">{milestone.emoji}</p>

        {/* 퍼센트 */}
        <p className="text-3xl font-bold text-coral-400 mb-2">{percent}%</p>

        {/* 축하 메시지 */}
        <p className="text-lg font-semibold text-txt-primary">
          {milestone.message}
        </p>

        {/* 닫기 안내 */}
        <p className="text-xs text-txt-tertiary mt-4">탭하면 닫혀요</p>
      </div>
    </div>
  );
}
