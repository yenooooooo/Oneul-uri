/** 쿠폰 종류 — coupon_types 테이블 */
export interface CouponType {
  id: string;
  couple_id: string;
  author_id: string;
  emoji: string;
  title: string;
  description: string | null;
  created_at: string;
}

/** 획득된 쿠폰 — coupons 테이블 */
export interface Coupon {
  id: string;
  couple_id: string;
  coupon_type_id: string;
  winner_id: string;
  bet_memo: string | null; // 내기 내용
  status: "active" | "used";
  used_at: string | null;
  created_at: string;
}

/** 쿠폰 + 타입 합친 뷰 */
export interface CouponWithType extends Coupon {
  coupon_type: CouponType;
}

/** 쿠폰 이모지 선택지 */
export const COUPON_EMOJIS = [
  "🎟️", "🍗", "🎬", "🍕", "☕", "🎮", "🛍️",
  "👑", "💋", "🌹", "🍰", "🎁", "⭐", "💎",
];
