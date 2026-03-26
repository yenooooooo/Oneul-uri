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
import { useCouple } from "@/hooks/useCouple";
import { useAuth } from "@/hooks/useAuth";
import { Plus, ClipboardList, Sticker } from "lucide-react";
import { calculateAnniversaryDday } from "@/lib/utils";
import { getStickerUrl } from "@/lib/stickers";
import { useCalendarStickers } from "@/hooks/useCalendarStickers";
import StickerPickerModal from "@/components/calendar/StickerPickerModal";
import CalendarSkeleton from "@/components/common/CalendarSkeleton";
import type { Anniversary } from "@/types";

const ANNIVERSARY_ICON: Record<string, string> = {
  birthday: "🎂", auto: "💝", custom: "🎉",
};

/** 영문 월 이름 */
const MONTH_NAMES = ["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE","JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"];

/**
 * 캘린더 페이지 — stitch(3) 스타일
 * 매거진 타이틀 + 넓은 그리드 + 칩 기념일 + 깔끔한 일정
 */
export default function CalendarPage() {
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(todayStr);
  const [showAdd, setShowAdd] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);

  const { user } = useAuth();
  const { couple } = useCouple();
  const { loading, eventDates, addEvent, updateEvent, deleteEvent, getEventsForDate } = useCalendar();
  const { stickers: stickerMap, upsertSticker, removeSticker } = useCalendarStickers(year, month);
  const { anniversaries } = useAnniversary();
  const { planDates, getPlanForDate } = useDatePlans();

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

  const allMarkedDates = useMemo(() => {
    const dates = new Set(eventDates);
    anniversaryMap.forEach((_, d) => dates.add(d));
    planDates.forEach((d) => dates.add(d));
    return dates;
  }, [eventDates, anniversaryMap, planDates]);

  const anniversaryDates = useMemo(() => new Set(anniversaryMap.keys()), [anniversaryMap]);
  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];
  const selectedPlan = selectedDate ? getPlanForDate(selectedDate) : null;

  // 다가오는 기념일 칩 (최대 4개)
  // 다가오는 기념일 — D-day 가까운 순 정렬
  const upcomingAnniversaries = anniversaries
    .filter((a) => calculateAnniversaryDday(a.date, a.is_recurring) <= 0)
    .sort((a, b) =>
      Math.abs(calculateAnniversaryDday(a.date, a.is_recurring))
      - Math.abs(calculateAnniversaryDday(b.date, b.is_recurring))
    )
    .slice(0, 4);

  const handlePrevMonth = () => {
    if (month === 0) { setYear(year - 1); setMonth(11); } else setMonth(month - 1);
  };
  const handleNextMonth = () => {
    if (month === 11) { setYear(year + 1); setMonth(0); } else setMonth(month + 1);
  };
  const handleGoToday = () => {
    const t = new Date();
    setYear(t.getFullYear());
    setMonth(t.getMonth());
    setSelectedDate(t.toISOString().split("T")[0]);
  };

  return (
    <AppLayout>
      <div className="px-6 pt-6 space-y-8 animate-page-in">
        {/* 상단 타이틀 — stitch 매거진 스타일 */}
        <div>
          <p className="text-[10px] font-bold text-txt-tertiary tracking-widest uppercase">
            {MONTH_NAMES[month]} {year}
          </p>
          <h1 className="font-serif-ko text-3xl font-black text-txt-primary">
            {month + 1}월의 기록
          </h1>
        </div>

        {loading ? (
          <CalendarSkeleton />
        ) : (
          <>
            {/* 캘린더 그리드 */}
            <div className="bg-surface-low rounded-3xl p-6">
              <MonthCalendar
                year={year} month={month}
                selectedDate={selectedDate}
                eventDates={allMarkedDates}
                anniversaryDates={anniversaryDates}
                planDates={planDates}
                stickerMap={stickerMap}
                onSelectDate={setSelectedDate}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
                onGoToday={handleGoToday}
              />
            </div>

            {/* 다가오는 기념일 — 칩(pill) 가로 스크롤 */}
            {upcomingAnniversaries.length > 0 && (
              <section className="space-y-3">
                <h3 className="text-sm font-bold text-txt-tertiary">다가오는 기념일</h3>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {upcomingAnniversaries.map((a) => {
                    const dday = calculateAnniversaryDday(a.date, a.is_recurring);
                    const ddayText = dday === 0 ? "D-DAY" : `D${dday}`;
                    return (
                      <div key={a.id}
                        className="flex items-center gap-2 bg-surface-low rounded-full px-4 py-2 flex-shrink-0">
                        <span className="text-sm">{ANNIVERSARY_ICON[a.type] ?? "💝"}</span>
                        <span className="text-sm font-medium text-txt-primary whitespace-nowrap">
                          {a.title}
                        </span>
                        <span className="text-[10px] font-bold text-coral-500 bg-coral-50 px-2 py-0.5 rounded-full">
                          {ddayText}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 플래너 */}
            {selectedDate && (
              <div className="bg-surface-low rounded-2xl p-5">
                {selectedPlan ? (
                  <Link href={`/calendar/plan/${selectedPlan.id}`}
                    className="flex items-center gap-3 active:scale-[0.98] transition-transform">
                    <div className="w-10 h-10 bg-coral-100 rounded-2xl flex items-center justify-center">
                      <ClipboardList className="w-5 h-5 text-coral-500" />
                    </div>
                    <div>
                      <p className="font-medium text-txt-primary text-sm">{selectedPlan.title}</p>
                      <p className="text-xs text-txt-tertiary">
                        {selectedPlan.status === "completed" ? "완료됨" : "탭해서 확인"}
                      </p>
                    </div>
                  </Link>
                ) : (
                  <Link href={`/calendar/plan/new?date=${selectedDate}`}
                    className="flex items-center gap-3 text-coral-500 active:scale-[0.98] transition-transform">
                    <div className="w-10 h-10 bg-coral-50 rounded-2xl flex items-center justify-center">
                      <ClipboardList className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-medium">데이트 플래너 만들기</p>
                  </Link>
                )}
              </div>
            )}

            {/* 스티커 붙이기 버튼 */}
            {selectedDate && (
              <button onClick={() => setShowStickerPicker(true)}
                className="flex items-center gap-2 bg-surface-low rounded-2xl px-5 py-3 active:scale-[0.98] transition-transform w-full">
                {stickerMap.get(selectedDate) ? (
                  <img src={getStickerUrl(stickerMap.get(selectedDate)!, 64)} alt=""
                    className="w-8 h-8 object-contain" />
                ) : (
                  <span className="text-lg">🎨</span>
                )}
                <span className="text-sm font-medium text-txt-primary flex-1 text-left">
                  {stickerMap.get(selectedDate) ? "스티커 변경하기" : "스티커 붙이기"}
                </span>
                <Sticker className="w-4 h-4 text-txt-tertiary" />
              </button>
            )}

            {/* 오늘의 일정 */}
            {selectedDate && (
              <section className="space-y-3">
                <h3 className="text-sm font-bold text-txt-tertiary">오늘의 일정</h3>
                <div className="bg-surface-low rounded-3xl p-5">
                  <DayEventList
                    date={selectedDate}
                    events={selectedEvents}
                    couple={couple}
                    userId={user?.id}
                    onUpdate={updateEvent}
                    onDelete={deleteEvent}
                  />
                </div>
              </section>
            )}
          </>
        )}
      </div>

      <button onClick={() => setShowAdd(true)} disabled={!selectedDate}
        style={{ bottom: "calc(5.5rem + env(safe-area-inset-bottom, 0px))" }}
        className="fixed right-5 w-14 h-14 bg-coral-500 rounded-full shadow-float flex items-center justify-center text-white active:scale-95 transition-transform z-40 disabled:opacity-40">
        <Plus className="w-6 h-6" />
      </button>

      {showAdd && selectedDate && (
        <EventAddForm selectedDate={selectedDate} onSubmit={addEvent} onClose={() => setShowAdd(false)} />
      )}

      {/* 스티커 선택 모달 */}
      {showStickerPicker && selectedDate && (
        <StickerPickerModal
          date={selectedDate}
          currentSticker={stickerMap.get(selectedDate) ?? null}
          onSelect={(id) => upsertSticker(selectedDate, id)}
          onRemove={() => removeSticker(selectedDate)}
          onClose={() => setShowStickerPicker(false)}
        />
      )}
    </AppLayout>
  );
}
