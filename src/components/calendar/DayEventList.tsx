"use client";

import { useState } from "react";
import { Trash2, Clock, Pencil } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { CalendarEvent, Couple } from "@/types";
import EventEditForm from "@/components/calendar/EventEditForm";

/** DayEventList 컴포넌트 props */
interface DayEventListProps {
  date: string;
  events: CalendarEvent[];
  couple: Couple | null;
  userId: string | undefined;
  onUpdate: (id: string, updates: { title?: string; category?: string; time?: string; memo?: string }) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

/** 카테고리별 색상 */
const CATEGORY_COLORS: Record<string, string> = {
  date: "bg-coral-400",
  personal: "bg-blue-soft",
  anniversary: "bg-yellow-warm",
};

/**
 * 선택된 날짜의 일정 목록 — 수정/삭제 + 작성자 표시
 * user1 = 파랑 테두리, user2 = 핑크 테두리
 */
export default function DayEventList({
  date, events, couple, userId, onUpdate, onDelete,
}: DayEventListProps) {
  const [editEvent, setEditEvent] = useState<CalendarEvent | null>(null);

  /** 작성자 닉네임 반환 */
  const getAuthorName = (authorId: string): string | null => {
    if (!couple) return null;
    if (authorId === couple.user1_id) return couple.user1_nickname;
    if (authorId === couple.user2_id) return couple.user2_nickname;
    return null;
  };

  /** 작성자가 나인지 상대방인지 — 도트 색상 결정 */
  const isMyEvent = (authorId: string): boolean => authorId === userId;

  if (events.length === 0) {
    return (
      <p className="text-sm text-txt-tertiary text-center py-4">
        {formatDate(date, "short")}에 일정이 없어요
      </p>
    );
  }

  return (
    <>
      <div className="space-y-2">
        <p className="text-sm font-medium text-txt-secondary">
          {formatDate(date, "long")}
        </p>
        {events.map((event) => {
          const authorName = getAuthorName(event.author_id);
          const mine = isMyEvent(event.author_id);

          return (
            <div
              key={event.id}
              className={`flex items-center gap-3 rounded-xl p-3 shadow-soft border-l-[3px] ${
                mine ? "border-l-blue-soft bg-white" : "border-l-pink-soft bg-white"
              }`}
            >
              {/* 카테고리 도트 */}
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                CATEGORY_COLORS[event.category] ?? "bg-gray-300"
              }`} />

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
                  {authorName && (
                    <span className={`text-xs ${mine ? "text-blue-soft" : "text-pink-soft"}`}>
                      {authorName}
                    </span>
                  )}
                  {event.memo && (
                    <span className="text-xs text-txt-tertiary truncate">{event.memo}</span>
                  )}
                </div>
              </div>

              {/* 수정/삭제 */}
              <button onClick={() => setEditEvent(event)} className="p-1 text-txt-tertiary">
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => onDelete(event.id)} className="p-1 text-txt-tertiary hover:text-error">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* 일정 수정 모달 */}
      {editEvent && (
        <EventEditForm
          event={editEvent}
          onSubmit={async (updates) => {
            const ok = await onUpdate(editEvent.id, updates);
            if (ok) setEditEvent(null);
          }}
          onClose={() => setEditEvent(null)}
        />
      )}
    </>
  );
}
