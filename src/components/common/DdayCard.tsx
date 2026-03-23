"use client";

import { calculateDday, formatDate } from "@/lib/utils";
import { getDdayMessage } from "@/lib/dday-messages";
import { Heart } from "lucide-react";

/** DdayCard 컴포넌트 props */
interface DdayCardProps {
  startDate: string; // 사귄 날짜 (YYYY-MM-DD)
}

/**
 * D-day 카운터 카드 — 감성 한글 문구 + 계절 이모지
 * 1줄: D+N 큰 숫자
 * 2줄: 기간별 + 계절 감성 문구
 * 3줄: 사귄 날짜 "YYYY.MM.DD부터"
 */
export default function DdayCard({ startDate }: DdayCardProps) {
  // 사귄 날짜 기준 경과 일수
  const dday = calculateDday(startDate);

  // 감성 문구 + 계절 이모지
  const { message, emoji } = getDdayMessage(dday);

  return (
    <section className="bg-white rounded-3xl p-6 shadow-soft text-center">
      {/* 하트 아이콘 */}
      <Heart className="w-6 h-6 text-coral-400 fill-coral-400 mx-auto mb-2" />

      {/* D-day 숫자 — 큰 텍스트 */}
      <p className="text-5xl font-extrabold text-coral-400 mb-2">
        D + {dday}
      </p>

      {/* 감성 한글 문구 + 계절 이모지 */}
      <p className="text-sm text-txt-secondary mb-1">
        {message} {emoji}
      </p>

      {/* 사귄 날짜 */}
      <p className="text-xs text-txt-tertiary">
        {formatDate(startDate)}부터
      </p>
    </section>
  );
}
