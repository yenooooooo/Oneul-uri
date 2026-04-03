"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useCouple } from "@/hooks/useCouple";
import { useAuth } from "@/hooks/useAuth";
import { getKSTDate, getDailyQuestions, QUESTION_MAP } from "@/lib/questions";
import type { Question, CoupleAnswer } from "@/types";
import { toast } from "sonner";

/** 오늘의 질문 + 답변 상태 */
interface DailyState {
  question: Question;
  myAnswer: CoupleAnswer | null;
  partnerAnswer: CoupleAnswer | null;
  dailyId: string | null; // couple_question_daily.id
}

/**
 * 커플 질문 훅 — 매일 KST 자정 기준 질문 3개 + 블라인드 답변
 */
export function useQuestions() {
  const { user } = useAuth();
  const { couple } = useCouple();
  const [dailyStates, setDailyStates] = useState<DailyState[]>([]);
  const [loading, setLoading] = useState(true);
  const [pastDays, setPastDays] = useState<{ date: string; states: DailyState[] }[]>([]);
  const supabase = createClient();
  const coupleId = couple?.id;
  const todayKST = getKSTDate();

  /** 오늘의 질문 로드 + DB에서 답변 조회 */
  const loadToday = useCallback(async () => {
    if (!coupleId || !user) return;
    setLoading(true);
    try {
      const [textQ, choiceQ, scaleQ] = getDailyQuestions(todayKST);
      const questions = [textQ, choiceQ, scaleQ];

      // DB에서 오늘 할당된 질문 조회 (없으면 생성)
      const states: DailyState[] = [];
      for (const q of questions) {
        // 오늘 이 질문이 이미 할당되었는지 확인
        let { data: daily } = await supabase
          .from("couple_question_daily")
          .select("id").eq("couple_id", coupleId)
          .eq("question_id", q.id).eq("date", todayKST).maybeSingle();

        // 없으면 생성
        if (!daily) {
          const { data: created } = await supabase
            .from("couple_question_daily")
            .insert({ couple_id: coupleId, question_id: q.id, date: todayKST })
            .select("id").single();
          daily = created;
        }

        const dailyId = daily?.id ?? null;

        // 답변 조회
        let myAnswer: CoupleAnswer | null = null;
        let partnerAnswer: CoupleAnswer | null = null;
        if (dailyId) {
          const { data: answers } = await supabase
            .from("couple_answers").select("*").eq("daily_id", dailyId);
          for (const a of (answers ?? []) as CoupleAnswer[]) {
            if (a.user_id === user.id) myAnswer = a;
            else partnerAnswer = a;
          }
        }

        states.push({ question: q, myAnswer, partnerAnswer, dailyId });
      }
      setDailyStates(states);
    } catch (e) {
      console.error("[useQuestions/loadToday] 예외:", e);
    } finally {
      setLoading(false);
    }
  }, [coupleId, user, todayKST]);

  useEffect(() => { loadToday(); }, [loadToday]);

  /** 답변 제출 */
  const submitAnswer = async (
    dailyId: string, answerType: "text" | "choice" | "scale",
    value: string | number
  ): Promise<boolean> => {
    if (!user) return false;
    try {
      const row: Record<string, unknown> = { daily_id: dailyId, user_id: user.id };
      if (answerType === "text") row.answer_text = value;
      else if (answerType === "choice") row.answer_choice = value;
      else row.answer_scale = value;

      const { error } = await supabase.from("couple_answers").insert(row);
      if (error) { toast.error("답변 저장에 실패했어요."); return false; }
      toast.success("답변이 저장되었어요!");

      // 오늘 질문이면 오늘만 새로고침, 지난 질문이면 해당 항목만 갱신
      const isTodayQ = dailyStates.some((s) => s.dailyId === dailyId);
      if (isTodayQ) {
        await loadToday();
      } else {
        // 지난 질문 — 해당 dailyId 답변만 다시 조회하여 pastDays 갱신
        const { data: freshAnswers } = await supabase
          .from("couple_answers").select("*").eq("daily_id", dailyId);
        const my = (freshAnswers ?? []).find((a: CoupleAnswer) => a.user_id === user.id) ?? null;
        const partner = (freshAnswers ?? []).find((a: CoupleAnswer) => a.user_id !== user.id) ?? null;
        setPastDays((prev) => prev.map((day) => ({
          ...day,
          states: day.states.map((s) =>
            s.dailyId === dailyId ? { ...s, myAnswer: my, partnerAnswer: partner } : s
          ),
        })));
      }
      return true;
    } catch (e) {
      console.error("[useQuestions/submitAnswer] 예외:", e);
      return false;
    }
  };

  const [hasMoreHistory, setHasMoreHistory] = useState(true); // 더 불러올 히스토리 있는지
  const [loadingHistory, setLoadingHistory] = useState(false); // 히스토리 로딩 중
  const historyLoaded = useRef(0); // 지금까지 로드한 daily 수

  /** 지난 질문 히스토리 로드 — 페이지네이션 (7일씩) */
  const loadHistory = useCallback(async (append = false) => {
    if (!coupleId || !user || loadingHistory) return;
    setLoadingHistory(true);
    try {
      const offset = append ? historyLoaded.current : 0;
      const pageSize = 21; // 7일 × 3개
      const { data: dailies } = await supabase
        .from("couple_question_daily").select("*")
        .eq("couple_id", coupleId).lt("date", todayKST)
        .order("date", { ascending: false })
        .range(offset, offset + pageSize - 1);

      if (!dailies || dailies.length === 0) {
        setHasMoreHistory(false);
        setLoadingHistory(false);
        return;
      }

      // 페이지 크기보다 적으면 더 이상 없음
      if (dailies.length < pageSize) setHasMoreHistory(false);
      historyLoaded.current = offset + dailies.length;

      const dailyIds = dailies.map((d: { id: string }) => d.id);
      const { data: answers } = await supabase
        .from("couple_answers").select("*").in("daily_id", dailyIds);

      // 날짜별 그룹핑
      const newDays: { date: string; states: DailyState[] }[] = [];
      const dateMap = new Map<string, DailyState[]>();
      for (const d of dailies as { id: string; question_id: number; date: string }[]) {
        const q = QUESTION_MAP.get(d.question_id);
        if (!q) continue;
        const dayAnswers = ((answers ?? []) as CoupleAnswer[]).filter((a) => a.daily_id === d.id);
        const my = dayAnswers.find((a) => a.user_id === user.id) ?? null;
        const partner = dayAnswers.find((a) => a.user_id !== user.id) ?? null;

        if (!dateMap.has(d.date)) dateMap.set(d.date, []);
        dateMap.get(d.date)!.push({ question: q, myAnswer: my, partnerAnswer: partner, dailyId: d.id });
      }
      dateMap.forEach((states, date) => newDays.push({ date, states }));

      setPastDays((prev) => append ? [...prev, ...newDays] : newDays);
    } catch (e) {
      console.error("[useQuestions/loadHistory] 예외:", e);
    } finally {
      setLoadingHistory(false);
    }
  }, [coupleId, user, todayKST, loadingHistory]);

  /** 더 보기 */
  const loadMoreHistory = () => loadHistory(true);

  useEffect(() => { if (coupleId) loadHistory(); }, [coupleId]);

  return {
    dailyStates, pastDays, loading, todayKST,
    submitAnswer, reload: loadToday,
    loadMoreHistory, hasMoreHistory, loadingHistory,
  };
}
