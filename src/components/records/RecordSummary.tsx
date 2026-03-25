"use client";

import { useCouple } from "@/hooks/useCouple";
import { calculateDday } from "@/lib/utils";

/** RecordSummary 컴포넌트 props */
interface RecordSummaryProps {
  totalCount: number;
}

/**
 * 기록 상단 요약 — stitch(4) 에디토리얼 스타일
 * 큰 세리프 타이틀 + 2열 숫자 + 프로그레스 + 배경 블러 장식
 */
export default function RecordSummary({ totalCount }: RecordSummaryProps) {
  const { couple } = useCouple();
  const totalDays = couple ? calculateDday(couple.start_date) : 0;
  const recordRate = totalDays > 0
    ? Math.min(Math.round((totalCount / totalDays) * 100), 100) : 0;

  return (
    <div className="bg-white rounded-3xl p-8 relative overflow-hidden">
      <div className="relative z-10">
        <h2 className="font-serif-ko text-3xl font-black text-txt-primary mb-1">
          함께한 기록
        </h2>
        <p className="text-txt-tertiary font-medium mb-8">
          우리의 소중한 순간들이 쌓여가고 있어요.
        </p>

        {/* 2열 숫자 */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <span className="text-[10px] font-bold text-txt-tertiary uppercase tracking-widest block mb-1">
              Total Records
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold font-serif-ko text-coral-500">
                {totalCount}
              </span>
              <span className="text-sm text-txt-tertiary">개</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-txt-tertiary uppercase tracking-widest block mb-1">
              Days Together
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold font-serif-ko text-coral-500">
                {totalDays}
              </span>
              <span className="text-sm text-txt-tertiary">일</span>
            </div>
          </div>
        </div>

        {/* 프로그레스 바 */}
        {totalDays > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-sm font-semibold text-txt-primary">기록 달성률</span>
              <span className="text-sm font-bold text-coral-500">{recordRate}%</span>
            </div>
            <div className="h-3 w-full bg-surface-high rounded-full overflow-hidden">
              <div className="h-full bg-coral-300 rounded-full transition-all"
                style={{ width: `${recordRate}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* 배경 장식 블러 */}
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-coral-500/5 rounded-full blur-3xl" />
    </div>
  );
}
