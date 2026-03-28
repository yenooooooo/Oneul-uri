/** 반려견 성별 타입 */
export type PetGender = "male" | "female" | "unknown";

/** 성장 일기 카테고리 */
export type PetDiaryCategory = "daily" | "milestone" | "funny" | "sick";

/** 건강 기록 종류 */
export type PetHealthType = "vaccination" | "checkup" | "grooming" | "medication" | "surgery";

/** 반려견 프로필 — pets 테이블 매핑 */
export interface Pet {
  id: string;
  couple_id: string;
  name: string;
  breed: string | null;
  birthday: string | null;
  adoption_date: string | null;
  gender: PetGender;
  weight_kg: number | null;
  photo_url: string | null;
  personality: string | null;
  likes: string[]; // 좋아하는 것 태그 배열
  dislikes: string[]; // 싫어하는 것 태그 배열
  created_at: string;
  updated_at: string;
}

/** 반려견 등록 입력 */
export interface CreatePet {
  name: string;
  breed?: string;
  birthday?: string;
  adoption_date?: string;
  gender: PetGender;
  weight_kg?: number;
  photo_url?: string;
  personality?: string;
  likes?: string[];
  dislikes?: string[];
}

/** 반려견 수정 입력 — 모든 필드 선택 */
export type UpdatePet = Partial<CreatePet>;

/** 성장 일기 — pet_diaries 테이블 매핑 */
export interface PetDiary {
  id: string;
  pet_id: string;
  couple_id: string;
  author_id: string;
  date: string;
  title: string;
  content: string | null;
  category: PetDiaryCategory;
  photos: string[];
  created_at: string;
}

/** 성장 일기 작성 입력 */
export interface CreatePetDiary {
  date: string;
  title: string;
  content?: string;
  category: PetDiaryCategory;
  photos?: string[];
}

/** 건강 기록 — pet_health 테이블 매핑 */
export interface PetHealth {
  id: string;
  pet_id: string;
  couple_id: string;
  date: string;
  type: PetHealthType;
  title: string;
  hospital: string | null;
  cost: number | null;
  next_date: string | null; // 다음 예정일 (예: 다음 접종일)
  memo: string | null;
  created_at: string;
}

/** 건강 기록 작성 입력 */
export interface CreatePetHealth {
  date: string;
  type: PetHealthType;
  title: string;
  hospital?: string;
  cost?: number;
  next_date?: string;
  memo?: string;
}

/** 일기 카테고리 표시 옵션 */
export const PET_DIARY_CATEGORIES: Record<PetDiaryCategory, { emoji: string; label: string }> = {
  daily: { emoji: "📝", label: "일상" },
  milestone: { emoji: "🎉", label: "성장" },
  funny: { emoji: "😆", label: "웃긴" },
  sick: { emoji: "🏥", label: "아픈 날" },
};

/** 건강 기록 종류 표시 옵션 */
export const PET_HEALTH_TYPES: Record<PetHealthType, { emoji: string; label: string }> = {
  vaccination: { emoji: "💉", label: "예방접종" },
  checkup: { emoji: "🩺", label: "건강검진" },
  grooming: { emoji: "✂️", label: "미용" },
  medication: { emoji: "💊", label: "투약" },
  surgery: { emoji: "🏥", label: "수술" },
};
