"use client";

import type { WalletGoal } from "@/types/wallet";

/** 체크포인트 위치 (25%, 50%, 75%) */
const CHECKPOINTS = [25, 50, 75];

/** AirplaneTracker 컴포넌트 props */
interface AirplaneTrackerProps {
  goal: WalletGoal;
}

/**
 * 비행기 트래커 프로그레스 바
 * 출발(🏠) → 비행기(✈️) → 도착(🏝️) 시각화
 * 마일스톤 달성 체크포인트에 ✅ 표시
 */
export default function AirplaneTracker({ goal }: AirplaneTrackerProps) {
  // 달성률 (0~100)
  const progress = Math.min(
    Math.round((goal.current_amount / goal.target_amount) * 100), 100
  );
  const milestones = goal.achieved_milestones ?? [];

  return (
    <div className="space-y-2">
      {/* 출발 — 비행기 — 도착 아이콘 */}
      <div className="relative h-10">
        {/* 출발 아이콘 */}
        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-lg">🏠</span>

        {/* 도착 아이콘 */}
        <span className="absolute right-0 top-1/2 -translate-y-1/2 text-lg">🏝️</span>

        {/* 비행기 아이콘 — 달성률 위치에 표시 */}
        <span
          className="absolute top-1/2 -translate-y-1/2 text-xl transition-all duration-1000 ease-out -translate-x-1/2"
          style={{ left: `calc(10% + ${progress * 0.8}%)` }}
        >
          ✈️
        </span>
      </div>

      {/* 프로그레스 바 트랙 */}
      <div className="relative mx-7">
        {/* 배경 트랙 */}
        <div className="h-2.5 bg-surface-high rounded-full overflow-hidden">
          {/* 채워진 바 */}
          <div
            className="h-full bg-gradient-to-r from-coral-300 to-coral-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* 체크포인트 도트 (25%, 50%, 75%) */}
        {CHECKPOINTS.map((cp) => (
          <div
            key={cp}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
            style={{ left: `${cp}%` }}
          >
            {milestones.includes(cp) ? (
              <span className="text-xs">✅</span>
            ) : (
              <div className={`w-2 h-2 rounded-full border-2 ${
                progress >= cp
                  ? "bg-coral-400 border-coral-400"
                  : "bg-white border-coral-200"
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* 달성률 텍스트 */}
      <p className="text-center text-sm font-medium text-coral-400">
        현재 {progress}% 도달
      </p>
    </div>
  );
}
