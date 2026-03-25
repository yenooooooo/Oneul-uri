"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** MonthCalendar 컴포넌트 props */
interface MonthCalendarProps {
  year: number;
  month: number; // 0-indexed (0=1월)
  selectedDate: string | null; // 선택된 날짜 (YYYY-MM-DD)
  eventDates: Set<string>; // 일정이 있는 날짜 Set
  anniversaryDates?: Set<string>; // 기념일 날짜 Set (특별 마커 표시)
  planDates?: Set<string>; // 플래너 날짜 Set (📋 마커 표시)
  onSelectDate: (date: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onGoToday?: () => void; // 오늘 날짜로 이동
}

/** 요일 헤더 */
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

/**
 * 월간 캘린더 그리드 컴포넌트
 * 날짜 셀 클릭으로 선택, 일정 있는 날에 도트 표시
 */
export default function MonthCalendar({
  year,
  month,
  selectedDate,
  eventDates,
  anniversaryDates,
  planDates,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  onGoToday,
}: MonthCalendarProps) {
  // 해당 월의 첫째 날과 마지막 날
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // 첫째 날의 요일 (0=일요일)
  const startDayOfWeek = firstDay.getDay();

  // 오늘 날짜 (YYYY-MM-DD)
  const today = new Date().toISOString().split("T")[0];

  // 캘린더 셀 배열 생성
  const cells: (number | null)[] = [];

  // 첫 주 빈 칸
  for (let i = 0; i < startDayOfWeek; i++) cells.push(null);
  // 날짜 채우기
  for (let d = 1; d <= lastDay.getDate(); d++) cells.push(d);

  /** 날짜를 YYYY-MM-DD 포맷으로 변환 */
  const toDateString = (day: number): string => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  return (
    <div>
      {/* 월 헤더 — 이전/오늘/다음 월 이동 */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={onPrevMonth} className="p-2 text-txt-secondary">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-txt-primary">
            {year}년 {month + 1}월
          </h2>
          {onGoToday && (
            <button
              onClick={onGoToday}
              className="text-xs bg-coral-50 text-coral-400 px-2 py-0.5 rounded-full font-medium"
            >
              오늘
            </button>
          )}
        </div>
        <button onClick={onNextMonth} className="p-2 text-txt-secondary">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((day, i) => (
          <div
            key={day}
            className={cn(
              "text-center text-xs font-medium py-1",
              i === 0 ? "text-coral-400" : "text-txt-tertiary"
            )}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-1">
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
            <button
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              className={cn(
                "aspect-square flex flex-col items-center justify-center rounded-xl text-sm transition-colors relative",
                isSelected
                  ? "bg-coral-500 text-white"
                  : hasAnniversary
                    ? "bg-coral-50 text-coral-500 font-semibold"
                    : isToday
                      ? "bg-coral-50 text-coral-400 font-semibold"
                      : isSunday
                        ? "text-coral-300"
                        : "text-txt-primary"
              )}
            >
              {day}
              {/* 하단 마커: 플래너=📋, 기념일=💝, 일정=도트 */}
              {!isSelected && hasPlan && (
                <span className="absolute bottom-0.5 text-[7px]">📋</span>
              )}
              {!isSelected && hasAnniversary && !hasPlan && (
                <span className="absolute bottom-0.5 text-[8px]">💝</span>
              )}
              {!isSelected && hasEvent && !hasAnniversary && !hasPlan && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-coral-400" />
              )}
              {isSelected && (hasEvent || hasAnniversary || hasPlan) && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-white" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
