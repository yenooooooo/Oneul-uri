"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useCouple } from "@/hooks/useCouple";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

/** 스티커 데이터: key=YYYY-MM-DD, value=sticker_id */
type StickerMap = Map<string, string>;

/**
 * 캘린더 스티커 CRUD 훅
 * 월 단위 조회 + upsert + 삭제
 */
export function useCalendarStickers(year: number, month: number) {
  const { user } = useAuth();
  const { couple } = useCouple();
  const [stickers, setStickers] = useState<StickerMap>(new Map());
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const coupleId = couple?.id;

  /** 해당 월의 모든 스티커 조회 */
  const fetchStickers = useCallback(async () => {
    if (!coupleId) return;
    try {
      setLoading(true);
      // 해당 월 범위 계산
      const from = `${year}-${String(month + 1).padStart(2, "0")}-01`;
      const lastDay = new Date(year, month + 1, 0).getDate();
      const to = `${year}-${String(month + 1).padStart(2, "0")}-${lastDay}`;

      const { data, error } = await supabase
        .from("calendar_stickers").select("date, sticker_id")
        .eq("couple_id", coupleId)
        .gte("date", from).lte("date", to);

      if (error) { console.error("[useStickers/fetch]:", error.message); return; }

      const map = new Map<string, string>();
      (data ?? []).forEach((s: { date: string; sticker_id: string }) => {
        map.set(s.date, s.sticker_id);
      });
      setStickers(map);
    } catch (error) {
      console.error("[useStickers/fetch] 예외:", error);
    } finally {
      setLoading(false);
    }
  }, [coupleId, year, month]);

  useEffect(() => { if (coupleId) fetchStickers(); }, [coupleId, fetchStickers]);

  /** 스티커 추가/교체 (upsert) */
  const upsertSticker = async (date: string, stickerId: string): Promise<boolean> => {
    if (!coupleId || !user) return false;
    try {
      const { error } = await supabase.from("calendar_stickers")
        .upsert({
          couple_id: coupleId, author_id: user.id,
          date, sticker_id: stickerId,
        }, { onConflict: "couple_id,date" });
      if (error) { toast.error("스티커 저장에 실패했어요."); return false; }

      // 로컬 상태 즉시 반영
      setStickers((prev) => new Map(prev).set(date, stickerId));
      return true;
    } catch (error) {
      console.error("[useStickers/upsert] 예외:", error);
      return false;
    }
  };

  /** 스티커 삭제 */
  const removeSticker = async (date: string): Promise<boolean> => {
    if (!coupleId) return false;
    try {
      const { error } = await supabase.from("calendar_stickers")
        .delete().eq("couple_id", coupleId).eq("date", date);
      if (error) { toast.error("스티커 삭제에 실패했어요."); return false; }

      setStickers((prev) => {
        const next = new Map(prev);
        next.delete(date);
        return next;
      });
      return true;
    } catch (error) {
      console.error("[useStickers/remove] 예외:", error);
      return false;
    }
  };

  return { stickers, loading, upsertSticker, removeSticker };
}
