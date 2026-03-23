"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Couple } from "@/types";

/**
 * 커플 스페이스 정보를 관리하는 커스텀 훅
 * 현재 유저가 속한 커플 스페이스 조회, 생성, 참여 기능 제공
 * user2가 미연결이어도 정상 작동 — isPartnerConnected로 상태 판별
 * @returns 커플 정보 및 액션 함수
 */
export function useCouple() {
  const { user } = useAuth();
  const [couple, setCouple] = useState<Couple | null>(null); // 커플 스페이스 정보
  const [loading, setLoading] = useState(true); // 로딩 상태
  const supabase = createClient();

  // user.id가 바뀔 때만 조회 (객체 참조 변경으로 인한 무한 루프 방지)
  const userId = user?.id;

  /** 현재 유저가 속한 커플 스페이스를 조회한다 */
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchCouple = async () => {
      try {
        // maybeSingle: 결과가 0건이어도 에러 없이 null 반환
        const { data, error } = await supabase
          .from("couples")
          .select("*")
          .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
          .maybeSingle();

        if (error) {
          console.error("[useCouple/fetchCouple] 조회 실패:", error.message);
        }

        setCouple(data as Couple | null);
      } catch (error) {
        console.error("[useCouple/fetchCouple] 예외 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCouple();
  }, [userId]);

  /**
   * 새 커플 스페이스를 생성한다 (첫 번째 유저).
   * @param startDate - 사귄 날짜
   * @param nickname - 본인 닉네임
   * @returns { inviteCode, error }
   */
  const createSpace = async (
    startDate: string,
    nickname: string
  ): Promise<{ inviteCode: string | null; error: string | null }> => {
    if (!user) return { inviteCode: null, error: "로그인이 필요해요." };

    try {
      // 6자리 초대 코드 생성
      const { generateInviteCode } = await import("@/lib/utils");
      const inviteCode = generateInviteCode();

      // couples 테이블에 새 레코드 삽입
      const { data, error } = await supabase
        .from("couples")
        .insert({
          invite_code: inviteCode,
          start_date: startDate,
          user1_id: user.id,
          user1_nickname: nickname,
        })
        .select()
        .single();

      if (error) {
        console.error("[useCouple/createSpace] 생성 실패:", error.message);
        return { inviteCode: null, error: "커플 스페이스 생성에 실패했어요." };
      }

      setCouple(data as Couple);
      return { inviteCode, error: null };
    } catch (error) {
      console.error("[useCouple/createSpace] 예외 발생:", error);
      return { inviteCode: null, error: "커플 스페이스 생성 중 오류가 발생했어요." };
    }
  };

  /**
   * 초대 코드로 기존 커플 스페이스에 참여한다 (두 번째 유저).
   * @param inviteCode - 6자리 초대 코드
   * @param nickname - 본인 닉네임
   * @returns 에러 메시지 (성공 시 null)
   */
  const joinSpace = async (
    inviteCode: string,
    nickname: string
  ): Promise<string | null> => {
    if (!user) return "로그인이 필요해요.";

    try {
      // 초대 코드로 커플 스페이스 조회
      const { data: existingCouple, error: findError } = await supabase
        .from("couples")
        .select("*")
        .eq("invite_code", inviteCode.toUpperCase())
        .single();

      if (findError || !existingCouple) {
        return "유효하지 않은 초대 코드예요.";
      }

      // 이미 두 번째 유저가 있는지 확인
      if (existingCouple.user2_id) {
        return "이미 연결된 커플 스페이스예요.";
      }

      // user2로 참여
      const { data, error } = await supabase
        .from("couples")
        .update({
          user2_id: user.id,
          user2_nickname: nickname,
        })
        .eq("id", existingCouple.id)
        .select()
        .single();

      if (error) {
        console.error("[useCouple/joinSpace] 참여 실패:", error.message);
        return "커플 스페이스 참여에 실패했어요.";
      }

      setCouple(data as Couple);
      return null;
    } catch (error) {
      console.error("[useCouple/joinSpace] 예외 발생:", error);
      return "커플 스페이스 참여 중 오류가 발생했어요.";
    }
  };

  /** 현재 유저의 역할 (user1 | user2 | null) */
  const myRole = couple
    ? couple.user1_id === user?.id
      ? "user1"
      : "user2"
    : null;

  /** 상대방이 연결되었는지 여부 (user2_id가 존재하는지) */
  const isPartnerConnected = !!(couple?.user1_id && couple?.user2_id);

  /** 내 닉네임 */
  const myNickname = myRole === "user1"
    ? couple?.user1_nickname
    : couple?.user2_nickname;

  /** 상대방 닉네임 — user2 미연결 시 null 반환 */
  const partnerNickname = isPartnerConnected
    ? (myRole === "user1" ? couple?.user2_nickname : couple?.user1_nickname)
    : null;

  /** 초대 코드 (상대방 초대용) */
  const inviteCode = couple?.invite_code ?? null;

  /** 내 생일 */
  const myBirthday = myRole === "user1"
    ? couple?.user1_birthday
    : couple?.user2_birthday;

  /**
   * 내 생일을 업데이트한다.
   * @param birthday - 생일 날짜 (YYYY-MM-DD)
   * @returns 성공 여부
   */
  const updateBirthday = async (birthday: string): Promise<boolean> => {
    if (!couple || !myRole) return false;

    try {
      const field = myRole === "user1" ? "user1_birthday" : "user2_birthday";
      const { data, error } = await supabase
        .from("couples")
        .update({ [field]: birthday })
        .eq("id", couple.id)
        .select()
        .single();

      if (error) {
        console.error("[useCouple/updateBirthday] 실패:", error.message);
        return false;
      }

      setCouple(data as Couple);
      return true;
    } catch (error) {
      console.error("[useCouple/updateBirthday] 예외 발생:", error);
      return false;
    }
  };

  /** 내 이모지 */
  const myEmoji = myRole === "user1" ? couple?.user1_emoji : couple?.user2_emoji;

  /** 상대방 이모지 */
  const partnerEmoji = isPartnerConnected
    ? (myRole === "user1" ? couple?.user2_emoji : couple?.user1_emoji)
    : null;

  /** 내 상태 메시지 */
  const myStatus = myRole === "user1" ? couple?.user1_status : couple?.user2_status;

  /** 상대방 상태 메시지 */
  const partnerStatus = isPartnerConnected
    ? (myRole === "user1" ? couple?.user2_status : couple?.user1_status)
    : null;

  /**
   * 내 프로필(이모지, 상태 메시지)을 업데이트한다.
   * @param emoji - 프로필 이모지
   * @param status - 상태 메시지 (오늘의 한마디)
   */
  const updateProfile = async (emoji?: string, status?: string): Promise<boolean> => {
    if (!couple || !myRole) return false;
    try {
      const updates: Record<string, string> = {};
      if (emoji !== undefined) updates[myRole === "user1" ? "user1_emoji" : "user2_emoji"] = emoji;
      if (status !== undefined) updates[myRole === "user1" ? "user1_status" : "user2_status"] = status;

      const { data, error } = await supabase
        .from("couples").update(updates).eq("id", couple.id).select().single();
      if (error) { console.error("[useCouple/updateProfile]:", error.message); return false; }
      setCouple(data as Couple);
      return true;
    } catch (error) {
      console.error("[useCouple/updateProfile] 예외:", error);
      return false;
    }
  };

  return {
    couple, loading, myRole,
    myNickname, partnerNickname,
    myEmoji, partnerEmoji,
    myStatus, partnerStatus,
    myBirthday, isPartnerConnected, inviteCode,
    createSpace, joinSpace, updateBirthday, updateProfile,
  };
}
