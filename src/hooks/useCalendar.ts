"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useCouple } from "@/hooks/useCouple";
import { useAuth } from "@/hooks/useAuth";
import type { CalendarEvent } from "@/types";
import { toast } from "sonner";

/**
 * 공유 캘린더 일정 관리 커스텀 훅
 * 일정 조회, 생성, 삭제 기능 제공
 * @returns 일정 목록 및 액션 함수
 */
export function useCalendar() {
  const { user } = useAuth();
  const { couple } = useCouple();
  const [events, setEvents] = useState<CalendarEvent[]>([]); // 일정 목록
  const [loading, setLoading] = useState(true); // 로딩 상태
  const supabase = createClient();

  /**
   * 일정 목록을 조회한다.
   * calendar_events 테이블에서 해당 커플의 일정을 날짜순 조회
   */
  const fetchEvents = useCallback(async () => {
    if (!couple) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("calendar_events")
        .select("*")
        .eq("couple_id", couple.id)
        .order("date", { ascending: true });

      if (error) {
        console.error("[useCalendar/fetchEvents] 조회 실패:", error.message);
        return;
      }

      setEvents((data as CalendarEvent[]) ?? []);
    } catch (error) {
      console.error("[useCalendar/fetchEvents] 예외 발생:", error);
    } finally {
      setLoading(false);
    }
  }, [couple]);

  useEffect(() => {
    if (couple) fetchEvents();
  }, [couple, fetchEvents]);

  /**
   * 새 일정을 추가한다.
   * @param title - 일정 제목
   * @param date - 날짜 (YYYY-MM-DD)
   * @param category - 카테고리 (date/personal/anniversary)
   * @param time - 시간 (선택)
   * @param memo - 메모 (선택)
   * @returns 성공 여부
   */
  const addEvent = async (
    title: string,
    date: string,
    category: string = "date",
    time?: string,
    memo?: string
  ): Promise<boolean> => {
    if (!couple || !user) return false;

    try {
      const { error } = await supabase.from("calendar_events").insert({
        couple_id: couple.id,
        author_id: user.id,
        title,
        date,
        time: time || null,
        category,
        memo: memo || null,
      });

      if (error) {
        console.error("[useCalendar/addEvent] 추가 실패:", error.message);
        toast.error("일정 추가에 실패했어요.");
        return false;
      }

      toast.success("일정이 추가되었어요!");
      await fetchEvents();
      return true;
    } catch (error) {
      console.error("[useCalendar/addEvent] 예외 발생:", error);
      toast.error("일정 추가 중 오류가 발생했어요.");
      return false;
    }
  };

  /**
   * 일정을 삭제한다.
   * @param id - 일정 ID
   * @returns 성공 여부
   */
  const deleteEvent = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("calendar_events")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("[useCalendar/deleteEvent] 삭제 실패:", error.message);
        toast.error("일정 삭제에 실패했어요.");
        return false;
      }

      setEvents((prev) => prev.filter((e) => e.id !== id));
      toast.success("일정이 삭제되었어요.");
      return true;
    } catch (error) {
      console.error("[useCalendar/deleteEvent] 예외 발생:", error);
      return false;
    }
  };

  /**
   * 일정을 수정한다.
   * @param id - 일정 ID
   * @param updates - 수정할 필드 (title, date, category, time, memo)
   * @returns 성공 여부
   */
  const updateEvent = async (
    id: string,
    updates: { title?: string; date?: string; category?: string; time?: string; memo?: string }
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("calendar_events")
        .update(updates)
        .eq("id", id);
      if (error) {
        console.error("[useCalendar/updateEvent] 수정 실패:", error.message);
        toast.error("일정 수정에 실패했어요.");
        return false;
      }
      toast.success("일정이 수정되었어요!");
      await fetchEvents();
      return true;
    } catch (error) {
      console.error("[useCalendar/updateEvent] 예외 발생:", error);
      return false;
    }
  };

  /**
   * 특정 날짜의 일정을 반환한다.
   * @param date - 날짜 (YYYY-MM-DD)
   */
  const getEventsForDate = (date: string): CalendarEvent[] => {
    return events.filter((e) => e.date === date);
  };

  /**
   * 일정이 있는 날짜 Set을 반환한다.
   * 캘린더 도트 표시용
   */
  const eventDates = new Set(events.map((e) => e.date));

  return { events, loading, eventDates, addEvent, updateEvent, deleteEvent, getEventsForDate };
}
