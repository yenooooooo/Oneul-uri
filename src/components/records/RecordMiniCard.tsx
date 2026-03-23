"use client";

import Link from "next/link";
import { MessageSquare, MapPin } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { DateRecord } from "@/types";

/** RecordMiniCard 컴포넌트 props */
interface RecordMiniCardProps {
  record: DateRecord;
}

/**
 * 사진 없는 기록 — 미니 카드 (한 줄, 아이콘 + 제목 + 날짜 + 장소)
 */
export default function RecordMiniCard({ record }: RecordMiniCardProps) {
  return (
    <Link
      href={`/records/${record.id}`}
      className="flex items-center gap-3 px-4 py-3 hover:bg-cream-dark/50 transition-colors active:scale-[0.99]"
    >
      {/* 아이콘 */}
      <MessageSquare className="w-4 h-4 text-coral-300 flex-shrink-0" />

      {/* 제목 */}
      <span className="text-sm font-medium text-txt-primary flex-1 truncate">
        {record.title}
      </span>

      {/* 장소 */}
      {record.location && (
        <span className="flex items-center gap-0.5 text-xs text-txt-tertiary flex-shrink-0">
          <MapPin className="w-3 h-3" />
          {record.location}
        </span>
      )}

      {/* 날짜 */}
      <span className="text-xs text-txt-tertiary flex-shrink-0">
        {formatDate(record.date, "short")}
      </span>
    </Link>
  );
}
