/** 편지지 종류 — 5가지 배경 스타일 */
export type StationeryType =
  | "default" // 기본
  | "flower" // 꽃무늬
  | "star" // 별무늬
  | "lined" // 줄노트
  | "craft"; // 크래프트

/** 펜팔 편지 — penpal_letters 테이블과 매핑 */
export interface PenpalLetter {
  id: string;
  couple_id: string;
  sender_id: string;
  receiver_id: string;
  content: string; // 편지 내용
  stationery: StationeryType; // 편지지 종류
  photo_url: string | null; // 첨부 사진 URL
  is_read: boolean; // 읽음 여부
  read_at: string | null; // 읽은 시간
  created_at: string;
}

/** 편지 작성 시 필요한 필드 */
export interface CreateLetter {
  content: string;
  stationery?: StationeryType;
  photo_url?: string;
}
