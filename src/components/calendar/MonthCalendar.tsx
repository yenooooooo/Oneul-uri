"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getStickerEmoji } from "@/lib/stickers";

interface MonthCalendarProps {
  year: number;
  month: number;
  selectedDate: string | null;
  eventDates: Set<string>;
  anniversaryDates?: Set<string>;
  planDates?: Set<string>;
  stickerMap?: Map<string, string>; // 날짜→스티커ID
  onSelectDate: (date: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onGoToday?: () => void;
}

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

/**
 * 월간 캘린더 — 스티커 표시 지원
 * 스티커 있는 날: 날짜 숫자(상단 작게) + 스티커 이모지(중앙)
 */
export default function MonthCalendar({
  year, month, selectedDate, eventDates,
  anniversaryDates, planDates, stickerMap,
  onSelectDate, onPrevMonth, onNextMonth, onGoToday,
}: MonthCalendarProps) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDayOfWeek = firstDay.getDay();
  const today = new Date().toISOString().split("T")[0];

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) cells.push(d);

  const toDateString = (day: number): string => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  return (
    <div>
      {/* 월 이동 */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onPrevMonth} className="p-2 text-txt-tertiary active:scale-90">
          <ChevronLeft className="w-5 h-5" />
        </button>
        {onGoToday && (
          <button onClick={onGoToday}
            className="text-xs bg-coral-50 text-coral-500 px-3 py-1 rounded-full font-medium">
            오늘
          </button>
        )}
        <button onClick={onNextMonth} className="p-2 text-txt-tertiary active:scale-90">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* 영문 요일 */}
      <div className="grid grid-cols-7 mb-3">
        {WEEKDAYS.map((day, i) => (
          <div key={day} className={cn(
            "text-center text-[10px] font-bold tracking-wider py-1",
            i === 0 ? "text-coral-400" : "text-txt-tertiary"
          )}>
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((day, index) => {
          if (day === null) return <div key={`e-${index}`} className="aspect-square" />;

          const dateStr = toDateString(day);
          const isToday = dateStr === today;
          const isSelected = dateStr === selectedDate;
          const hasEvent = eventDates.has(dateStr);
          const hasAnniversary = anniversaryDates?.has(dateStr) ?? false;
          const hasPlan = planDates?.has(dateStr) ?? false;
          const stickerId = stickerMap?.get(dateStr);
          const isSunday = (index % 7) === 0;

          return (
            <button key={dateStr} onClick={() => onSelectDate(dateStr)}
              className={cn(
                "aspect-square flex flex-col items-center justify-center rounded-2xl text-sm transition-all relative",
                isSelected
                  ? "bg-coral-500 text-white font-bold"
                  : hasAnniversary
                    ? "bg-coral-100 text-coral-600 font-semibold"
                    : isToday
                      ? "bg-coral-50 text-coral-500 font-semibold"
                      : isSunday
                        ? "text-coral-300"
                        : "text-txt-primary"
              )}>
              {/* 스티커 있는 날: 숫자 작게 + 이모지 */}
              {stickerId ? (
                <>
                  <span className="text-[9px] leading-none">{day}</span>
                  <span className="text-lg leading-none mt-0.5">
                    {getStickerEmoji(stickerId)}
                  </span>
                </>
              ) : (
                <span>{day}</span>
              )}

              {/* 하단 도트 (스티커 없을 때만) */}
              {!stickerId && !isSelected && hasPlan && (
                <span className="absolute bottom-0.5 text-[6px]">📋</span>
              )}
              {!stickerId && !isSelected && hasAnniversary && !hasPlan && (
                <span className="absolute bottom-0.5 w-1.5 h-1.5 rounded-full bg-coral-400" />
              )}
              {!stickerId && !isSelected && hasEvent && !hasAnniversary && !hasPlan && (
                <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-coral-300" />
              )}

              {/* 스티커 + 이벤트 공존: 스티커 있을 때 하단에 작은 도트 */}
              {stickerId && !isSelected && (hasEvent || hasPlan) && (
                <span className="absolute bottom-0 w-1 h-1 rounded-full bg-coral-400" />
              )}
              {isSelected && (hasEvent || hasAnniversary || hasPlan || stickerId) && (
                <span className="absolute bottom-0.5 w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
