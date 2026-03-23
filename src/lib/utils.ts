import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind CSS 클래스를 병합한다.
 * clsx로 조건부 클래스를 처리하고, twMerge로 중복 제거
 * @param inputs - 클래스 문자열 또는 조건부 객체
 * @returns 병합된 클래스 문자열
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 두 날짜 사이의 일수 차이를 계산한다 (D+N일).
 * @param startDate - 시작 날짜 (YYYY-MM-DD 형식)
 * @returns D-day 숫자 (양수: 지난 날, 음수: 남은 날)
 */
export function calculateDday(startDate: string): number {
  const start = new Date(startDate);
  const today = new Date();

  // 시간 제거 후 날짜만 비교
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * 반복 기념일의 다가오는 날짜를 계산한다.
 * 올해 해당 월/일이 이미 지났으면 내년 날짜를 반환한다.
 * @param originalDate - 원래 날짜 (YYYY-MM-DD)
 * @returns 다가오는 날짜 (Date 객체)
 */
export function getNextRecurringDate(originalDate: string): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const original = new Date(originalDate);

  // 올해 해당 월/일로 설정
  const thisYear = new Date(
    today.getFullYear(), original.getMonth(), original.getDate()
  );
  thisYear.setHours(0, 0, 0, 0);

  // 올해 날짜가 이미 지났으면 내년으로
  if (thisYear.getTime() < today.getTime()) {
    return new Date(today.getFullYear() + 1, original.getMonth(), original.getDate());
  }
  return thisYear;
}

/**
 * 기념일의 D-day를 계산한다 (반복 기념일 대응).
 * @param date - 원래 날짜 (YYYY-MM-DD)
 * @param isRecurring - 매년 반복 여부
 * @returns D-day 숫자 (양수: 지난 날, 음수: 남은 날)
 */
export function calculateAnniversaryDday(date: string, isRecurring: boolean): number {
  if (!isRecurring) return calculateDday(date);

  const next = getNextRecurringDate(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diff = today.getTime() - next.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * 날짜를 한국어 형식으로 포맷팅한다.
 * @param dateString - 날짜 문자열 (YYYY-MM-DD)
 * @param format - 포맷 종류 ('long' | 'short' | 'dot')
 * @returns 포맷팅된 날짜 문자열
 */
export function formatDate(
  dateString: string,
  format: "long" | "short" | "dot" = "dot"
): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  switch (format) {
    case "long":
      return `${year}년 ${month}월 ${day}일`;
    case "short":
      return `${month}월 ${day}일`;
    case "dot":
      return `${year}.${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")}`;
  }
}

/**
 * 금액을 한국 원화 형식으로 포맷팅한다.
 * @param amount - 금액 (원)
 * @returns 포맷팅된 금액 문자열 (예: "320,000원")
 */
export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString("ko-KR")}원`;
}

/**
 * 6자리 랜덤 초대 코드를 생성한다.
 * 영문 대문자 + 숫자 조합
 * @returns 6자리 초대 코드
 */
export function generateInviteCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
