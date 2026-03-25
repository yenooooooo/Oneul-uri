"use client";

import { calculateDday, formatDate } from "@/lib/utils";
import { getDdayMessage } from "@/lib/dday-messages";

/** DdayCard 컴포넌트 props */
interface DdayCardProps {
  startDate: string;
}

/**
 * D-day 카운터 — "감정의 순간" 코랄 글로우 카드
 * 딥 코랄 배경 + 흰 세리프 + 배경 장식
 */
export default function DdayCard({ startDate }: DdayCardProps) {
  const dday = calculateDday(startDate);
  const { message, emoji } = getDdayMessage(dday);

  return (
    <section className="relative overflow-hidden rounded-3xl p-8 text-center bg-coral-500">
      {/* 배경 장식 원 — 은은한 글로우 */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full" />
      <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-white/5 rounded-full" />

      {/* D-day 숫자 */}
      <p className="font-serif-ko text-5xl font-bold text-white mb-3 relative z-10">
        D + {dday}
      </p>

      {/* 감성 문구 */}
      <p className="text-sm text-white/75 mb-1 relative z-10">
        {message} {emoji}
      </p>

      {/* 사귄 날짜 */}
      <p className="text-xs text-white/50 relative z-10">
        {formatDate(startDate)}부터
      </p>
    </section>
  );
}
