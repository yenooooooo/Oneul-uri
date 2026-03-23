"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useCouple } from "@/hooks/useCouple";
import { useAuth } from "@/hooks/useAuth";
import type { DatePlan, DatePlanItem, CreateDatePlan, CreatePlanItem } from "@/types/planner";
import { toast } from "sonner";

/**
 * 데이트 플래너 CRUD 훅
 * 플래너 조회/생성, 아이템 CRUD, 기록 전환 기능
 */
export function useDatePlans() {
  const { user } = useAuth();
  const { couple } = useCouple();
  const [plans, setPlans] = useState<DatePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const coupleId = couple?.id;

  /** 플래너 전체 목록 조회 */
  const fetchPlans = useCallback(async () => {
    if (!coupleId) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("date_plans").select("*")
        .eq("couple_id", coupleId)
        .order("date", { ascending: true });
      if (error) console.error("[useDatePlans/fetch]:", error.message);
      setPlans((data as DatePlan[]) ?? []);
    } catch (error) {
      console.error("[useDatePlans/fetch] 예외:", error);
    } finally {
      setLoading(false);
    }
  }, [coupleId]);

  useEffect(() => { if (coupleId) fetchPlans(); }, [coupleId, fetchPlans]);

  /** 새 플래너 생성 → 생성된 ID 반환 */
  const createPlan = async (input: CreateDatePlan): Promise<string | null> => {
    if (!coupleId || !user) return null;
    try {
      const { data, error } = await supabase.from("date_plans")
        .insert({ couple_id: coupleId, author_id: user.id, title: input.title, date: input.date })
        .select().single();
      if (error) { toast.error("플래너 생성에 실패했어요."); return null; }
      toast.success("데이트 플래너가 생성되었어요!");
      await fetchPlans();
      return (data as DatePlan).id;
    } catch (error) {
      console.error("[useDatePlans/create] 예외:", error);
      return null;
    }
  };

  /** 플래너 삭제 */
  const deletePlan = async (planId: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from("date_plans").delete().eq("id", planId);
      if (error) { toast.error("삭제에 실패했어요."); return false; }
      setPlans((prev) => prev.filter((p) => p.id !== planId));
      toast.success("플래너가 삭제되었어요.");
      return true;
    } catch (error) {
      console.error("[useDatePlans/delete] 예외:", error);
      return false;
    }
  };

  /** 특정 플래너의 아이템 목록 조회 */
  const fetchItems = async (planId: string): Promise<DatePlanItem[]> => {
    try {
      const { data, error } = await supabase
        .from("date_plan_items").select("*")
        .eq("plan_id", planId)
        .order("sort_order", { ascending: true });
      if (error) { console.error("[useDatePlans/fetchItems]:", error.message); return []; }
      return (data as DatePlanItem[]) ?? [];
    } catch (error) {
      console.error("[useDatePlans/fetchItems] 예외:", error);
      return [];
    }
  };

  /** 아이템 추가 */
  const addItem = async (planId: string, input: CreatePlanItem, sortOrder: number): Promise<boolean> => {
    try {
      const { error } = await supabase.from("date_plan_items").insert({
        plan_id: planId, sort_order: sortOrder, time: input.time || null,
        category: input.category, title: input.title,
        memo: input.memo || null, link: input.link || null,
        is_from_roulette: input.is_from_roulette ?? false,
      });
      if (error) { toast.error("항목 추가에 실패했어요."); return false; }
      return true;
    } catch (error) {
      console.error("[useDatePlans/addItem] 예외:", error);
      return false;
    }
  };

  /** 아이템 수정 */
  const updateItem = async (itemId: string, input: Partial<CreatePlanItem>): Promise<boolean> => {
    try {
      const { error } = await supabase.from("date_plan_items")
        .update({ ...input }).eq("id", itemId);
      if (error) { toast.error("수정에 실패했어요."); return false; }
      return true;
    } catch (error) {
      console.error("[useDatePlans/updateItem] 예외:", error);
      return false;
    }
  };

  /** 아이템 삭제 */
  const deleteItem = async (itemId: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from("date_plan_items").delete().eq("id", itemId);
      if (error) return false;
      return true;
    } catch (error) {
      console.error("[useDatePlans/deleteItem] 예외:", error);
      return false;
    }
  };

  /** 플래너 완료 처리 + 기록 전환 메모 자동 생성 */
  const completePlan = async (
    planId: string, items: DatePlanItem[], convertToRecord: boolean
  ): Promise<string | null> => {
    try {
      // status를 completed로 변경
      await supabase.from("date_plans").update({ status: "completed" }).eq("id", planId);
      const plan = plans.find((p) => p.id === planId);

      if (convertToRecord && plan && user && coupleId) {
        // 아이템들을 요약 텍스트로 변환
        const memo = items
          .filter((i) => i.time)
          .sort((a, b) => (a.time ?? "").localeCompare(b.time ?? ""))
          .map((i) => `${i.time} ${i.title}`)
          .join(" → ");

        // date_records에 기록 생성
        const { data: record, error } = await supabase.from("date_records")
          .insert({
            couple_id: coupleId, author_id: user.id,
            title: plan.title, date: plan.date,
            memo: memo || null, photos: [],
          })
          .select().single();

        if (!error && record) {
          // 플래너에 기록 ID 연결
          await supabase.from("date_plans")
            .update({ converted_record_id: record.id })
            .eq("id", planId);
          await fetchPlans();
          return record.id as string;
        }
      }

      await fetchPlans();
      return null;
    } catch (error) {
      console.error("[useDatePlans/complete] 예외:", error);
      return null;
    }
  };

  /** 특정 날짜의 플래너 조회 */
  const getPlanForDate = (date: string): DatePlan | null => {
    return plans.find((p) => p.date === date) ?? null;
  };

  /** 다가오는 플래너 (planned + 오늘 이후) */
  const upcomingPlan = plans.find(
    (p) => p.status === "planned" && p.date >= new Date().toISOString().split("T")[0]
  ) ?? null;

  /** 플래너가 있는 날짜 Set */
  const planDates = new Set(plans.map((p) => p.date));

  return {
    plans, loading, upcomingPlan, planDates,
    fetchPlans, createPlan, deletePlan,
    fetchItems, addItem, updateItem, deleteItem,
    completePlan, getPlanForDate,
  };
}
