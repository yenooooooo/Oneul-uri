/** 데이트 통장 목표 — wallet_goals 테이블과 매핑 */
export interface WalletGoal {
  id: string;
  couple_id: string;
  title: string; // 목표명 ("제주도 여행")
  target_amount: number; // 목표 금액 (원)
  current_amount: number; // 현재 모은 금액
  target_date: string | null; // 목표 달성 희망 날짜
  is_achieved: boolean; // 달성 여부
  achieved_at: string | null; // 달성 일시
  achieved_milestones: number[]; // 달성된 마일스톤 퍼센트 배열
  created_at: string;
}

/** 통장 거래 내역 — wallet_transactions 테이블과 매핑 */
export interface WalletTransaction {
  id: string;
  couple_id: string;
  goal_id: string;
  user_id: string;
  amount: number; // 양수: 입금, 음수: 출금
  memo: string | null; // 메모 ("3월 월급에서 5만원")
  created_at: string;
}

/** 목표 생성 시 필요한 필드 */
export interface CreateWalletGoal {
  title: string;
  target_amount: number;
  target_date?: string; // 목표 달성 희망 날짜 (선택)
}

/** 입금/출금 생성 시 필요한 필드 */
export interface CreateTransaction {
  goal_id: string;
  amount: number;
  memo?: string;
}

/** 마일스톤 정의 */
export const MILESTONES = [
  { percent: 10, emoji: "🌱", message: "첫 걸음! 여행 자금 모으기 시작!" },
  { percent: 25, emoji: "🚀", message: "1/4 달성! 순조로운 출발이야!" },
  { percent: 50, emoji: "🎉", message: "반이나 모았어! 절반 왔다!" },
  { percent: 75, emoji: "✨", message: "거의 다 왔어! 여행이 코앞이야!" },
  { percent: 100, emoji: "🎊", message: "목표 달성! 여행 가자!" },
] as const;

/** 페이스 판정 타입 */
export type PaceStatus = "fast" | "onTrack" | "slow" | "noData";
