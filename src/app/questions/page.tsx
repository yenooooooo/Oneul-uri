"use client";

import { useQuestions } from "@/hooks/useQuestions";
import { useCouple } from "@/hooks/useCouple";
import AppLayout from "@/components/layout/AppLayout";
import QuestionCard from "@/components/questions/QuestionCard";
import PastQuestionsAccordion from "@/components/questions/PastQuestionsAccordion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

/**
 * 커플 질문 페이지 — /questions
 * 오늘의 질문 3개 + 지난 질문 히스토리
 */
export default function QuestionsPage() {
  const {
    dailyStates, pastDays, loading, todayKST,
    submitAnswer, loadMoreHistory, hasMoreHistory, loadingHistory,
  } = useQuestions();
  const { myNickname, partnerNickname } = useCouple();

  return (
    <AppLayout>
      <div className="px-6 pt-6 space-y-8 animate-page-in">
        {/* 상단 네비 */}
        <div className="flex items-center gap-3">
          <Link href="/" className="p-1 text-txt-primary"><ArrowLeft className="w-5 h-5" /></Link>
          <div>
            <h1 className="text-xl font-bold font-serif-ko text-txt-primary">커플 질문</h1>
            <p className="text-xs text-txt-tertiary">{formatDate(todayKST, "long")}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-coral-400" />
          </div>
        ) : (
          <>
            {/* 오늘의 질문 */}
            <section className="space-y-4">
              <h2 className="text-sm font-bold text-coral-500">오늘의 질문 💬</h2>
              {dailyStates.map((state) => (
                <QuestionCard key={state.question.id} {...state}
                  onSubmit={submitAnswer}
                  myNickname={myNickname ?? "나"}
                  partnerNickname={partnerNickname ?? "상대"} />
              ))}
            </section>

            {/* 지난 질문 히스토리 — 아코디언 */}
            {pastDays.length > 0 && (
              <PastQuestionsAccordion
                pastDays={pastDays}
                submitAnswer={submitAnswer}
                myNickname={myNickname ?? "나"}
                partnerNickname={partnerNickname ?? "상대"}
                hasMore={hasMoreHistory}
                loadingMore={loadingHistory}
                onLoadMore={loadMoreHistory}
              />
            )}

            {/* 하단 여백 */}
            <div className="h-8" />
          </>
        )}
      </div>
    </AppLayout>
  );
}
