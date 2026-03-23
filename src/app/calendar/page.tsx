"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";
import MonthCalendar from "@/components/calendar/MonthCalendar";
import DayEventList from "@/components/calendar/DayEventList";
import EventAddForm from "@/components/calendar/EventAddForm";
import { useCalendar } from "@/hooks/useCalendar";
import { useAnniversary } from "@/hooks/useAnniversary";
import { useDatePlans } from "@/hooks/useDatePlans";
import { Plus, Loader2, ClipboardList } from "lucide-react";
import type { Anniversary } from "@/types";

/** 기념일 타입별 아이콘 이모지 */
const ANNIVERSARY_ICON: Record<string, string> = {
  birthday: "🎂", auto: "💝", custom: "🎉",
};

/**
 * 공유 캘린더 페이지 — /calendar
 * 월간 캘린더 + 기념일 + 일정 + 데이트 플래너 연동
 */
export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(
    today.toISOString().split("T")[0]
  );
  const [showAdd, setShowAdd] = useState(false);

  const { loading, eventDates, addEvent, deleteEvent, getEventsForDate } = useCalendar();
  const { anniversaries } = useAnniversary();
  const { planDates, getPlanForDate } = useDatePlans();

  // 기념일 날짜 Map (recurring 대응)
  const anniversaryMap = useMemo(() => {
    const map = new Map<string, Anniversary[]>();
    anniversaries.forEach((a) => {
      const orig = new Date(a.date);
      const dateStr = a.is_recurring
        ? `${year}-${String(orig.getMonth() + 1).padStart(2, "0")}-${String(orig.getDate()).padStart(2, "0")}`
        : a.date;
      const list = map.get(dateStr) ?? [];
      list.push(a);
      map.set(dateStr, list);
    });
    return map;
  }, [anniversaries, year]);

  // 전체 마커 날짜 합치기
  const allMarkedDates = useMemo(() => {
    const dates = new Set(eventDates);
    anniversaryMap.forEach((_, d) => dates.add(d));
    planDates.forEach((d) => dates.add(d));
    return dates;
  }, [eventDates, anniversaryMap, planDates]);

  const anniversaryDates = useMemo(() => new Set(anniversaryMap.keys()), [anniversaryMap]);

  // 선택된 날짜의 데이터
  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];
  const selectedAnniversaries = selectedDate ? (anniversaryMap.get(selectedDate) ?? []) : [];
  const selectedPlan = selectedDate ? getPlanForDate(selectedDate) : null;

  const handlePrevMonth = () => {
    if (month === 0) { setYear(year - 1); setMonth(11); } else setMonth(month - 1);
  };
  const handleNextMonth = () => {
    if (month === 11) { setYear(year + 1); setMonth(0); } else setMonth(month + 1);
  };

  return (
    <AppLayout>
      <div className="px-4 pt-6 space-y-4">
        <h1 className="text-2xl font-bold text-txt-primary">캘린더</h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-coral-400" />
          </div>
        ) : (
          <>
            <div className="bg-white rounded-3xl p-4 shadow-soft">
              <MonthCalendar
                year={year} month={month}
                selectedDate={selectedDate}
                eventDates={allMarkedDates}
                anniversaryDates={anniversaryDates}
                planDates={planDates}
                onSelectDate={setSelectedDate}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
              />
            </div>

            {/* 데이트 플래너 영역 */}
            {selectedDate && (
              <div className="bg-white rounded-2xl p-4 shadow-soft">
                {selectedPlan ? (
                  <Link
                    href={`/calendar/plan/${selectedPlan.id}`}
                    className="flex items-center gap-3 active:scale-[0.98] transition-transform"
                  >
                    <div className="w-10 h-10 bg-coral-100 rounded-full flex items-center justify-center">
                      <ClipboardList className="w-5 h-5 text-coral-400" />
                    </div>
                    <div>
                      <p className="font-medium text-txt-primary text-sm">{selectedPlan.title}</p>
                      <p className="text-xs text-txt-tertiary">
                        {selectedPlan.status === "completed" ? "완료됨" : "탭해서 확인"}
                      </p>
                    </div>
                  </Link>
                ) : (
                  <Link
                    href={`/calendar/plan/new?date=${selectedDate}`}
                    className="flex items-center gap-3 text-coral-400 active:scale-[0.98] transition-transform"
                  >
                    <div className="w-10 h-10 bg-coral-50 rounded-full flex items-center justify-center">
                      <ClipboardList className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-medium">데이트 플래너 만들기</p>
                  </Link>
                )}
              </div>
            )}

            {/* 기념일 */}
            {selectedAnniversaries.length > 0 && (
              <div className="bg-coral-50 rounded-2xl p-4 space-y-2">
                {selectedAnniversaries.map((a) => (
                  <div key={a.id} className="flex items-center gap-2">
                    <span className="text-lg">{ANNIVERSARY_ICON[a.type] ?? "💝"}</span>
                    <span className="font-medium text-coral-600 text-sm">{a.title}</span>
                  </div>
                ))}
              </div>
            )}

            {/* 일정 목록 */}
            {selectedDate && (
              <div className="bg-white rounded-3xl p-4 shadow-soft">
                <DayEventList date={selectedDate} events={selectedEvents} onDelete={deleteEvent} />
              </div>
            )}
          </>
        )}
      </div>

      <button onClick={() => setShowAdd(true)} disabled={!selectedDate}
        className="fixed bottom-20 right-4 w-14 h-14 bg-coral-400 rounded-full shadow-float flex items-center justify-center text-white active:scale-95 transition-transform z-40 disabled:opacity-40">
        <Plus className="w-6 h-6" />
      </button>

      {showAdd && selectedDate && (
        <EventAddForm selectedDate={selectedDate} onSubmit={addEvent} onClose={() => setShowAdd(false)} />
      )}
    </AppLayout>
  );
}
