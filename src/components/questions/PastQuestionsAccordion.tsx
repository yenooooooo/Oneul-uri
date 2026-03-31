"use client";

import { useState } from "react";
import { ChevronDown, Loader2, Check, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import QuestionCard from "@/components/questions/QuestionCard";
import type { Question, CoupleAnswer } from "@/types";

/** DailyState 타입 (useQuestions에서 가져옴) */
interface DailyState {
  question: Question;
  myAnswer: CoupleAnswer | null;
  partnerAnswer: CoupleAnswer | null;
  dailyId: string | null;
}

interface Props {
  pastDays: { date: string; states: DailyState[] }[];
  submitAnswer: (dailyId: string, type: "text" | "choice" | "scale", value: string | number) => Promise<boolean>;
  myNickname: string;
  partnerNickname: string;
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
}

/**
 * 지난 질문 아코디언 — 날짜별 접기/펼치기
 * 접힌 상태: 날짜 + 답변 완료 상태 뱃지만 표시
 * 펼친 상태: QuestionCard 3개 표시
 */
export default function PastQuestionsAccordion({
  pastDays, submitAnswer, myNickname, partnerNickname,
  hasMore, loadingMore, onLoadMore,
}: Props) {
  const [openDate, setOpenDate] = useState<string | null>(null); // 열린 날짜 (1개만)

  /** 날짜 토글 */
  const toggle = (date: string) => {
    setOpenDate(openDate === date ? null : date);
  };

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-bold text-txt-tertiary">지난 질문</h2>

      {pastDays.map((day) => {
        const isOpen = openDate === day.date;
        // 답변 완료 수 계산
        const bothDone = day.states.filter((s) => s.myAnswer && s.partnerAnswer).length;
        const total = day.states.length;
        const allDone = bothDone === total;

        return (
          <div key={day.date} className="bg-white rounded-2xl overflow-hidden shadow-soft">
            {/* 날짜 헤더 — 탭하여 토글 */}
            <button onClick={() => toggle(day.date)}
              className="w-full flex items-center justify-between px-5 py-4 active:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                {/* 완료 상태 아이콘 */}
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center",
                  allDone ? "bg-green-50" : "bg-gray-100"
                )}>
                  {allDone
                    ? <Check className="w-4 h-4 text-green-500" />
                    : <Clock className="w-4 h-4 text-gray-400" />}
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-txt-primary">{formatDate(day.date, "long")}</p>
                  <p className="text-xs text-txt-tertiary">
                    {allDone ? "둘 다 답변 완료" : `${bothDone}/${total} 답변 완료`}
                  </p>
                </div>
              </div>
              <ChevronDown className={cn(
                "w-5 h-5 text-txt-tertiary transition-transform duration-200",
                isOpen && "rotate-180"
              )} />
            </button>

            {/* 펼쳐진 질문 카드들 */}
            {isOpen && (
              <div className="px-4 pb-4 space-y-3">
                {day.states.map((state) => (
                  <QuestionCard key={state.question.id} {...state}
                    onSubmit={submitAnswer}
                    myNickname={myNickname}
                    partnerNickname={partnerNickname} />
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* 더 보기 버튼 */}
      {hasMore && (
        <button onClick={onLoadMore} disabled={loadingMore}
          className="w-full py-3 text-sm text-coral-400 font-medium">
          {loadingMore
            ? <Loader2 className="w-4 h-4 animate-spin mx-auto" />
            : "이전 질문 더 보기"}
        </button>
      )}
    </section>
  );
}
