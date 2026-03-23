"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useCouple } from "@/hooks/useCouple";
import { useAuth } from "@/hooks/useAuth";
import type { BookmarkedPlace, CreateBookmark } from "@/types/bookmark";
import { toast } from "sonner";

/**
 * 데이트 코스 북마크 관리 훅
 * 장소 저장, 방문 횟수 카운트, 삭제
 */
export function useBookmarks() {
  const { user } = useAuth();
  const { couple } = useCouple();
  const [places, setPlaces] = useState<BookmarkedPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const coupleId = couple?.id;

  /** 북마크 목록 조회 — 방문 횟수 역순 */
  const fetchPlaces = useCallback(async () => {
    if (!coupleId) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("bookmarked_places").select("*")
        .eq("couple_id", coupleId)
        .order("visit_count", { ascending: false });
      if (error) console.error("[useBookmarks/fetch]:", error.message);
      setPlaces((data as BookmarkedPlace[]) ?? []);
    } catch (error) {
      console.error("[useBookmarks/fetch] 예외:", error);
    } finally {
      setLoading(false);
    }
  }, [coupleId]);

  useEffect(() => {
    if (coupleId) fetchPlaces();
  }, [coupleId, fetchPlaces]);

  /**
   * 장소를 북마크한다.
   * 이미 있으면 visit_count +1, 없으면 새로 생성
   */
  const bookmarkPlace = async (input: CreateBookmark): Promise<boolean> => {
    if (!coupleId || !user) return false;
    try {
      // 같은 이름의 장소가 이미 있는지 확인
      const existing = places.find(
        (p) => p.name.toLowerCase() === input.name.toLowerCase()
      );

      if (existing) {
        // 방문 횟수 +1 + 마지막 방문일 업데이트
        const { error } = await supabase.from("bookmarked_places")
          .update({
            visit_count: existing.visit_count + 1,
            last_visited: new Date().toISOString().split("T")[0],
          })
          .eq("id", existing.id);
        if (error) { toast.error("북마크 업데이트에 실패했어요."); return false; }
        toast.success(`${input.name} 방문 ${existing.visit_count + 1}회째!`);
      } else {
        // 새 북마크 생성
        const { error } = await supabase.from("bookmarked_places").insert({
          couple_id: coupleId,
          author_id: user.id,
          name: input.name,
          category: input.category || "etc",
          memo: input.memo || null,
          last_visited: new Date().toISOString().split("T")[0],
        });
        if (error) { toast.error("북마크에 실패했어요."); return false; }
        toast.success(`${input.name}이(가) 저장되었어요!`);
      }

      await fetchPlaces();
      return true;
    } catch (error) {
      console.error("[useBookmarks/bookmark] 예외:", error);
      return false;
    }
  };

  /** 북마크 삭제 */
  const deletePlace = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from("bookmarked_places")
        .delete().eq("id", id);
      if (error) { toast.error("삭제에 실패했어요."); return false; }
      setPlaces((prev) => prev.filter((p) => p.id !== id));
      toast.success("삭제되었어요.");
      return true;
    } catch (error) {
      console.error("[useBookmarks/delete] 예외:", error);
      return false;
    }
  };

  /** 특정 장소가 북마크되어 있는지 확인 */
  const isBookmarked = (name: string): boolean => {
    return places.some((p) => p.name.toLowerCase() === name.toLowerCase());
  };

  return { places, loading, bookmarkPlace, deletePlace, isBookmarked };
}
