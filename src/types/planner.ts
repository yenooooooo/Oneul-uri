/** 플래너 아이템 카테고리 */
export type PlanCategory =
  | "food" | "cafe" | "culture" | "walk"
  | "shopping" | "activity" | "etc";

/** 카테고리 정보 (아이콘, 라벨, 색상) */
export const PLAN_CATEGORIES: Record<PlanCategory, {
  emoji: string; label: string; color: string;
}> = {
  food: { emoji: "🍽️", label: "밥", color: "bg-coral-100 text-coral-500" },
  cafe: { emoji: "☕", label: "카페", color: "bg-amber-100 text-amber-700" },
  culture: { emoji: "🎬", label: "문화", color: "bg-purple-100 text-purple-600" },
  walk: { emoji: "🚶", label: "산책", color: "bg-emerald-100 text-emerald-600" },
  shopping: { emoji: "🛍️", label: "쇼핑", color: "bg-yellow-100 text-yellow-700" },
  activity: { emoji: "🎮", label: "놀거리", color: "bg-blue-100 text-blue-600" },
  etc: { emoji: "📌", label: "기타", color: "bg-gray-100 text-gray-600" },
};

/** 데이트 플래너 — date_plans 테이블 */
export interface DatePlan {
  id: string;
  couple_id: string;
  author_id: string;
  title: string;
  date: string;
  status: "planned" | "completed";
  converted_record_id: string | null;
  created_at: string;
  updated_at: string;
}

/** 플래너 아이템 — date_plan_items 테이블 */
export interface DatePlanItem {
  id: string;
  plan_id: string;
  sort_order: number;
  time: string | null; // "11:00" 형식
  category: PlanCategory;
  title: string;
  memo: string | null;
  link: string | null;
  is_from_roulette: boolean;
  created_at: string;
}

/** 플래너 생성 입력 */
export interface CreateDatePlan {
  title: string;
  date: string;
}

/** 아이템 생성/수정 입력 */
export interface CreatePlanItem {
  time?: string;
  category: PlanCategory;
  title: string;
  memo?: string;
  link?: string;
  is_from_roulette?: boolean;
}
