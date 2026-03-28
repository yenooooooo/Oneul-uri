import type { Question } from "@/types/question";
import { TEXT_HONEST } from "./text-honest";
import { TEXT_BETWEEN } from "./text-between";
import { TEXT_IFONLY } from "./text-ifonly";
import { TEXT_TMI } from "./text-tmi";
import { CHOICE_QUESTIONS } from "./choice";
import { SCALE_QUESTIONS } from "./scale";

/** 전체 자유서술 질문 풀 */
export const TEXT_POOL: Question[] = [
  ...TEXT_HONEST, ...TEXT_BETWEEN, ...TEXT_IFONLY, ...TEXT_TMI,
];

/** 전체 양자택일 질문 풀 */
export const CHOICE_POOL: Question[] = CHOICE_QUESTIONS;

/** 전체 점수형 질문 풀 */
export const SCALE_POOL: Question[] = SCALE_QUESTIONS;

/** 전체 질문 (ID로 빠르게 조회) */
const ALL_QUESTIONS = [...TEXT_POOL, ...CHOICE_POOL, ...SCALE_POOL];
export const QUESTION_MAP = new Map<number, Question>(
  ALL_QUESTIONS.map((q) => [q.id, q])
);

/**
 * 한국 시간 기준 오늘 날짜 (YYYY-MM-DD)
 * UTC+9 적용
 */
export function getKSTDate(): string {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().split("T")[0];
}

/**
 * 날짜 기반으로 오늘의 질문 3개를 결정한다 (서술 + 선택 + 점수)
 * 날짜를 시드로 사용하여 결정적(deterministic) — 같은 날 같은 질문
 * @param dateStr - YYYY-MM-DD 형식 (KST)
 * @returns [text질문, choice질문, scale질문]
 */
export function getDailyQuestions(dateStr: string): [Question, Question, Question] {
  // 날짜를 숫자로 변환 — 간단한 해시
  const seed = dateStr.split("-").reduce((acc, v) => acc * 31 + Number(v), 0);

  const textQ = TEXT_POOL[Math.abs(seed) % TEXT_POOL.length];
  const choiceQ = CHOICE_POOL[Math.abs(seed * 7) % CHOICE_POOL.length];
  const scaleQ = SCALE_POOL[Math.abs(seed * 13) % SCALE_POOL.length];

  return [textQ, choiceQ, scaleQ];
}
