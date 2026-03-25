"use client";

import Link from "next/link";
import { PenSquare } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { MOOD_OPTIONS } from "@/types/record";
import type { DateRecord } from "@/types";

interface RecordMiniCardProps {
  record: DateRecord;
}

/**
 * 글 기록 — stitch(4) 스타일 (아이콘 + 텍스트 + 날짜)
 */
export default function RecordMiniCard({ record }: RecordMiniCardProps) {
  const moodEmoji = MOOD_OPTIONS.find((m) => m.value === record.mood)?.emoji;

  return (
    <Link
      href={`/records/${record.id}`}
      className="flex items-center gap-4 py-4 px-5 bg-surface-low rounded-xl active:bg-surface-high transition-colors"
    >
      <span className="text-lg flex-shrink-0">
        {moodEmoji ?? <PenSquare className="w-5 h-5 text-coral-500" />}
      </span>
      <p className="text-txt-primary font-medium flex-1 truncate">
        {record.memo || record.title}
      </p>
      <span className="text-[10px] font-bold text-txt-tertiary uppercase flex-shrink-0">
        {formatDate(record.date, "short")}
      </span>
    </Link>
  );
}
