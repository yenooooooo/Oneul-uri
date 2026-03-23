"use client";

import type { PaceAnalysis } from "@/hooks/useWallet";
import type { WalletGoal } from "@/types/wallet";
import { formatCurrency, formatDate } from "@/lib/utils";

/** 페이스 판정별 스타일 */
const PACE_STYLES = {
  fast: { emoji: "🟢", label: "목표보다 빠른 페이스!", color: "text-green-soft" },
  onTrack: { emoji: "🔵", label: "딱 맞는 페이스!", color: "text-blue-soft" },
  slow: { emoji: "🟠", label: "조금 더 힘내볼까?", color: "text-warning" },
  noData: { emoji: "📊", label: "데이터 수집 중", color: "text-txt-tertiary" },
};

/** PaceAnalysisCard 컴포넌트 props */
interface PaceAnalysisCardProps {
  goal: WalletGoal;
  pace: PaceAnalysis;
}

/**
 * 페이스 분석 카드 — 기간 vs 금액 비교 + 예상 달성일
 */
export default function PaceAnalysisCard({ goal, pace }: PaceAnalysisCardProps) {
  const style = PACE_STYLES[pace.status];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-soft space-y-4">
      {/* 페이스 판정 헤더 */}
      <div className="flex items-center gap-2">
        <span className="text-lg">{style.emoji}</span>
        <span className={`font-semibold text-sm ${style.color}`}>{style.label}</span>
      </div>

      {/* 기간 vs 금액 비교 바 */}
      {goal.target_date && (
        <div className="space-y-3">
          {/* 경과 기간 바 */}
          <div>
            <div className="flex justify-between text-xs text-txt-secondary mb-1">
              <span>경과 기간</span>
              <span>{pace.timePercent}%</span>
            </div>
            <div className="h-2 bg-cream-dark rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-soft rounded-full transition-all"
                style={{ width: `${pace.timePercent}%` }}
              />
            </div>
          </div>

          {/* 달성 금액 바 */}
          <div>
            <div className="flex justify-between text-xs text-txt-secondary mb-1">
              <span>달성 금액</span>
              <span>{pace.amountPercent}%</span>
            </div>
            <div className="h-2 bg-cream-dark rounded-full overflow-hidden">
              <div
                className="h-full bg-coral-400 rounded-full transition-all"
                style={{ width: `${pace.amountPercent}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 예상 달성일 */}
      <div className="bg-cream rounded-xl p-3">
        {pace.monthlyAvg > 0 && pace.estimatedDate ? (
          <div className="space-y-1">
            <p className="text-sm text-txt-primary">
              🎯 이 페이스면 <strong>{formatDate(pace.estimatedDate, "long")}</strong> 달성 예정
            </p>
            <p className="text-xs text-txt-tertiary">
              월 평균 {formatCurrency(pace.monthlyAvg)} 저축 중
            </p>
            {/* 목표일 대비 빠른지/느린지 안내 */}
            {goal.target_date && pace.monthlyNeeded && (
              <p className="text-xs text-txt-secondary mt-1">
                {pace.status === "slow"
                  ? `목표일까지 매월 약 ${formatCurrency(pace.monthlyNeeded)}씩 저축하면 달성할 수 있어요`
                  : pace.estimatedDate < goal.target_date
                    ? "🎉 목표보다 빠르게 달성할 수 있어요!"
                    : ""}
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-txt-tertiary text-center">
            데이터가 쌓이면 예상 달성일을 알려드릴게요
          </p>
        )}
      </div>
    </div>
  );
}
