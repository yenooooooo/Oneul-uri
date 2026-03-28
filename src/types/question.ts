/** 질문 답변 타입 */
export type AnswerType = "text" | "choice" | "scale";

/** 질문 카테고리 */
export type QuestionCategory =
  | "honest"    // 솔직히
  | "ifonly"    // 만약에
  | "between"   // 우리 사이
  | "choice"    // 선택장애
  | "future"    // 미래
  | "tmi"       // TMI
  | "values"    // 가치관
  | "pet";      // 반려동물

/** 질문 풀 아이템 */
export interface Question {
  id: number;
  category: QuestionCategory;
  content: string;
  answerType: AnswerType;
  optionA?: string; // choice 타입일 때
  optionB?: string;
  scaleMin?: string; // scale 타입일 때 (예: "전혀 아니다")
  scaleMax?: string; // (예: "완전 그렇다")
}

/** 오늘의 질문 (DB 매핑) — couple_question_daily */
export interface DailyQuestion {
  id: string;
  couple_id: string;
  question_id: number;
  date: string; // YYYY-MM-DD (KST)
  created_at: string;
}

/** 답변 (DB 매핑) — couple_answers */
export interface CoupleAnswer {
  id: string;
  daily_id: string;
  user_id: string;
  answer_text: string | null;
  answer_choice: string | null; // "A" | "B"
  answer_scale: number | null;  // 1~10
  created_at: string;
}

/** 카테고리 표시 옵션 */
export const QUESTION_CATEGORIES: Record<QuestionCategory, { emoji: string; label: string }> = {
  honest: { emoji: "🔥", label: "솔직히" },
  ifonly: { emoji: "💭", label: "만약에" },
  between: { emoji: "💕", label: "우리 사이" },
  choice: { emoji: "🎯", label: "선택장애" },
  future: { emoji: "🔮", label: "미래" },
  tmi: { emoji: "😂", label: "TMI" },
  values: { emoji: "🧠", label: "가치관" },
  pet: { emoji: "🐶", label: "반려동물" },
};
