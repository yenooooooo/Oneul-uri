"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useCouple } from "@/hooks/useCouple";
import { useAuth } from "@/hooks/useAuth";
import type { PenpalLetter, CreateLetter } from "@/types";
import { toast } from "sonner";

const PAGE_SIZE = 20;

/**
 * 펜팔 편지 관리 커스텀 훅 — 페이지네이션 지원
 * 받은/보낸 각각 독립적으로 20개씩 로드
 */
export function usePenpal() {
  const { user } = useAuth();
  const { couple } = useCouple();
  const [received, setReceived] = useState<PenpalLetter[]>([]);
  const [sent, setSent] = useState<PenpalLetter[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMoreReceived, setHasMoreReceived] = useState(true);
  const [hasMoreSent, setHasMoreSent] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const supabase = createClient();
  const coupleId = couple?.id;
  const userId = user?.id;

  /** 첫 페이지 조회 — 받은/보낸 각각 */
  const fetchLetters = useCallback(async () => {
    if (!coupleId || !userId) return;
    try {
      setLoading(true);
      const [recvRes, sentRes] = await Promise.all([
        supabase.from("penpal_letters").select("*")
          .eq("couple_id", coupleId).eq("receiver_id", userId)
          .order("created_at", { ascending: false })
          .range(0, PAGE_SIZE - 1),
        supabase.from("penpal_letters").select("*")
          .eq("couple_id", coupleId).eq("sender_id", userId)
          .order("created_at", { ascending: false })
          .range(0, PAGE_SIZE - 1),
      ]);
      const r = (recvRes.data as PenpalLetter[]) ?? [];
      const s = (sentRes.data as PenpalLetter[]) ?? [];
      setReceived(r);
      setSent(s);
      setHasMoreReceived(r.length >= PAGE_SIZE);
      setHasMoreSent(s.length >= PAGE_SIZE);
    } catch (error) {
      console.error("[usePenpal/fetch] 예외:", error);
    } finally {
      setLoading(false);
    }
  }, [coupleId, userId]);

  useEffect(() => {
    if (coupleId && userId) fetchLetters();
  }, [coupleId, userId, fetchLetters]);

  /** 받은 편지 더 로드 */
  const loadMoreReceived = async () => {
    if (!coupleId || !userId || loadingMore || !hasMoreReceived) return;
    setLoadingMore(true);
    try {
      const { data } = await supabase.from("penpal_letters").select("*")
        .eq("couple_id", coupleId).eq("receiver_id", userId)
        .order("created_at", { ascending: false })
        .range(received.length, received.length + PAGE_SIZE - 1);
      const fetched = (data as PenpalLetter[]) ?? [];
      setReceived((prev) => [...prev, ...fetched]);
      setHasMoreReceived(fetched.length >= PAGE_SIZE);
    } catch (error) {
      console.error("[usePenpal/loadMoreReceived] 예외:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  /** 보낸 편지 더 로드 */
  const loadMoreSent = async () => {
    if (!coupleId || !userId || loadingMore || !hasMoreSent) return;
    setLoadingMore(true);
    try {
      const { data } = await supabase.from("penpal_letters").select("*")
        .eq("couple_id", coupleId).eq("sender_id", userId)
        .order("created_at", { ascending: false })
        .range(sent.length, sent.length + PAGE_SIZE - 1);
      const fetched = (data as PenpalLetter[]) ?? [];
      setSent((prev) => [...prev, ...fetched]);
      setHasMoreSent(fetched.length >= PAGE_SIZE);
    } catch (error) {
      console.error("[usePenpal/loadMoreSent] 예외:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  /** 편지 발송 */
  const sendLetter = async (input: CreateLetter): Promise<boolean> => {
    if (!couple || !user) return false;
    const receiverId = couple.user1_id === user.id ? couple.user2_id : couple.user1_id;
    if (!receiverId) { toast.error("상대방이 아직 연결되지 않았어요."); return false; }
    try {
      const { error } = await supabase.from("penpal_letters").insert({
        couple_id: couple.id, sender_id: user.id, receiver_id: receiverId,
        content: input.content, stationery: input.stationery || "default",
        photo_url: input.photo_url || null,
      });
      if (error) { toast.error("편지 발송에 실패했어요."); return false; }
      toast.success("편지가 발송되었어요!");
      fetch("/api/notifications", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "letter", receiver_id: receiverId }),
      }).catch(() => {});
      await fetchLetters();
      return true;
    } catch (error) {
      console.error("[usePenpal/sendLetter] 예외:", error);
      toast.error("편지 발송 중 오류가 발생했어요.");
      return false;
    }
  };

  /** 읽음 처리 */
  const markAsRead = async (letterId: string): Promise<void> => {
    try {
      await supabase.from("penpal_letters")
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq("id", letterId);
      setReceived((prev) =>
        prev.map((l) => l.id === letterId
          ? { ...l, is_read: true, read_at: new Date().toISOString() } : l
        )
      );
    } catch (error) {
      console.error("[usePenpal/markAsRead] 예외:", error);
    }
  };

  const unreadCount = received.filter((l) => !l.is_read).length;

  return {
    received, sent, loading, loadingMore, unreadCount,
    hasMoreReceived, hasMoreSent,
    sendLetter, markAsRead, fetchLetters,
    loadMoreReceived, loadMoreSent,
  };
}
