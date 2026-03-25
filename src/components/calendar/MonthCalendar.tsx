"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MonthCalendarProps {
  year: number;
  month: number;
  selectedDate: string | null;
  eventDates: Set<string>;
  anniversaryDates?: Set<string>;
  planDates?: Set<string>;
  onSelectDate: (date: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onGoToday?: () => void;
}

/** 영문 요일 헤더 — stitch 스타일 */
const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

/**
 * 월간 캘린더 — stitch(3) 스타일
 * 넓은 셀 + 영문 요일 + 코랄 마커
 */
export default function MonthCalendar({
  year, month, selectedDate, eventDates,
  anniversaryDates, planDates,
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
      {/* 월 이동 — 좌우 화살표 */}
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

      {/* 영문 요일 헤더 */}
      <div className="grid grid-cols-7 mb-3">
        {WEEKDAYS.map((day, i) => (
          <div key={day}
            className={cn(
              "text-center text-[10px] font-bold tracking-wider py-1",
              i === 0 ? "text-coral-400" : "text-txt-tertiary"
            )}>
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 — 넓은 간격 */}
      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const dateStr = toDateString(day);
          const isToday = dateStr === today;
          const isSelected = dateStr === selectedDate;
          const hasEvent = eventDates.has(dateStr);
          const hasAnniversary = anniversaryDates?.has(dateStr) ?? false;
          const hasPlan = planDates?.has(dateStr) ?? false;
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
              {day}
              {!isSelected && hasPlan && (
                <span className="absolute bottom-0.5 text-[6px]">📋</span>
              )}
              {!isSelected && hasAnniversary && !hasPlan && (
                <span className="absolute bottom-0.5 w-1.5 h-1.5 rounded-full bg-coral-400" />
              )}
              {!isSelected && hasEvent && !hasAnniversary && !hasPlan && (
                <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-coral-300" />
              )}
              {isSelected && (hasEvent || hasAnniversary || hasPlan) && (
                <span className="absolute bottom-0.5 w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
