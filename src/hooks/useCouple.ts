"use client";

import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCoupleContext } from "@/components/common/CoupleProvider";
import type { Couple } from "@/types";

/**
 * 커플 스페이스 정보를 관리하는 커스텀 훅
 * CoupleProvider Context에서 데이터를 가져옴 (한 번만 fetch)
 * 생성/참여/업데이트 액션 함수 제공
 */
export function useCouple() {
  const { user } = useAuth();
  const { couple, loading, setCouple } = useCoupleContext();
  const supabase = createClient();

  /** 새 커플 스페이스를 생성한다 (첫 번째 유저) */
  const createSpace = async (
    startDate: string, nickname: string
  ): Promise<{ inviteCode: string | null; error: string | null }> => {
    if (!user) return { inviteCode: null, error: "로그인이 필요해요." };
    try {
      const { generateInviteCode } = await import("@/lib/utils");
      const inviteCode = generateInviteCode();
      const { data, error } = await supabase
        .from("couples")
        .insert({ invite_code: inviteCode, start_date: startDate, user1_id: user.id, user1_nickname: nickname })
        .select().single();
      if (error) return { inviteCode: null, error: "커플 스페이스 생성에 실패했어요." };
      setCouple(data as Couple);
      return { inviteCode, error: null };
    } catch {
      return { inviteCode: null, error: "커플 스페이스 생성 중 오류가 발생했어요." };
    }
  };

  /** 초대 코드로 참여한다 (두 번째 유저) */
  const joinSpace = async (
    inviteCode: string, nickname: string
  ): Promise<string | null> => {
    if (!user) return "로그인이 필요해요.";
    try {
      const { data: existing, error: findErr } = await supabase
        .from("couples").select("*")
        .eq("invite_code", inviteCode.toUpperCase()).single();
      if (findErr || !existing) return "유효하지 않은 초대 코드예요.";
      if (existing.user2_id) return "이미 연결된 커플 스페이스예요.";
      const { data, error } = await supabase
        .from("couples")
        .update({ user2_id: user.id, user2_nickname: nickname })
        .eq("id", existing.id).select().single();
      if (error) return "커플 스페이스 참여에 실패했어요.";
      setCouple(data as Couple);
      return null;
    } catch {
      return "커플 스페이스 참여 중 오류가 발생했어요.";
    }
  };

  /** 생일 업데이트 */
  const updateBirthday = async (birthday: string): Promise<boolean> => {
    if (!couple || !myRole) return false;
    try {
      const field = myRole === "user1" ? "user1_birthday" : "user2_birthday";
      const { data, error } = await supabase
        .from("couples").update({ [field]: birthday })
        .eq("id", couple.id).select().single();
      if (error) return false;
      setCouple(data as Couple);
      return true;
    } catch { return false; }
  };

  /** 프로필(이모지, 상태 메시지) 업데이트 */
  const updateProfile = async (emoji?: string, status?: string): Promise<boolean> => {
    if (!couple || !myRole) return false;
    try {
      const updates: Record<string, string> = {};
      if (emoji !== undefined) updates[myRole === "user1" ? "user1_emoji" : "user2_emoji"] = emoji;
      if (status !== undefined) updates[myRole === "user1" ? "user1_status" : "user2_status"] = status;
      const { data, error } = await supabase
        .from("couples").update(updates).eq("id", couple.id).select().single();
      if (error) return false;
      setCouple(data as Couple);
      return true;
    } catch { return false; }
  };

  // 파생 값들
  const myRole = couple
    ? couple.user1_id === user?.id ? "user1" : "user2"
    : null;
  const isPartnerConnected = !!(couple?.user1_id && couple?.user2_id);
  const myNickname = myRole === "user1" ? couple?.user1_nickname : couple?.user2_nickname;
  const partnerNickname = isPartnerConnected
    ? (myRole === "user1" ? couple?.user2_nickname : couple?.user1_nickname) : null;
  const inviteCode = couple?.invite_code ?? null;
  const myBirthday = myRole === "user1" ? couple?.user1_birthday : couple?.user2_birthday;
  const myEmoji = myRole === "user1" ? couple?.user1_emoji : couple?.user2_emoji;
  const partnerEmoji = isPartnerConnected
    ? (myRole === "user1" ? couple?.user2_emoji : couple?.user1_emoji) : null;
  const myStatus = myRole === "user1" ? couple?.user1_status : couple?.user2_status;
  const partnerStatus = isPartnerConnected
    ? (myRole === "user1" ? couple?.user2_status : couple?.user1_status) : null;

  return {
    couple, loading, myRole,
    myNickname, partnerNickname,
    myEmoji, partnerEmoji,
    myStatus, partnerStatus,
    myBirthday, isPartnerConnected, inviteCode,
    createSpace, joinSpace, updateBirthday, updateProfile,
  };
}
