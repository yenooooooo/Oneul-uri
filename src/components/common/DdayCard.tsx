"use client";

import { calculateDday, formatDate } from "@/lib/utils";
import { Heart } from "lucide-react";

/** DdayCard 컴포넌트 props */
interface DdayCardProps {
  startDate: string; // 사귄 날짜 (YYYY-MM-DD)
}

/**
 * D-day 카운터 카드 — 사귄 날짜 기준 D+N일 표시
 * 홈 화면 상단에 큰 숫자로 감성적 표시
 */
export default function DdayCard({ startDate }: DdayCardProps) {
  // 사귄 날짜 기준 경과 일수 계산
  const dday = calculateDday(startDate);

  // 오늘 날짜를 포맷팅
  const today = new Date().toISOString().split("T")[0];

  return (
    <section className="bg-white rounded-3xl p-6 shadow-soft text-center">
      {/* 하트 아이콘 */}
      <Heart className="w-6 h-6 text-coral-400 fill-coral-400 mx-auto mb-2" />

      {/* D-day 숫자 — 큰 텍스트 */}
      <p className="text-5xl font-extrabold text-coral-400 mb-1">
        D + {dday}
      </p>

      {/* 날짜 범위 표시 */}
      <p className="text-sm text-txt-tertiary">
        {formatDate(startDate)} ~ {formatDate(today)}
      </p>
    </section>
  );
}
