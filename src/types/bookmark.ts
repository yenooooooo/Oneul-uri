/** 장소 카테고리 */
export type PlaceCategory = "food" | "cafe" | "culture" | "nature" | "etc";

/** 카테고리 표시 정보 */
export const PLACE_CATEGORIES: Record<PlaceCategory, { emoji: string; label: string }> = {
  food: { emoji: "🍽️", label: "맛집" },
  cafe: { emoji: "☕", label: "카페" },
  culture: { emoji: "🎬", label: "문화" },
  nature: { emoji: "🌿", label: "자연" },
  etc: { emoji: "📍", label: "기타" },
};

/** 북마크된 장소 — bookmarked_places 테이블 */
export interface BookmarkedPlace {
  id: string;
  couple_id: string;
  author_id: string;
  name: string;
  category: PlaceCategory;
  memo: string | null;
  visit_count: number;
  last_visited: string | null;
  created_at: string;
}

/** 장소 북마크 생성 입력 */
export interface CreateBookmark {
  name: string;
  category?: PlaceCategory;
  memo?: string;
}
