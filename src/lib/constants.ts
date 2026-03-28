/** 자동 생성 기념일 목록 (사귄 날 기준 일수) */
export const AUTO_ANNIVERSARIES = [
  { days: 100, label: "100일" },
  { days: 200, label: "200일" },
  { days: 300, label: "300일" },
  { days: 400, label: "400일" },
  { days: 500, label: "500일" },
  { days: 600, label: "600일" },
  { days: 700, label: "700일" },
  { days: 800, label: "800일" },
  { days: 900, label: "900일" },
  { days: 1000, label: "1000일" },
  { days: 365, label: "1주년" },
  { days: 730, label: "2주년" },
  { days: 1095, label: "3주년" },
  { days: 1460, label: "4주년" },
  { days: 1825, label: "5주년" },
];

/** 하단 네비게이션 탭 목록 */
export const NAV_TABS = [
  { href: "/", label: "홈", icon: "Home" },
  { href: "/records", label: "기록", icon: "PenSquare" },
  { href: "/calendar", label: "캘린더", icon: "Calendar" },
  { href: "/penpal", label: "편지", icon: "Mail" },
  { href: "/wallet", label: "통장", icon: "Wallet" },
] as const;

/** 편지지 배경 스타일 */
export const STATIONERY_OPTIONS = [
  { value: "default", label: "기본" },
  { value: "flower", label: "꽃무늬" },
  { value: "star", label: "별무늬" },
  { value: "lined", label: "줄노트" },
  { value: "craft", label: "크래프트" },
] as const;

/** 룰렛 카테고리 */
export const ROULETTE_CATEGORIES = [
  { value: "food", label: "음식", emoji: "🍽️" },
  { value: "place", label: "장소", emoji: "📍" },
  { value: "activity", label: "활동", emoji: "🎮" },
] as const;

/** 사진 업로드 제한 */
export const MAX_PHOTOS = 5;

/** 반려견 성별 옵션 */
export const PET_GENDER_OPTIONS = [
  { value: "male" as const, label: "남아", emoji: "♂️" },
  { value: "female" as const, label: "여아", emoji: "♀️" },
  { value: "unknown" as const, label: "모름", emoji: "❓" },
];

/** 반려견 다이어리 사진 최대 수 */
export const MAX_PET_DIARY_PHOTOS = 3;

/** 편지 최대 글자 수 */
export const MAX_LETTER_LENGTH = 2000;
