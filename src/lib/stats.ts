import type { DateRecord } from "@/types";
import { MOOD_OPTIONS } from "@/types/record";

/** 월별 데이트 횟수 */
export interface MonthlyCount {
  month: string; // "2026-03"
  label: string; // "3월"
  count: number;
}

/** 장소 방문 순위 */
export interface PlaceRank {
  name: string;
  count: number;
}

/** 감정 통계 */
export interface MoodStat {
  value: string;
  emoji: string;
  label: string;
  count: number;
  percent: number;
}

/**
 * 최근 6개월 월별 데이트 횟수를 계산한다.
 * @param records - 전체 기록
 * @returns 월별 횟수 배열 (최근 6개월)
 */
export function getMonthlyStats(records: DateRecord[]): MonthlyCount[] {
  const now = new Date();
  const months: MonthlyCount[] = [];

  // 최근 6개월 생성
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    months.push({ month: key, label: `${d.getMonth() + 1}월`, count: 0 });
  }

  // 기록 카운트
  records.forEach((r) => {
    const d = new Date(r.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const found = months.find((m) => m.month === key);
    if (found) found.count++;
  });

  return months;
}

/**
 * 자주 가는 장소 TOP N을 계산한다.
 * @param records - 전체 기록
 * @param limit - 상위 N개 (기본 5)
 */
export function getTopPlaces(records: DateRecord[], limit = 5): PlaceRank[] {
  const counts = new Map<string, number>();
  records.forEach((r) => {
    if (r.location) {
      counts.set(r.location, (counts.get(r.location) ?? 0) + 1);
    }
  });
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * 감정 태그 통계를 계산한다.
 * @param records - 전체 기록
 */
export function getMoodStats(records: DateRecord[]): MoodStat[] {
  const counts = new Map<string, number>();
  let total = 0;

  records.forEach((r) => {
    if (r.mood) {
      counts.set(r.mood, (counts.get(r.mood) ?? 0) + 1);
      total++;
    }
  });

  return MOOD_OPTIONS
    .map((m) => ({
      value: m.value,
      emoji: m.emoji,
      label: m.label,
      count: counts.get(m.value) ?? 0,
      percent: total > 0 ? Math.round(((counts.get(m.value) ?? 0) / total) * 100) : 0,
    }))
    .filter((m) => m.count > 0)
    .sort((a, b) => b.count - a.count);
}
