export type {
  Question, DailyQuestion, CoupleAnswer,
  AnswerType, QuestionCategory,
} from "./question";
export { QUESTION_CATEGORIES } from "./question";

/** 타입 re-export — 모든 타입을 한 곳에서 import 가능 */
export type {
  DateRecord,
  CreateDateRecord,
  UpdateDateRecord,
} from "./record";

export type {
  StationeryType,
  PenpalLetter,
  CreateLetter,
} from "./penpal";

export type {
  PlanCategory,
  DatePlan,
  DatePlanItem,
  CreateDatePlan,
  CreatePlanItem,
} from "./planner";
export { PLAN_CATEGORIES } from "./planner";

export type {
  WalletGoal,
  WalletTransaction,
  CreateWalletGoal,
  CreateTransaction,
} from "./wallet";

/** 기념일 — anniversaries 테이블과 매핑 */
export interface Anniversary {
  id: string;
  couple_id: string;
  title: string; // "100일", "여자친구 생일" 등
  date: string; // 기념일 날짜 (YYYY-MM-DD)
  type: "auto" | "custom" | "birthday"; // 자동 생성 / 직접 등록 / 생일
  is_recurring: boolean; // 매년 반복 여부
  memo: string | null;
  created_at: string;
}

/** 캘린더 일정 — calendar_events 테이블과 매핑 */
export interface CalendarEvent {
  id: string;
  couple_id: string;
  author_id: string;
  title: string; // "영화 보기"
  date: string;
  time: string | null;
  category: "date" | "personal" | "anniversary";
  memo: string | null;
  created_at: string;
}

/** 커플 스페이스 — couples 테이블과 매핑 */
export interface Couple {
  id: string;
  invite_code: string; // 6자리 초대 코드
  start_date: string; // 사귄 날짜
  user1_id: string | null;
  user2_id: string | null;
  user1_nickname: string;
  user2_nickname: string;
  user1_emoji: string;
  user2_emoji: string;
  user1_birthday: string | null; // user1 생일
  user2_birthday: string | null; // user2 생일
  user1_status: string; // user1 상태 메시지 (오늘의 한마디)
  user2_status: string; // user2 상태 메시지
  created_at: string;
}

export type {
  Pet, CreatePet, UpdatePet,
  PetDiary, CreatePetDiary,
  PetHealth, CreatePetHealth,
  PetGender, PetDiaryCategory, PetHealthType,
} from "./pet";
export { PET_DIARY_CATEGORIES, PET_HEALTH_TYPES } from "./pet";

/** 사용자 프로필 (인증 후 표시용) */
export interface UserProfile {
  id: string;
  email: string;
  nickname: string;
  emoji: string;
  couple_id: string | null;
}
