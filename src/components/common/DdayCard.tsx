"use client";

import { calculateDday, formatDate } from "@/lib/utils";
import { getDdayMessage } from "@/lib/dday-messages";

/** DdayCard 컴포넌트 props */
interface DdayCardProps {
  startDate: string; // 사귄 날짜 (YYYY-MM-DD)
}

/**
 * D-day 카운터 카드 — 그라데이션 배경 + 세리프 폰트 감성
 * 레퍼런스: stitch/_1 홈 스타일
 */
export default function DdayCard({ startDate }: DdayCardProps) {
  const dday = calculateDday(startDate);
  const { message, emoji } = getDdayMessage(dday);

  return (
    <section className="relative overflow-hidden rounded-3xl p-8 text-center bg-gradient-to-br from-coral-400 via-coral-300 to-pink-soft">
      {/* 배경 장식 원 */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full" />

      {/* D-day 숫자 — 세리프 폰트 */}
      <p className="font-serif-ko text-6xl font-bold text-white mb-2 relative z-10">
        D + {dday}
      </p>

      {/* 감성 한글 문구 */}
      <p className="text-sm text-white/80 mb-1 relative z-10">
        {message} {emoji}
      </p>

      {/* 사귄 날짜 */}
      <p className="text-xs text-white/60 relative z-10">
        {formatDate(startDate)}부터
      </p>
    </section>
  );
}
