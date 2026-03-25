"use client";

import { calculateDday, formatDate } from "@/lib/utils";
import { getDdayMessage } from "@/lib/dday-messages";

interface DdayCardProps {
  startDate: string;
}

/**
 * D-day 카운터 — stitch 스타일
 * 좌측 정렬 + 초대형 세리프 + 서브라인 + 코랄 글로우 박스
 */
export default function DdayCard({ startDate }: DdayCardProps) {
  const dday = calculateDday(startDate);
  const { message, emoji } = getDdayMessage(dday);

  return (
    <section className="space-y-4">
      {/* 서브라인 + D-day 숫자 — 좌측 정렬 */}
      <div className="space-y-1">
        <span className="text-txt-tertiary font-medium text-sm flex items-center gap-2">
          <span className="w-8 h-[1px] bg-surface-highest" />
          우리만의 특별한 시간
        </span>
        <h2 className="text-[4.5rem] leading-none font-black font-serif-ko text-coral-500 tracking-tighter">
          D+{dday}
        </h2>
      </div>

      {/* 감성 문구 박스 */}
      <div className="bg-coral-50/50 p-6 rounded-2xl">
        <p className="text-lg font-serif-ko font-semibold text-coral-600 flex items-center gap-2">
          {message} {emoji}
        </p>
        <p className="text-txt-tertiary text-sm mt-1 font-medium">
          {formatDate(startDate, "long")}부터 오늘까지
        </p>
      </div>
    </section>
  );
}
