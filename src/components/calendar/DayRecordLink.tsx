"use client";

import Link from "next/link";
import type { DateRecord } from "@/types";
import { MOOD_OPTIONS } from "@/types/record";
import { BookOpen } from "lucide-react";
import FadeImage from "@/components/common/FadeImage";

interface Props {
  records: DateRecord[];
}

/**
 * 캘린더 선택 날짜의 데이트 기록 링크
 * 기록이 있으면 썸네일 + 제목으로 표시, 탭하면 기록 상세로 이동
 */
export default function DayRecordLink({ records }: Props) {
  if (records.length === 0) return null;

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-bold text-txt-tertiary">데이트 기록</h3>
      <div className="space-y-2">
        {records.map((r) => {
          const moodEmoji = MOOD_OPTIONS.find((m) => m.value === r.mood)?.emoji;
          return (
            <Link key={r.id} href={`/records/${r.id}`}
              className="flex items-center gap-3 bg-surface-low rounded-2xl p-3 active:scale-[0.98] transition-transform">
              {/* 썸네일 또는 아이콘 */}
              {r.photos?.[0] ? (
                <FadeImage src={r.photos[0]} alt={r.title}
                  className="w-12 h-12 rounded-xl flex-shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-coral-50 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-coral-400" />
                </div>
              )}
              {/* 제목 + 감정 */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-txt-primary truncate">
                  {moodEmoji && <span className="mr-1">{moodEmoji}</span>}
                  {r.title}
                </p>
                {r.location && (
                  <p className="text-xs text-txt-tertiary truncate">{r.location}</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
