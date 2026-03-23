"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useCouple } from "@/hooks/useCouple";
import { useAuth } from "@/hooks/useAuth";
import type { PenpalLetter, CreateLetter } from "@/types";
import { toast } from "sonner";

/**
 * 펜팔 편지 관리 커스텀 훅
 * 편지 조회, 발송, 읽음 처리 기능 제공
 * @returns 편지 목록 및 액션 함수
 */
export function usePenpal() {
  const { user } = useAuth();
  const { couple } = useCouple();
  const [received, setReceived] = useState<PenpalLetter[]>([]); // 받은 편지
  const [sent, setSent] = useState<PenpalLetter[]>([]); // 보낸 편지
  const [loading, setLoading] = useState(true); // 로딩 상태
  const supabase = createClient();

  /**
   * 편지 목록을 조회한다 (받은 편지 + 보낸 편지).
   * penpal_letters 테이블에서 현재 유저 기준으로 분류
   */
  const fetchLetters = useCallback(async () => {
    if (!couple || !user) return;

    try {
      setLoading(true);
      // penpal_letters 테이블에서 해당 커플의 모든 편지 조회
      const { data, error } = await supabase
        .from("penpal_letters")
        .select("*")
        .eq("couple_id", couple.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("[usePenpal/fetchLetters] 조회 실패:", error.message);
        return;
      }

      const letters = (data as PenpalLetter[]) ?? [];

      // 받은 편지 = receiver_id가 나인 것
      setReceived(letters.filter((l) => l.receiver_id === user.id));
      // 보낸 편지 = sender_id가 나인 것
      setSent(letters.filter((l) => l.sender_id === user.id));
    } catch (error) {
      console.error("[usePenpal/fetchLetters] 예외 발생:", error);
    } finally {
      setLoading(false);
    }
  }, [couple, user]);

  // 커플+유저 준비되면 편지 조회
  useEffect(() => {
    if (couple && user) fetchLetters();
  }, [couple, user, fetchLetters]);

  /**
   * 편지를 발송한다.
   * @param input - 편지 내용, 편지지, 사진
   * @returns 성공 여부
   */
  const sendLetter = async (input: CreateLetter): Promise<boolean> => {
    if (!couple || !user) return false;

    // 상대방 ID 결정
    const receiverId =
      couple.user1_id === user.id ? couple.user2_id : couple.user1_id;

    if (!receiverId) {
      toast.error("상대방이 아직 연결되지 않았어요.");
      return false;
    }

    try {
      // penpal_letters 테이블에 편지 삽입
      const { error } = await supabase.from("penpal_letters").insert({
        couple_id: couple.id,
        sender_id: user.id,
        receiver_id: receiverId,
        content: input.content,
        stationery: input.stationery || "default",
        photo_url: input.photo_url || null,
      });

      if (error) {
        console.error("[usePenpal/sendLetter] 발송 실패:", error.message);
        toast.error("편지 발송에 실패했어요.");
        return false;
      }

      toast.success("편지가 발송되었어요!");

      // 상대방에게 푸시 알림 발송 (API Route 호출, 실패해도 무시)
      fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "letter", receiver_id: receiverId }),
      }).catch(() => {});

      await fetchLetters();
      return true;
    } catch (error) {
      console.error("[usePenpal/sendLetter] 예외 발생:", error);
      toast.error("편지 발송 중 오류가 발생했어요.");
      return false;
    }
  };

  /**
   * 편지를 읽음 처리한다.
   * @param letterId - 편지 ID
   */
  const markAsRead = async (letterId: string): Promise<void> => {
    try {
      // penpal_letters 테이블에서 읽음 상태 업데이트
      const { error } = await supabase
        .from("penpal_letters")
        .update({
          is_read: true,
          read_at: new Date().toISOString(),
        })
        .eq("id", letterId);

      if (error) {
        console.error("[usePenpal/markAsRead] 읽음 처리 실패:", error.message);
        return;
      }

      // 로컬 상태 업데이트
      setReceived((prev) =>
        prev.map((l) =>
          l.id === letterId ? { ...l, is_read: true, read_at: new Date().toISOString() } : l
        )
      );
    } catch (error) {
      console.error("[usePenpal/markAsRead] 예외 발생:", error);
    }
  };

  /** 읽지 않은 편지 수 */
  const unreadCount = received.filter((l) => !l.is_read).length;

  return { received, sent, loading, unreadCount, sendLetter, markAsRead, fetchLetters };
}
