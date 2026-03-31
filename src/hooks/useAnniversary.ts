"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useCouple } from "@/hooks/useCouple";
import { AUTO_ANNIVERSARIES } from "@/lib/constants";
import { calculateDday, calculateAnniversaryDday, getNextRecurringDate } from "@/lib/utils";
import { getCache, setCache, isCacheStale } from "@/lib/cache";
import type { Anniversary } from "@/types";
import { toast } from "sonner";

/**
 * 기념일 관리 커스텀 훅
 * 자동 기념일 생성 (DB 기반 중복 방지), 생일 연동, 커스텀 등록
 * @returns 기념일 목록 및 액션 함수
 */
export function useAnniversary() {
  const { couple } = useCouple();
  const [anniversaries, setAnniversaries] = useState<Anniversary[]>([]);
  const [loading, setLoading] = useState(true);
  const generatedRef = useRef(false); // 자동 생성 중복 실행 방지
  const supabase = createClient();
  const coupleId = couple?.id;

  /** 기념일 목록을 조회한다 — 캐시 우선 */
  const fetchAnniversaries = useCallback(async () => {
    if (!coupleId) return;
    const cacheKey = `anniversaries-${coupleId}`;
    const cached = getCache<Anniversary[]>(cacheKey);
    if (cached) {
      setAnniversaries(cached);
      setLoading(false);
      if (!isCacheStale(cacheKey)) return;
    }
    try {
      if (!cached) setLoading(true);
      const { data, error } = await supabase
        .from("anniversaries").select("*")
        .eq("couple_id", coupleId)
        .order("date", { ascending: true });
      if (error) { console.error("[useAnniversary/fetch]:", error.message); return; }
      const fetched = (data as Anniversary[]) ?? [];
      setAnniversaries(fetched);
      setCache(cacheKey, fetched);
    } catch (error) {
      console.error("[useAnniversary/fetch] 예외:", error);
    } finally {
      setLoading(false);
    }
  }, [coupleId]);

  useEffect(() => {
    if (coupleId) fetchAnniversaries();
  }, [coupleId, fetchAnniversaries]);

  /**
   * 자동 기념일을 생성한다 — DB에서 기존 목록 조회 후 없는 것만 삽입.
   * ref로 중복 실행 방지 (React StrictMode 대응)
   */
  const generateAutoAnniversaries = useCallback(async (): Promise<void> => {
    if (!couple || generatedRef.current) return;
    generatedRef.current = true;

    try {
      // DB에서 이미 등록된 자동 기념일 title 목록 조회
      const { data: existing, error: fetchErr } = await supabase
        .from("anniversaries")
        .select("title")
        .eq("couple_id", couple.id)
        .in("type", ["auto", "birthday"]);

      if (fetchErr) {
        console.error("[useAnniversary/generate] 기존 조회 실패:", fetchErr.message);
        return;
      }

      const existingTitles = new Set((existing ?? []).map((a: { title: string }) => a.title));
      const startDate = new Date(couple.start_date);

      // 아직 등록되지 않은 자동 기념일만 생성
      const newRows = AUTO_ANNIVERSARIES
        .filter((a) => !existingTitles.has(a.label))
        .map((a) => {
          const date = new Date(startDate);
          date.setDate(date.getDate() + a.days);
          return {
            couple_id: couple.id,
            title: a.label,
            date: date.toISOString().split("T")[0],
            type: "auto" as const,
            is_recurring: false,
          };
        });

      if (newRows.length > 0) {
        const { error } = await supabase.from("anniversaries").insert(newRows);
        if (error) {
          console.error("[useAnniversary/generate] 삽입 실패:", error.message);
        }
      }

      await fetchAnniversaries();
    } catch (error) {
      console.error("[useAnniversary/generate] 예외 발생:", error);
    }
  }, [couple, fetchAnniversaries]);

  /**
   * 생일 기념일을 등록/업데이트한다.
   * @param nickname - 닉네임 ("연호 생일")
   * @param birthday - 생일 날짜 (YYYY-MM-DD)
   */
  const upsertBirthday = async (nickname: string, birthday: string): Promise<void> => {
    if (!couple) return;
    const title = `${nickname} 생일`;

    try {
      // 기존 생일 기념일이 있는지 확인
      const { data: existing } = await supabase
        .from("anniversaries")
        .select("id")
        .eq("couple_id", couple.id)
        .eq("title", title)
        .eq("type", "birthday")
        .maybeSingle();

      if (existing) {
        // 기존 생일 날짜 업데이트
        await supabase
          .from("anniversaries")
          .update({ date: birthday })
          .eq("id", existing.id);
      } else {
        // 새 생일 기념일 등록
        await supabase.from("anniversaries").insert({
          couple_id: couple.id,
          title,
          date: birthday,
          type: "birthday",
          is_recurring: true,
        });
      }

      await fetchAnniversaries();
    } catch (error) {
      console.error("[useAnniversary/upsertBirthday] 예외 발생:", error);
    }
  };

  /** 커스텀 기념일을 등록한다 */
  const addAnniversary = async (
    title: string,
    date: string,
    isRecurring: boolean = false,
    memo?: string
  ): Promise<boolean> => {
    if (!couple) return false;
    try {
      const { error } = await supabase.from("anniversaries").insert({
        couple_id: couple.id,
        title,
        date,
        type: "custom",
        is_recurring: isRecurring,
        memo: memo || null,
      });
      if (error) {
        console.error("[useAnniversary/add] 등록 실패:", error.message);
        toast.error("기념일 등록에 실패했어요.");
        return false;
      }
      toast.success("기념일이 등록되었어요!");
      await fetchAnniversaries();
      return true;
    } catch (error) {
      console.error("[useAnniversary/add] 예외 발생:", error);
      toast.error("기념일 등록 중 오류가 발생했어요.");
      return false;
    }
  };

  /** 기념일을 삭제한다 */
  const deleteAnniversary = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("anniversaries")
        .delete()
        .eq("id", id);
      if (error) {
        console.error("[useAnniversary/delete] 삭제 실패:", error.message);
        toast.error("기념일 삭제에 실패했어요.");
        return false;
      }
      const updated = anniversaries.filter((a) => a.id !== id);
      setAnniversaries(updated);
      setCache(`anniversaries-${coupleId}`, updated);
      toast.success("기념일이 삭제되었어요.");
      return true;
    } catch (error) {
      console.error("[useAnniversary/delete] 예외 발생:", error);
      return false;
    }
  };

  /** 다가오는 기념일 — 반복 기념일은 다가오는 날짜 기준 */
  const upcoming = anniversaries
    .filter((a) => calculateAnniversaryDday(a.date, a.is_recurring) <= 0)
    .sort((a, b) => {
      // 반복 기념일은 다가오는 날짜 기준, 비반복은 원래 날짜 기준 정렬
      const dateA = a.is_recurring ? getNextRecurringDate(a.date) : new Date(a.date);
      const dateB = b.is_recurring ? getNextRecurringDate(b.date) : new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 5);

  /** 지난 기념일 — 반복 기념일은 항상 "다가오는"이므로 여기 포함 안 됨 */
  const past = anniversaries
    .filter((a) => !a.is_recurring && calculateDday(a.date) > 0)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return {
    anniversaries,
    upcoming,
    past,
    loading,
    generateAutoAnniversaries,
    addAnniversary,
    deleteAnniversary,
    upsertBirthday,
  };
}
