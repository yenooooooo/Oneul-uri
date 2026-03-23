"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useCouple } from "@/hooks/useCouple";
import { toast } from "sonner";

/** 룰렛 항목 타입 */
export interface RouletteItem {
  id: string;
  couple_id: string;
  category: string;
  label: string;
  is_default: boolean;
  created_at: string;
}

/** 룰렛 히스토리 타입 */
export interface RouletteHistory {
  id: string;
  couple_id: string;
  category: string;
  result: string;
  created_at: string;
}

/**
 * 데이트 룰렛 관리 커스텀 훅
 * 항목 조회/추가/삭제, 결과 저장, 히스토리 조회
 * @returns 항목/히스토리 및 액션 함수
 */
export function useRoulette() {
  const { couple } = useCouple();
  const [items, setItems] = useState<RouletteItem[]>([]); // 전체 항목
  const [history, setHistory] = useState<RouletteHistory[]>([]); // 히스토리
  const [loading, setLoading] = useState(true); // 로딩
  const supabase = createClient();

  /** 항목 + 히스토리를 조회한다 */
  const fetchData = useCallback(async () => {
    if (!couple) return;

    try {
      setLoading(true);
      const [itemsRes, historyRes] = await Promise.all([
        supabase
          .from("roulette_items")
          .select("*")
          .eq("couple_id", couple.id)
          .order("created_at", { ascending: true }),
        supabase
          .from("roulette_history")
          .select("*")
          .eq("couple_id", couple.id)
          .order("created_at", { ascending: false })
          .limit(20),
      ]);

      if (itemsRes.error) {
        console.error("[useRoulette/fetchData] 항목 조회 실패:", itemsRes.error.message);
      }
      if (historyRes.error) {
        console.error("[useRoulette/fetchData] 히스토리 조회 실패:", historyRes.error.message);
      }

      const fetchedItems = (itemsRes.data as RouletteItem[]) ?? [];
      setItems(fetchedItems);
      setHistory((historyRes.data as RouletteHistory[]) ?? []);

      // 항목이 하나도 없으면 기본 항목 생성
      if (fetchedItems.length === 0) {
        await seedDefaultItems();
      }
    } catch (error) {
      console.error("[useRoulette/fetchData] 예외 발생:", error);
    } finally {
      setLoading(false);
    }
  }, [couple]);

  useEffect(() => {
    if (couple) fetchData();
  }, [couple, fetchData]);

  /** 기본 룰렛 항목을 생성한다 (첫 사용 시) */
  const seedDefaultItems = async () => {
    if (!couple) return;

    const defaults = [
      { category: "food", labels: ["치킨", "피자", "초밥", "삼겹살", "파스타", "떡볶이"] },
      { category: "place", labels: ["카페", "영화관", "한강", "공원", "전시회", "맛집 탐방"] },
      { category: "activity", labels: ["넷플릭스", "보드게임", "산책", "요리", "사진 찍기", "드라이브"] },
    ];

    const rows = defaults.flatMap((cat) =>
      cat.labels.map((label) => ({
        couple_id: couple.id,
        category: cat.category,
        label,
        is_default: true,
      }))
    );

    try {
      const { error } = await supabase.from("roulette_items").insert(rows);
      if (error) {
        console.error("[useRoulette/seedDefaults] 기본 항목 생성 실패:", error.message);
        return;
      }
      await fetchData();
    } catch (error) {
      console.error("[useRoulette/seedDefaults] 예외 발생:", error);
    }
  };

  /**
   * 카테고리별 항목을 필터링한다.
   * @param category - 'food' | 'place' | 'activity'
   */
  const getItemsByCategory = (category: string): RouletteItem[] => {
    return items.filter((item) => item.category === category);
  };

  /**
   * 새 항목을 추가한다.
   * @param category - 카테고리
   * @param label - 항목명
   * @returns 성공 여부
   */
  const addItem = async (category: string, label: string): Promise<boolean> => {
    if (!couple) return false;

    try {
      const { error } = await supabase.from("roulette_items").insert({
        couple_id: couple.id,
        category,
        label,
        is_default: false,
      });

      if (error) {
        console.error("[useRoulette/addItem] 추가 실패:", error.message);
        toast.error("항목 추가에 실패했어요.");
        return false;
      }

      toast.success("항목이 추가되었어요!");
      await fetchData();
      return true;
    } catch (error) {
      console.error("[useRoulette/addItem] 예외 발생:", error);
      return false;
    }
  };

  /**
   * 항목을 삭제한다.
   * @param id - 항목 ID
   */
  const deleteItem = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from("roulette_items").delete().eq("id", id);
      if (error) {
        console.error("[useRoulette/deleteItem] 삭제 실패:", error.message);
        return false;
      }
      setItems((prev) => prev.filter((item) => item.id !== id));
      return true;
    } catch (error) {
      console.error("[useRoulette/deleteItem] 예외 발생:", error);
      return false;
    }
  };

  /**
   * 룰렛 결과를 히스토리에 저장한다.
   * @param category - 카테고리
   * @param result - 선택된 결과
   */
  const saveResult = async (category: string, result: string): Promise<void> => {
    if (!couple) return;

    try {
      const { error } = await supabase.from("roulette_history").insert({
        couple_id: couple.id,
        category,
        result,
      });
      if (error) {
        console.error("[useRoulette/saveResult] 저장 실패:", error.message);
      }
      // 히스토리 로컬 추가
      setHistory((prev) => [
        { id: crypto.randomUUID(), couple_id: couple.id, category, result, created_at: new Date().toISOString() },
        ...prev,
      ]);
    } catch (error) {
      console.error("[useRoulette/saveResult] 예외 발생:", error);
    }
  };

  return {
    items, history, loading,
    getItemsByCategory, addItem, deleteItem, saveResult,
  };
}
