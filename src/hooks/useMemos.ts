"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useCouple } from "@/hooks/useCouple";
import { useAuth } from "@/hooks/useAuth";
import type { CoupleMemo, MemoItem, MemoCategory, MemoColor } from "@/types/memo";
import { toast } from "sonner";

/**
 * 커플 공용 메모장 훅
 * 메모 CRUD + 체크리스트 아이템 CRUD
 */
export function useMemos() {
  const { user } = useAuth();
  const { couple } = useCouple();
  const [memos, setMemos] = useState<CoupleMemo[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const coupleId = couple?.id;

  /** 메모 목록 조회 — 핀 우선 + 최신순 */
  const fetchMemos = useCallback(async () => {
    if (!coupleId) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("couple_memos").select("*")
        .eq("couple_id", coupleId)
        .order("is_pinned", { ascending: false })
        .order("updated_at", { ascending: false });
      if (error) console.error("[useMemos/fetch]:", error.message);
      setMemos((data as CoupleMemo[]) ?? []);
    } catch (error) {
      console.error("[useMemos/fetch] 예외:", error);
    } finally {
      setLoading(false);
    }
  }, [coupleId]);

  useEffect(() => { if (coupleId) fetchMemos(); }, [coupleId, fetchMemos]);

  /** 메모 생성 → 생성된 ID 반환 */
  const createMemo = async (
    title: string, category: MemoCategory, color?: MemoColor
  ): Promise<string | null> => {
    if (!coupleId || !user) return null;
    try {
      const { data, error } = await supabase.from("couple_memos")
        .insert({
          couple_id: coupleId, author_id: user.id,
          title, category, color: color || "default",
        })
        .select().single();
      if (error) { toast.error("메모 생성에 실패했어요."); return null; }
      await fetchMemos();
      return (data as CoupleMemo).id;
    } catch (error) {
      console.error("[useMemos/create] 예외:", error);
      return null;
    }
  };

  /** 메모 수정 (제목, 카테고리, 컬러) */
  const updateMemo = async (
    id: string, updates: { title?: string; category?: MemoCategory; color?: MemoColor }
  ): Promise<boolean> => {
    try {
      const { error } = await supabase.from("couple_memos")
        .update({ ...updates, updated_at: new Date().toISOString() }).eq("id", id);
      if (error) { toast.error("수정에 실패했어요."); return false; }
      await fetchMemos();
      return true;
    } catch (error) {
      console.error("[useMemos/update] 예외:", error);
      return false;
    }
  };

  /** 메모 삭제 */
  const deleteMemo = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from("couple_memos").delete().eq("id", id);
      if (error) { toast.error("삭제에 실패했어요."); return false; }
      setMemos((prev) => prev.filter((m) => m.id !== id));
      return true;
    } catch (error) {
      console.error("[useMemos/delete] 예외:", error);
      return false;
    }
  };

  /** 핀 토글 */
  const togglePin = async (id: string, current: boolean): Promise<void> => {
    await supabase.from("couple_memos")
      .update({ is_pinned: !current }).eq("id", id);
    await fetchMemos();
  };

  /** 체크리스트 아이템 조회 */
  const fetchItems = async (memoId: string): Promise<MemoItem[]> => {
    try {
      const { data } = await supabase.from("memo_items").select("*")
        .eq("memo_id", memoId).order("sort_order", { ascending: true });
      return (data as MemoItem[]) ?? [];
    } catch { return []; }
  };

  /** 아이템 추가 */
  const addItem = async (memoId: string, content: string, sortOrder: number): Promise<boolean> => {
    try {
      const { error } = await supabase.from("memo_items")
        .insert({ memo_id: memoId, content, sort_order: sortOrder });
      return !error;
    } catch { return false; }
  };

  /** 아이템 체크 토글 */
  const toggleItem = async (itemId: string, current: boolean): Promise<boolean> => {
    try {
      const { error } = await supabase.from("memo_items")
        .update({ is_checked: !current }).eq("id", itemId);
      return !error;
    } catch { return false; }
  };

  /** 아이템 삭제 */
  const deleteItem = async (itemId: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from("memo_items").delete().eq("id", itemId);
      return !error;
    } catch { return false; }
  };

  return {
    memos, loading,
    createMemo, updateMemo, deleteMemo, togglePin,
    fetchItems, addItem, toggleItem, deleteItem,
  };
}
