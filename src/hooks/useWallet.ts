"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useCouple } from "@/hooks/useCouple";
import { useAuth } from "@/hooks/useAuth";
import type {
  WalletGoal, WalletTransaction,
  CreateWalletGoal, CreateTransaction, PaceStatus,
} from "@/types/wallet";
import { MILESTONES } from "@/types/wallet";
import { toast } from "sonner";

/** 페이스 분석 결과 */
export interface PaceAnalysis {
  timePercent: number; // 경과 기간 퍼센트
  amountPercent: number; // 달성 금액 퍼센트
  status: PaceStatus; // 페이스 판정
  estimatedDate: string | null; // 예상 달성일 (YYYY-MM-DD)
  monthlyAvg: number; // 월 평균 저축액
  monthlyNeeded: number | null; // 목표일까지 필요 월 저축액
}

/**
 * 데이트 통장 관리 커스텀 훅
 * 목표 설정, 입출금, 마일스톤, 페이스 분석 기능 제공
 */
export function useWallet() {
  const { user } = useAuth();
  const { couple } = useCouple();
  const [goals, setGoals] = useState<WalletGoal[]>([]);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMilestone, setNewMilestone] = useState<number | null>(null); // 새로 달성된 마일스톤
  const supabase = createClient();
  const coupleId = couple?.id;

  /** 목표 + 거래 내역 조회 */
  const fetchData = useCallback(async () => {
    if (!coupleId) return;
    try {
      setLoading(true);
      const [goalsRes, txRes] = await Promise.all([
        supabase.from("wallet_goals").select("*")
          .eq("couple_id", coupleId).order("created_at", { ascending: false }),
        supabase.from("wallet_transactions").select("*")
          .eq("couple_id", coupleId).order("created_at", { ascending: false }),
      ]);
      if (goalsRes.error) console.error("[useWallet/fetch] 목표:", goalsRes.error.message);
      if (txRes.error) console.error("[useWallet/fetch] 거래:", txRes.error.message);
      setGoals((goalsRes.data as WalletGoal[]) ?? []);
      setTransactions((txRes.data as WalletTransaction[]) ?? []);
    } catch (error) {
      console.error("[useWallet/fetchData] 예외 발생:", error);
    } finally {
      setLoading(false);
    }
  }, [coupleId]);

  useEffect(() => { if (coupleId) fetchData(); }, [coupleId, fetchData]);

  /** 새 저축 목표 생성 */
  const createGoal = async (input: CreateWalletGoal): Promise<boolean> => {
    if (!coupleId) return false;
    try {
      const { error } = await supabase.from("wallet_goals").insert({
        couple_id: coupleId,
        title: input.title,
        target_amount: input.target_amount,
        target_date: input.target_date || null,
      });
      if (error) { toast.error("목표 생성에 실패했어요."); return false; }
      toast.success("새 목표가 설정되었어요!");
      await fetchData();
      return true;
    } catch (error) {
      console.error("[useWallet/createGoal] 예외:", error);
      toast.error("목표 생성 중 오류가 발생했어요.");
      return false;
    }
  };

  /** 입금/출금 추가 + 마일스톤 체크 */
  const addTransaction = async (input: CreateTransaction): Promise<boolean | null> => {
    if (!coupleId || !user) return null;
    try {
      const { error: txError } = await supabase.from("wallet_transactions").insert({
        couple_id: coupleId, goal_id: input.goal_id,
        user_id: user.id, amount: input.amount, memo: input.memo || null,
      });
      if (txError) { toast.error("입금에 실패했어요."); return null; }

      // 목표 금액 업데이트 + 마일스톤 체크
      const goal = goals.find((g) => g.id === input.goal_id);
      if (!goal) return null;

      const newAmount = goal.current_amount + input.amount;
      const newPercent = Math.round((newAmount / goal.target_amount) * 100);
      const isAchieved = newAmount >= goal.target_amount;

      // 새로 달성된 마일스톤 확인
      const existing = goal.achieved_milestones ?? [];
      const newlyAchieved = MILESTONES
        .filter((m) => newPercent >= m.percent && !existing.includes(m.percent))
        .map((m) => m.percent);

      const updatedMilestones = [...existing, ...newlyAchieved];

      await supabase.from("wallet_goals").update({
        current_amount: newAmount,
        is_achieved: isAchieved,
        achieved_at: isAchieved ? new Date().toISOString() : null,
        achieved_milestones: updatedMilestones,
      }).eq("id", input.goal_id);

      toast.success(input.amount > 0 ? "입금 완료!" : "출금 완료!");

      // 가장 높은 새 마일스톤 팝업 트리거
      if (newlyAchieved.length > 0) {
        setNewMilestone(Math.max(...newlyAchieved));
      }

      await fetchData();
      return isAchieved && !goal.is_achieved;
    } catch (error) {
      console.error("[useWallet/addTransaction] 예외:", error);
      toast.error("거래 처리 중 오류가 발생했어요.");
      return null;
    }
  };

  /** 마일스톤 팝업 닫기 */
  const clearMilestone = () => setNewMilestone(null);

  /**
   * 거래 내역을 수정한다 — 금액/메모 변경 후 목표 금액 재계산
   * @param txId - 거래 ID
   * @param goalId - 목표 ID
   * @param newAmount - 수정된 금액
   * @param newMemo - 수정된 메모
   */
  const updateTransaction = async (
    txId: string, goalId: string, newAmount: number, newMemo?: string
  ): Promise<boolean> => {
    try {
      const oldTx = transactions.find((t) => t.id === txId);
      if (!oldTx) return false;

      // 거래 수정
      const { error } = await supabase.from("wallet_transactions")
        .update({ amount: newAmount, memo: newMemo ?? null })
        .eq("id", txId);
      if (error) { toast.error("수정에 실패했어요."); return false; }

      // 목표의 current_amount 재계산 (차이만큼 반영)
      const diff = newAmount - oldTx.amount;
      const goal = goals.find((g) => g.id === goalId);
      if (goal) {
        await supabase.from("wallet_goals")
          .update({ current_amount: goal.current_amount + diff })
          .eq("id", goalId);
      }

      toast.success("내역이 수정되었어요!");
      await fetchData();
      return true;
    } catch (error) {
      console.error("[useWallet/updateTransaction] 예외:", error);
      toast.error("수정 중 오류가 발생했어요.");
      return false;
    }
  };

  /**
   * 거래 내역을 삭제한다 — 삭제 후 목표 금액 재계산
   * @param txId - 거래 ID
   * @param goalId - 목표 ID
   */
  const deleteTransaction = async (txId: string, goalId: string): Promise<boolean> => {
    try {
      const tx = transactions.find((t) => t.id === txId);
      if (!tx) return false;

      const { error } = await supabase.from("wallet_transactions")
        .delete().eq("id", txId);
      if (error) { toast.error("삭제에 실패했어요."); return false; }

      // 목표의 current_amount에서 해당 금액 차감
      const goal = goals.find((g) => g.id === goalId);
      if (goal) {
        await supabase.from("wallet_goals")
          .update({ current_amount: goal.current_amount - tx.amount })
          .eq("id", goalId);
      }

      toast.success("내역이 삭제되었어요.");
      await fetchData();
      return true;
    } catch (error) {
      console.error("[useWallet/deleteTransaction] 예외:", error);
      toast.error("삭제 중 오류가 발생했어요.");
      return false;
    }
  };

  /** 페이스 분석 계산 */
  const analyzePace = (goal: WalletGoal): PaceAnalysis => {
    const amountPercent = Math.min(
      Math.round((goal.current_amount / goal.target_amount) * 100), 100
    );

    // 월 평균 저축액 계산 (최근 3개월 기준)
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    const recentTx = transactions.filter(
      (tx) => tx.goal_id === goal.id && tx.amount > 0 &&
        new Date(tx.created_at) >= threeMonthsAgo
    );
    const totalRecent = recentTx.reduce((sum, tx) => sum + tx.amount, 0);
    const monthsSinceCreation = Math.max(1,
      (Date.now() - new Date(goal.created_at).getTime()) / (30 * 24 * 60 * 60 * 1000)
    );
    const monthlyAvg = Math.round(totalRecent / Math.min(3, monthsSinceCreation));

    // 예상 달성일 계산
    let estimatedDate: string | null = null;
    if (monthlyAvg > 0 && goal.current_amount < goal.target_amount) {
      const remaining = goal.target_amount - goal.current_amount;
      const monthsNeeded = Math.ceil(remaining / monthlyAvg);
      const est = new Date();
      est.setMonth(est.getMonth() + monthsNeeded);
      estimatedDate = est.toISOString().split("T")[0];
    }

    // 기간 퍼센트 (target_date가 있을 때)
    let timePercent = 0;
    let status: PaceStatus = "noData";
    let monthlyNeeded: number | null = null;

    if (goal.target_date) {
      const totalDays = (new Date(goal.target_date).getTime() - new Date(goal.created_at).getTime())
        / (24 * 60 * 60 * 1000);
      const elapsedDays = (Date.now() - new Date(goal.created_at).getTime())
        / (24 * 60 * 60 * 1000);
      timePercent = Math.min(Math.round((elapsedDays / totalDays) * 100), 100);

      // 페이스 판정
      const diff = amountPercent - timePercent;
      if (diff > 5) status = "fast";
      else if (diff >= -5) status = "onTrack";
      else status = "slow";

      // 목표일까지 필요 월 저축액
      const monthsLeft = Math.max(1,
        (new Date(goal.target_date).getTime() - Date.now()) / (30 * 24 * 60 * 60 * 1000)
      );
      const amountLeft = goal.target_amount - goal.current_amount;
      if (amountLeft > 0) monthlyNeeded = Math.ceil(amountLeft / monthsLeft);
    } else if (recentTx.length > 0) {
      status = monthlyAvg > 0 ? "onTrack" : "noData";
    }

    return { timePercent, amountPercent, status, estimatedDate, monthlyAvg, monthlyNeeded };
  };

  const activeGoal = goals.find((g) => !g.is_achieved) ?? null;
  const achievedGoals = goals.filter((g) => g.is_achieved);

  return {
    goals, transactions, activeGoal, achievedGoals, loading,
    newMilestone, clearMilestone,
    createGoal, addTransaction, updateTransaction, deleteTransaction, analyzePace,
  };
}
