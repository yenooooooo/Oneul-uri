"use client";

import { useCouple } from "@/hooks/useCouple";
import { calculateDday } from "@/lib/utils";
import { BookOpen } from "lucide-react";

/** RecordSummary 컴포넌트 props */
interface RecordSummaryProps {
  totalCount: number;
}

/**
 * 기록 상단 요약 — 총 기록 수 + 경과 일수 + 기록률
 */
export default function RecordSummary({ totalCount }: RecordSummaryProps) {
  const { couple } = useCouple();

  // 사귄 날부터 경과 일수
  const totalDays = couple ? calculateDday(couple.start_date) : 0;

  // 기록률 (기록 수 / 경과 일수 %)
  const recordRate = totalDays > 0
    ? Math.min(Math.round((totalCount / totalDays) * 100), 100)
    : 0;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-soft">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="w-5 h-5 text-coral-400" />
        <h2 className="font-semibold text-txt-primary">우리의 기록</h2>
      </div>

      {/* 통계 */}
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-2xl font-bold text-coral-400">{totalCount}</span>
        <span className="text-sm text-txt-secondary">번째 기록</span>
        <span className="text-sm text-txt-tertiary mx-1">·</span>
        <span className="text-sm text-txt-secondary">
          첫 데이트부터 {totalDays}일
        </span>
      </div>

      {/* 기록률 프로그레스 바 */}
      {totalDays > 0 && (
        <div>
          <div className="h-1.5 bg-cream-dark rounded-full overflow-hidden">
            <div
              className="h-full bg-coral-300 rounded-full transition-all"
              style={{ width: `${recordRate}%` }}
            />
          </div>
          <p className="text-xs text-txt-tertiary mt-1 text-right">
            {totalDays}일 중 {totalCount}일 기록 ({recordRate}%)
          </p>
        </div>
      )}
    </div>
  );
}
