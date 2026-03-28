"use client";

import { useState } from "react";
import type { Question, CoupleAnswer } from "@/types";
import { QUESTION_CATEGORIES } from "@/types/question";
import { Button } from "@/components/ui/button";
import { Loader2, Lock, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  question: Question;
  myAnswer: CoupleAnswer | null;
  partnerAnswer: CoupleAnswer | null;
  dailyId: string | null;
  onSubmit: (dailyId: string, type: "text" | "choice" | "scale", value: string | number) => Promise<boolean>;
  partnerNickname?: string;
  myNickname?: string;
}

/**
 * 질문 카드 — 질문 표시 + 답변 입력 + 블라인드 공개
 */
export default function QuestionCard({
  question, myAnswer, partnerAnswer, dailyId, onSubmit, partnerNickname, myNickname,
}: Props) {
  const [textInput, setTextInput] = useState("");
  const [choiceInput, setChoiceInput] = useState<"A" | "B" | null>(null);
  const [scaleInput, setScaleInput] = useState(5);
  const [saving, setSaving] = useState(false);
  const cat = QUESTION_CATEGORIES[question.category];

  /** 답변 제출 */
  const handleSubmit = async () => {
    if (!dailyId) return;
    setSaving(true);
    if (question.answerType === "text") await onSubmit(dailyId, "text", textInput);
    else if (question.answerType === "choice" && choiceInput) await onSubmit(dailyId, "choice", choiceInput);
    else if (question.answerType === "scale") await onSubmit(dailyId, "scale", scaleInput);
    setSaving(false);
  };

  // 둘 다 답변 완료 — 공개 모드
  const bothAnswered = !!myAnswer && !!partnerAnswer;
  // 내가 답변함 but 상대 아직
  const waitingPartner = !!myAnswer && !partnerAnswer;

  return (
    <div className="bg-white rounded-3xl p-5 shadow-soft space-y-4">
      {/* 카테고리 뱃지 + 질문 */}
      <div>
        <span className="text-xs bg-coral-50 text-coral-500 px-2.5 py-1 rounded-full font-medium">
          {cat.emoji} {cat.label}
        </span>
        <h3 className="text-lg font-bold text-txt-primary mt-3 leading-snug">{question.content}</h3>
      </div>

      {bothAnswered ? (
        /* 둘 다 답변 → 공개 */
        <AnswerReveal question={question} myAnswer={myAnswer} partnerAnswer={partnerAnswer}
          myNickname={myNickname} partnerNickname={partnerNickname} />
      ) : waitingPartner ? (
        /* 대기 중 */
        <div className="bg-coral-50/50 rounded-2xl p-4 text-center">
          <Lock className="w-5 h-5 text-coral-300 mx-auto mb-2" />
          <p className="text-sm text-coral-400 font-medium">상대방 답변을 기다리는 중...</p>
          <p className="text-xs text-txt-tertiary mt-1">둘 다 답변하면 공개돼요</p>
        </div>
      ) : (
        /* 답변 입력 */
        <AnswerInput question={question} textInput={textInput} setTextInput={setTextInput}
          choiceInput={choiceInput} setChoiceInput={setChoiceInput}
          scaleInput={scaleInput} setScaleInput={setScaleInput}
          saving={saving} onSubmit={handleSubmit} />
      )}
    </div>
  );
}

/** 답변 입력 폼 (내부 컴포넌트) */
function AnswerInput({ question, textInput, setTextInput, choiceInput, setChoiceInput,
  scaleInput, setScaleInput, saving, onSubmit }: {
  question: Question; textInput: string; setTextInput: (v: string) => void;
  choiceInput: "A" | "B" | null; setChoiceInput: (v: "A" | "B") => void;
  scaleInput: number; setScaleInput: (v: number) => void;
  saving: boolean; onSubmit: () => void;
}) {
  if (question.answerType === "text") return (
    <div className="space-y-3">
      <textarea value={textInput} onChange={(e) => setTextInput(e.target.value)}
        placeholder="솔직하게 답변해보세요..." rows={3}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm resize-none focus:border-coral-500 focus:ring-1 focus:ring-inset focus:ring-coral-500/20 outline-none" />
      <Button onClick={onSubmit} disabled={saving || !textInput.trim()}
        className="w-full rounded-full bg-coral-500 hover:bg-coral-600 text-white">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "답변하기"}
      </Button>
    </div>
  );

  if (question.answerType === "choice") return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {(["A", "B"] as const).map((opt) => (
          <button key={opt} onClick={() => setChoiceInput(opt)}
            className={cn("py-4 rounded-2xl text-sm font-bold transition-all",
              choiceInput === opt ? "bg-coral-500 text-white scale-105" : "bg-gray-100 text-gray-600"
            )}>{opt === "A" ? question.optionA : question.optionB}</button>
        ))}
      </div>
      <Button onClick={onSubmit} disabled={saving || !choiceInput}
        className="w-full rounded-full bg-coral-500 hover:bg-coral-600 text-white">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "선택하기"}
      </Button>
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="text-center">
        <span className="text-4xl font-bold text-coral-500">{scaleInput}</span>
        <span className="text-sm text-txt-tertiary"> / 10</span>
      </div>
      <input type="range" min={1} max={10} value={scaleInput}
        onChange={(e) => setScaleInput(Number(e.target.value))}
        className="w-full accent-coral-500" />
      <div className="flex justify-between text-xs text-txt-tertiary">
        <span>{question.scaleMin}</span><span>{question.scaleMax}</span>
      </div>
      <Button onClick={onSubmit} disabled={saving}
        className="w-full rounded-full bg-coral-500 hover:bg-coral-600 text-white">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "제출하기"}
      </Button>
    </div>
  );
}

/** 답변 공개 (내부 컴포넌트) */
function AnswerReveal({ question, myAnswer, partnerAnswer, myNickname, partnerNickname }: {
  question: Question; myAnswer: CoupleAnswer; partnerAnswer: CoupleAnswer;
  myNickname?: string; partnerNickname?: string;
}) {
  /** 답변값 추출 */
  const getVal = (a: CoupleAnswer) => {
    if (question.answerType === "text") return a.answer_text ?? "";
    if (question.answerType === "choice") return a.answer_choice === "A" ? question.optionA : question.optionB;
    return `${a.answer_scale}/10`;
  };
  const isSame = question.answerType === "choice"
    ? myAnswer.answer_choice === partnerAnswer.answer_choice
    : question.answerType === "scale"
    ? myAnswer.answer_scale === partnerAnswer.answer_scale
    : false;

  return (
    <div className="space-y-3">
      {isSame && (
        <div className="text-center py-2">
          <span className="text-sm font-bold text-coral-500">💕 같은 답변!</span>
        </div>
      )}
      {[{ label: myNickname ?? "나", val: getVal(myAnswer) },
        { label: partnerNickname ?? "상대", val: getVal(partnerAnswer) }].map((item) => (
        <div key={item.label} className="bg-surface-low rounded-2xl p-4">
          <p className="text-xs font-bold text-txt-tertiary mb-1">{item.label}</p>
          <p className="text-sm text-txt-primary">{item.val}</p>
        </div>
      ))}
      <div className="flex justify-center">
        <Check className="w-4 h-4 text-green-500" />
        <span className="text-xs text-green-600 ml-1">둘 다 답변 완료</span>
      </div>
    </div>
  );
}
