/** 기간별 메인 문구 — [최소일수, 최대일수, 문구배열] */
const PERIOD_MESSAGES: [number, number, string[]][] = [
  [1, 7, ["우리의 이야기가 막 시작됐어요", "설레는 첫 일주일을 보내고 있어요"]],
  [8, 30, ["매일이 새로운 우리의 {N}일째", "함께한 하루하루가 소중해요"]],
  [31, 99, ["매일이 설레는 {N}일째", "어느덧 {N}일이나 함께했어요", "너와 함께한 {N}일이 빛나요"]],
  [101, 199, ["100일을 넘긴 우리, 더 단단해졌어요", "매일 더 좋아지는 {N}일째"]],
  [201, 299, ["어느새 200일을 넘긴 우리", "함께할수록 더 좋은 {N}일째"]],
  [301, 364, ["1년이 코앞이에요! 함께한 {N}일째", "곧 1주년, 두근두근 {N}일째"]],
  [366, 499, ["1주년을 넘긴 우리, 더 깊어지는 사랑", "{N}일째, 여전히 설레는 우리"]],
  [501, 729, ["하루하루가 모여 {N}일이 됐어요", "{N}일째, 너와의 매일이 선물이에요"]],
  [731, 999, ["2년을 넘긴 우리, 함께한 {N}일째", "{N}일째, 점점 더 깊어지는 우리"]],
  [1001, Infinity, ["{N}일째, 셀 수 없이 많은 날을 함께", "우리의 {N}번째 오늘도 빛나요"]],
];

/** 특별한 날 고정 문구 — D-day 숫자 기준 */
const SPECIAL_MESSAGES: Record<number, string> = {
  100: "벌써 100일! 앞으로도 쭉 함께해요 💕",
  200: "200일이나 함께했다니, 대단한 우리 💕",
  300: "300일, 거의 1년을 향해 가고 있어요 💕",
  365: "1주년 축하해요! 우리가 함께한 365일 🎉",
  500: "500일! 반천일의 기적 같은 우리 💕",
  730: "2주년! 730일의 우리 이야기 🎉",
  1000: "1000일! 천일의 사랑, 축하해요 🎊",
  1095: "3주년! 함께여서 빛나는 매일 🎉",
  1460: "4주년! 변함없는 우리가 대단해요 🎉",
  1825: "5주년! 앞으로도 영원히 함께 🎉",
};

/** 계절 이모지 + 서브 문구 — 월 기준 */
const SEASON_DATA: Record<string, { emoji: string; messages: string[] }> = {
  spring: {
    emoji: "🌸",
    messages: ["벚꽃처럼 예쁜 우리", "봄바람처럼 설레는 날", "꽃피는 계절, 함께여서 좋아"],
  },
  summer: {
    emoji: "🌊",
    messages: ["함께하는 여름이 시원해요", "바다가 부르는 계절", "뜨거운 여름보다 뜨거운 우리"],
  },
  autumn: {
    emoji: "🍂",
    messages: ["단풍처럼 물드는 우리", "가을 하늘만큼 깊은 사랑", "낙엽 밟으며 걷고 싶은 날"],
  },
  winter: {
    emoji: "❄️",
    messages: ["추운 날엔 더 가까이", "겨울이 따뜻한 건 네 덕분", "눈 오는 날 손잡고 싶어"],
  },
};

/** 월 → 계절 변환 */
function getSeason(month: number): string {
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
}

/** 날짜 기반 시드 — 같은 날에는 같은 문구, 다음 날 자동 변경 */
function seededIndex(seed: number, length: number): number {
  return ((seed * 7 + 13) % length + length) % length;
}

/**
 * D-day 숫자와 현재 날짜를 기반으로 감성 문구를 반환한다.
 * @param daysCount - D+N일 숫자
 * @param now - 현재 날짜 (기본: today)
 * @returns { message: 메인 문구, emoji: 계절 이모지 }
 */
export function getDdayMessage(
  daysCount: number,
  now: Date = new Date()
): { message: string; emoji: string } {
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const season = SEASON_DATA[getSeason(month)];

  // 특별한 날은 고정 문구
  if (SPECIAL_MESSAGES[daysCount]) {
    return { message: SPECIAL_MESSAGES[daysCount], emoji: "" };
  }

  // 기간별 문구 찾기
  const period = PERIOD_MESSAGES.find(
    ([min, max]) => daysCount >= min && daysCount <= max
  );
  const messages = period?.[2] ?? ["{N}일째, 함께여서 행복해요"];

  // 날짜 기반 시드로 문구 선택 (하루 종일 동일)
  const seed = daysCount + month + day;
  const msgIndex = seededIndex(seed, messages.length);
  const raw = messages[msgIndex];

  // {N}을 실제 일수로 치환
  const message = raw.replace(/\{N\}/g, String(daysCount));

  return { message, emoji: season.emoji };
}
