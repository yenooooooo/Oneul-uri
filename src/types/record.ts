/** 감정 태그 이모지 목록 */
export const MOOD_OPTIONS = [
  { value: "love", emoji: "😍", label: "최고" },
  { value: "happy", emoji: "😊", label: "행복" },
  { value: "excited", emoji: "🤩", label: "신남" },
  { value: "cozy", emoji: "🥰", label: "포근" },
  { value: "funny", emoji: "😂", label: "웃긴" },
  { value: "tired", emoji: "😴", label: "피곤" },
  { value: "sad", emoji: "😢", label: "아쉬움" },
] as const;

/** 데이트 기록 — date_records 테이블과 매핑 */
export interface DateRecord {
  id: string;
  couple_id: string;
  author_id: string;
  title: string; // 기록 제목 ("홍대 데이트")
  date: string; // 데이트 날짜 (YYYY-MM-DD)
  location: string | null; // 장소명
  memo: string | null; // 상세 메모
  mood: string | null; // 감정 태그 ("love", "happy" 등)
  photos: string[]; // 사진 URL 배열 (최대 5장)
  created_at: string;
  updated_at: string;
}

/** 데이트 기록 생성 시 필요한 필드 */
export interface CreateDateRecord {
  title: string;
  date: string;
  location?: string;
  memo?: string;
  mood?: string;
  photos?: string[];
}

/** 데이트 기록 수정 시 필요한 필드 */
export interface UpdateDateRecord {
  title?: string;
  date?: string;
  location?: string;
  memo?: string;
  mood?: string;
  photos?: string[];
}
