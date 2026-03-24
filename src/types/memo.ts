/** 메모 카테고리 */
export type MemoCategory = "wishlist" | "places" | "bucket" | "grocery" | "free";

/** 메모 카드 컬러 */
export type MemoColor = "default" | "pink" | "blue" | "yellow" | "green";

/** 카테고리 표시 정보 */
export const MEMO_CATEGORIES: Record<MemoCategory, { emoji: string; label: string }> = {
  wishlist: { emoji: "🛍️", label: "사고 싶은 것" },
  places: { emoji: "📍", label: "가고 싶은 곳" },
  bucket: { emoji: "⭐", label: "하고 싶은 것" },
  grocery: { emoji: "🛒", label: "장보기" },
  free: { emoji: "📝", label: "자유 메모" },
};

/** 카드 컬러 스타일 */
export const MEMO_COLORS: Record<MemoColor, string> = {
  default: "bg-white",
  pink: "bg-coral-50",
  blue: "bg-blue-50",
  yellow: "bg-amber-50",
  green: "bg-emerald-50",
};

/** 메모 — couple_memos 테이블 */
export interface CoupleMemo {
  id: string;
  couple_id: string;
  author_id: string;
  category: MemoCategory;
  title: string;
  is_pinned: boolean;
  color: MemoColor;
  created_at: string;
  updated_at: string;
}

/** 체크리스트 아이템 — memo_items 테이블 */
export interface MemoItem {
  id: string;
  memo_id: string;
  content: string;
  is_checked: boolean;
  sort_order: number;
  created_at: string;
}
