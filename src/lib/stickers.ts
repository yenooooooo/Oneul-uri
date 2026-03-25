/** 스티커 아이템 타입 */
export interface StickerItem {
  id: string;
  label: string;
  emoji: string; // 이미지 없을 때 폴백용
}

/** 스티커 카테고리 타입 */
export interface StickerCategory {
  id: string;
  label: string;
  emoji: string;
  stickers: StickerItem[];
}

/** 스티커 카테고리 + 목록 상수 */
export const STICKER_CATEGORIES: StickerCategory[] = [
  {
    id: "date", label: "데이트", emoji: "💑",
    stickers: [
      { id: "date-eating", label: "밥먹기", emoji: "🍚" },
      { id: "date-cafe", label: "카페", emoji: "☕" },
      { id: "date-movie", label: "영화", emoji: "🎬" },
      { id: "date-walk", label: "산책", emoji: "🚶" },
      { id: "date-shopping", label: "쇼핑", emoji: "🛍️" },
      { id: "date-amusement", label: "놀이공원", emoji: "🎡" },
      { id: "date-photo", label: "사진", emoji: "📸" },
      { id: "date-couple-walk", label: "손잡고걷기", emoji: "👫" },
    ],
  },
  {
    id: "food", label: "음식", emoji: "🍽️",
    stickers: [
      { id: "food-sushi", label: "초밥", emoji: "🍣" },
      { id: "food-ramen", label: "라면", emoji: "🍜" },
      { id: "food-pizza", label: "피자", emoji: "🍕" },
      { id: "food-chicken", label: "치킨", emoji: "🍗" },
      { id: "food-cake", label: "케이크", emoji: "🎂" },
      { id: "food-beer", label: "건배", emoji: "🍻" },
    ],
  },
  {
    id: "travel", label: "여행", emoji: "✈️",
    stickers: [
      { id: "travel-airplane", label: "비행기", emoji: "✈️" },
      { id: "travel-beach", label: "바다", emoji: "🏖️" },
      { id: "travel-mountain", label: "산", emoji: "⛰️" },
      { id: "travel-drive", label: "드라이브", emoji: "🚗" },
      { id: "travel-suitcase", label: "여행가방", emoji: "🧳" },
    ],
  },
  {
    id: "anniversary", label: "기념일", emoji: "🎉",
    stickers: [
      { id: "anniv-birthday-cake", label: "생일케이크", emoji: "🎂" },
      { id: "anniv-gift", label: "선물", emoji: "🎁" },
      { id: "anniv-flowers", label: "꽃다발", emoji: "💐" },
      { id: "anniv-balloon", label: "하트풍선", emoji: "🎈" },
      { id: "anniv-confetti", label: "축하", emoji: "🎊" },
    ],
  },
  {
    id: "daily", label: "일상", emoji: "📌",
    stickers: [
      { id: "daily-exercise", label: "운동", emoji: "💪" },
      { id: "daily-study", label: "공부", emoji: "📚" },
      { id: "daily-rainy", label: "비오는날", emoji: "🌧️" },
      { id: "daily-cozy-home", label: "집에서쉬기", emoji: "🏠" },
    ],
  },
  {
    id: "mood", label: "기분", emoji: "😊",
    stickers: [
      { id: "mood-love", label: "사랑", emoji: "❤️" },
      { id: "mood-sleepy", label: "졸림", emoji: "😴" },
    ],
  },
];

/** 모든 스티커를 flat Map으로 — id로 빠르게 조회 */
export const STICKER_MAP = new Map<string, StickerItem>(
  STICKER_CATEGORIES.flatMap((c) =>
    c.stickers.map((s) => [s.id, s])
  )
);

/** 스티커 ID로 이모지 반환 (폴백용) */
export function getStickerEmoji(stickerId: string): string {
  return STICKER_MAP.get(stickerId)?.emoji ?? "📌";
}

/** 스티커 이미지 URL 반환 */
export function getStickerUrl(stickerId: string, size: 64 | 128 | 512 = 64): string {
  return `/stickers/${stickerId}-${size}.png`;
}
