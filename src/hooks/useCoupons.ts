"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useCouple } from "@/hooks/useCouple";
import { useAuth } from "@/hooks/useAuth";
import type { CouponType, CouponWithType } from "@/types/coupon";
import { toast } from "sonner";

/**
 * 커플 쿠폰 시스템 훅
 * 쿠폰 종류 등록, 쿠폰 획득, 사용, 조회
 */
export function useCoupons() {
  const { user } = useAuth();
  const { couple } = useCouple();
  const [types, setTypes] = useState<CouponType[]>([]);
  const [coupons, setCoupons] = useState<CouponWithType[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const coupleId = couple?.id;

  /** 쿠폰 종류 + 획득 쿠폰 조회 */
  const fetchAll = useCallback(async () => {
    if (!coupleId) return;
    try {
      setLoading(true);
      const [typesRes, couponsRes] = await Promise.all([
        supabase.from("coupon_types").select("*")
          .eq("couple_id", coupleId).order("created_at", { ascending: false }),
        supabase.from("coupons").select("*, coupon_type:coupon_types(*)")
          .eq("couple_id", coupleId).order("created_at", { ascending: false }),
      ]);
      setTypes((typesRes.data as CouponType[]) ?? []);
      setCoupons((couponsRes.data as CouponWithType[]) ?? []);
    } catch (error) {
      console.error("[useCoupons/fetch] 예외:", error);
    } finally {
      setLoading(false);
    }
  }, [coupleId]);

  useEffect(() => { if (coupleId) fetchAll(); }, [coupleId, fetchAll]);

  /** 쿠폰 종류 등록 */
  const createType = async (
    emoji: string, title: string, description?: string
  ): Promise<boolean> => {
    if (!coupleId || !user) return false;
    try {
      const { error } = await supabase.from("coupon_types").insert({
        couple_id: coupleId, author_id: user.id,
        emoji, title, description: description || null,
      });
      if (error) { toast.error("쿠폰 등록에 실패했어요."); return false; }
      toast.success("새 쿠폰이 등록되었어요!");
      await fetchAll();
      return true;
    } catch (error) {
      console.error("[useCoupons/createType] 예외:", error);
      return false;
    }
  };

  /** 쿠폰 획득 (내기 승리) */
  const giveCoupon = async (
    couponTypeId: string, winnerId: string, betMemo?: string
  ): Promise<boolean> => {
    if (!coupleId) return false;
    try {
      const { error } = await supabase.from("coupons").insert({
        couple_id: coupleId, coupon_type_id: couponTypeId,
        winner_id: winnerId, bet_memo: betMemo || null,
      });
      if (error) { toast.error("쿠폰 지급에 실패했어요."); return false; }
      toast.success("쿠폰이 지급되었어요! 🎉");
      await fetchAll();
      return true;
    } catch (error) {
      console.error("[useCoupons/give] 예외:", error);
      return false;
    }
  };

  /** 쿠폰 사용 */
  const useCoupon = async (couponId: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from("coupons")
        .update({ status: "used", used_at: new Date().toISOString() })
        .eq("id", couponId);
      if (error) { toast.error("쿠폰 사용에 실패했어요."); return false; }
      toast.success("쿠폰을 사용했어요!");
      await fetchAll();
      return true;
    } catch (error) {
      console.error("[useCoupons/use] 예외:", error);
      return false;
    }
  };

  /** 획득된 쿠폰 삭제 */
  const deleteCoupon = async (couponId: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from("coupons").delete().eq("id", couponId);
      if (error) { toast.error("삭제에 실패했어요."); return false; }
      setCoupons((prev) => prev.filter((c) => c.id !== couponId));
      toast.success("쿠폰이 삭제되었어요.");
      return true;
    } catch (error) {
      console.error("[useCoupons/deleteCoupon] 예외:", error);
      return false;
    }
  };

  /** 쿠폰 종류 삭제 */
  const deleteType = async (typeId: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from("coupon_types")
        .delete().eq("id", typeId);
      if (error) { toast.error("삭제에 실패했어요."); return false; }
      setTypes((prev) => prev.filter((t) => t.id !== typeId));
      return true;
    } catch (error) {
      console.error("[useCoupons/deleteType] 예외:", error);
      return false;
    }
  };

  // 내 쿠폰 (active만)
  const myCoupons = coupons.filter(
    (c) => c.winner_id === user?.id && c.status === "active"
  );
  // 상대방에게 준 쿠폰 (active만)
  const givenCoupons = coupons.filter(
    (c) => c.winner_id !== user?.id && c.status === "active"
  );
  // 사용 기록
  const usedCoupons = coupons.filter((c) => c.status === "used");

  return {
    types, coupons, myCoupons, givenCoupons, usedCoupons, loading,
    createType, giveCoupon, useCoupon, deleteCoupon, deleteType,
  };
}
