"use client";

import { Trash2, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { CalendarEvent } from "@/types";

/** DayEventList 컴포넌트 props */
interface DayEventListProps {
  date: string; // 선택된 날짜 (YYYY-MM-DD)
  events: CalendarEvent[];
  onDelete: (id: string) => Promise<boolean>;
}

/** 카테고리별 색상 */
const CATEGORY_COLORS: Record<string, string> = {
  date: "bg-coral-400",
  personal: "bg-blue-soft",
  anniversary: "bg-yellow-warm",
};

/**
 * 선택된 날짜의 일정 목록 컴포넌트
 * 캘린더 아래에 표시
 */
export default function DayEventList({ date, events, onDelete }: DayEventListProps) {
  if (events.length === 0) {
    return (
      <p className="text-sm text-txt-tertiary text-center py-4">
        {formatDate(date, "short")}에 일정이 없어요
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-txt-secondary">
        {formatDate(date, "long")}
      </p>
      {events.map((event) => (
        <div
          key={event.id}
          className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-soft"
        >
          {/* 카테고리 도트 */}
          <div
            className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
              CATEGORY_COLORS[event.category] ?? "bg-gray-300"
            }`}
          />

          {/* 일정 정보 */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-txt-primary truncate">
              {event.title}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              {event.time && (
                <span className="flex items-center gap-0.5 text-xs text-txt-tertiary">
                  <Clock className="w-3 h-3" />
                  {event.time.slice(0, 5)}
                </span>
              )}
              {event.memo && (
                <span className="text-xs text-txt-tertiary truncate">
                  {event.memo}
                </span>
              )}
            </div>
          </div>

          {/* 삭제 버튼 */}
          <button
            onClick={() => onDelete(event.id)}
            className="p-1 text-txt-tertiary hover:text-error"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
