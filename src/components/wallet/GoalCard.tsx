"use client";

import { formatCurrency } from "@/lib/utils";
import type { WalletGoal } from "@/types";

/** GoalCard 컴포넌트 props */
interface GoalCardProps {
  goal: WalletGoal;
}

/**
 * 통장 목표 카드 — 프로그레스 바 + 잔액 + 달성률 표시
 */
export default function GoalCard({ goal }: GoalCardProps) {
  // 달성률 퍼센트 (0~100)
  const progress = Math.min(
    Math.round((goal.current_amount / goal.target_amount) * 100),
    100
  );

  return (
    <div className="bg-white rounded-3xl p-5 shadow-soft">
      {/* 목표 제목 + 달성 뱃지 */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-txt-primary">{goal.title}</h3>
        {goal.is_achieved && (
          <span className="text-xs bg-green-soft/20 text-green-soft px-2 py-0.5 rounded-full font-medium">
            달성!
          </span>
        )}
      </div>

      {/* 금액 표시 */}
      <div className="mb-3">
        <span className="text-2xl font-bold text-coral-400">
          {formatCurrency(goal.current_amount)}
        </span>
        <span className="text-sm text-txt-tertiary ml-1">
          / {formatCurrency(goal.target_amount)}
        </span>
      </div>

      {/* 프로그레스 바 */}
      <div className="w-full h-3 bg-cream-dark rounded-full overflow-hidden">
        <div
          className="h-full bg-coral-400 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 퍼센트 */}
      <p className="text-xs text-txt-tertiary text-right mt-1">
        {progress}%
      </p>
    </div>
  );
}
