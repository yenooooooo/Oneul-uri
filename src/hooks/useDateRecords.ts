"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useCouple } from "@/hooks/useCouple";
import { useAuth } from "@/hooks/useAuth";
import { getCache, setCache, isCacheStale } from "@/lib/cache";
import type { DateRecord, CreateDateRecord, UpdateDateRecord } from "@/types";
import { toast } from "sonner";

/** 한 번에 가져오는 기록 수 */
const PAGE_SIZE = 20;

/**
 * 데이트 기록 CRUD + 무한 스크롤 페이지네이션
 * @returns 기록 목록, 페이지네이션, 액션 함수
 */
export function useDateRecords() {
  const { user } = useAuth();
  const { couple } = useCouple();
  const [records, setRecords] = useState<DateRecord[]>([]); // 기록 목록
  const [loading, setLoading] = useState(true); // 초기 로딩
  const [loadingMore, setLoadingMore] = useState(false); // 추가 로딩
  const [hasMore, setHasMore] = useState(true); // 추가 데이터 존재 여부
  const [totalCount, setTotalCount] = useState(0); // 전체 기록 수
  const supabase = createClient();
  const coupleId = couple?.id;

  /** 첫 페이지 조회 — 캐시 우선, 백그라운드 갱신 */
  const fetchRecords = useCallback(async () => {
    if (!coupleId) return;

    // 캐시에서 즉시 표시 (stale-while-revalidate)
    const cacheKey = `records-${coupleId}`;
    const cached = getCache<{ records: DateRecord[]; count: number }>(cacheKey);
    if (cached) {
      setRecords(cached.records);
      setTotalCount(cached.count);
      setLoading(false);
      // 캐시가 신선하면 네트워크 요청 스킵
      if (!isCacheStale(cacheKey)) return;
    }

    try {
      if (!cached) setLoading(true);
      // 전체 개수 조회
      const { count } = await supabase
        .from("date_records")
        .select("*", { count: "exact", head: true })
        .eq("couple_id", coupleId);
      setTotalCount(count ?? 0);

      // 첫 페이지 데이터 조회
      const { data, error } = await supabase
        .from("date_records").select("*")
        .eq("couple_id", coupleId)
        .order("date", { ascending: false })
        .range(0, PAGE_SIZE - 1);

      if (error) {
        console.error("[useDateRecords/fetch] 조회 실패:", error.message);
        return;
      }
      const fetched = (data as DateRecord[]) ?? [];
      setRecords(fetched);
      setHasMore(fetched.length >= PAGE_SIZE);
      // 캐시에 저장
      setCache(cacheKey, { records: fetched, count: count ?? 0 });
    } catch (error) {
      console.error("[useDateRecords/fetch] 예외:", error);
    } finally {
      setLoading(false);
    }
  }, [coupleId]);

  useEffect(() => {
    if (coupleId) fetchRecords();
  }, [coupleId, fetchRecords]);

  /** 다음 페이지 로드 (무한 스크롤) */
  const loadMore = async () => {
    if (!coupleId || loadingMore || !hasMore) return;
    try {
      setLoadingMore(true);
      const from = records.length;
      const { data, error } = await supabase
        .from("date_records").select("*")
        .eq("couple_id", coupleId)
        .order("date", { ascending: false })
        .range(from, from + PAGE_SIZE - 1);

      if (error) {
        console.error("[useDateRecords/loadMore] 실패:", error.message);
        return;
      }
      const fetched = (data as DateRecord[]) ?? [];
      setRecords((prev) => [...prev, ...fetched]);
      setHasMore(fetched.length >= PAGE_SIZE);
    } catch (error) {
      console.error("[useDateRecords/loadMore] 예외:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  /** 새 기록 생성 */
  const createRecord = async (input: CreateDateRecord): Promise<DateRecord | null> => {
    if (!coupleId || !user) return null;
    try {
      const { data, error } = await supabase
        .from("date_records")
        .insert({
          couple_id: coupleId, author_id: user.id,
          title: input.title, date: input.date,
          location: input.location || null,
          memo: input.memo || null, mood: input.mood || null,
          photos: input.photos || [],
        })
        .select().single();
      if (error) { toast.error("기록 저장에 실패했어요."); return null; }
      const newRecord = data as DateRecord;
      setRecords((prev) =>
        [newRecord, ...prev].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      );
      setTotalCount((prev) => prev + 1);
      toast.success("기록이 저장되었어요!");
      return newRecord;
    } catch (error) {
      console.error("[useDateRecords/create] 예외:", error);
      toast.error("기록 저장 중 오류가 발생했어요.");
      return null;
    }
  };

  /** 기록 수정 */
  const updateRecord = async (id: string, input: UpdateDateRecord): Promise<boolean> => {
    try {
      const { error } = await supabase.from("date_records")
        .update({ ...input, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) { toast.error("기록 수정에 실패했어요."); return false; }
      setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, ...input } : r)));
      toast.success("기록이 수정되었어요!");
      return true;
    } catch (error) {
      console.error("[useDateRecords/update] 예외:", error);
      return false;
    }
  };

  /** 기록 삭제 */
  const deleteRecord = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from("date_records").delete().eq("id", id);
      if (error) { toast.error("기록 삭제에 실패했어요."); return false; }
      setRecords((prev) => prev.filter((r) => r.id !== id));
      setTotalCount((prev) => prev - 1);
      toast.success("기록이 삭제되었어요.");
      return true;
    } catch (error) {
      console.error("[useDateRecords/delete] 예외:", error);
      return false;
    }
  };

  return {
    records, loading, loadingMore, hasMore, totalCount,
    fetchRecords, loadMore, createRecord, updateRecord, deleteRecord,
  };
}
