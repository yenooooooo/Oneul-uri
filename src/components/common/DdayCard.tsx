"use client";

import { calculateDday, formatDate } from "@/lib/utils";
import { getDdayMessage } from "@/lib/dday-messages";

/** DdayCard 컴포넌트 props */
interface DdayCardProps {
  startDate: string;
}

/**
 * D-day 카운터 — Editorial Keepsake 스타일
 * Tonal layering (그림자 없이 배경색으로 깊이감)
 * 세리프 폰트 + 넉넉한 여백
 */
export default function DdayCard({ startDate }: DdayCardProps) {
  const dday = calculateDday(startDate);
  const { message, emoji } = getDdayMessage(dday);

  return (
    <section className="bg-surface-low rounded-3xl p-8 text-center">
      {/* D-day 숫자 — 세리프, 큰 사이즈 */}
      <p className="font-serif-ko text-5xl font-bold text-coral-500 mb-3">
        D + {dday}
      </p>

      {/* 감성 문구 */}
      <p className="text-sm text-txt-secondary mb-1.5">
        {message} {emoji}
      </p>

      {/* 사귄 날짜 */}
      <p className="text-xs text-txt-tertiary">
        {formatDate(startDate)}부터
      </p>
    </section>
  );
}
