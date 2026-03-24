/**
 * 간단한 메모리 캐시 — stale-while-revalidate 패턴
 * 페이지 이동 시 이전 데이터를 즉시 반환, 백그라운드에서 최신 데이터 fetch
 */

const cache = new Map<string, { data: unknown; timestamp: number }>();

/** 캐시 유효 시간 (5분) */
const CACHE_TTL = 5 * 60 * 1000;

/**
 * 캐시에서 데이터를 가져온다.
 * @param key - 캐시 키 (예: "records-{coupleId}")
 * @returns 캐시된 데이터 또는 null
 */
export function getCache<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  return entry.data as T;
}

/**
 * 캐시에 데이터를 저장한다.
 * @param key - 캐시 키
 * @param data - 저장할 데이터
 */
export function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

/**
 * 캐시가 만료되었는지 확인한다.
 * @param key - 캐시 키
 * @returns 만료되었거나 없으면 true
 */
export function isCacheStale(key: string): boolean {
  const entry = cache.get(key);
  if (!entry) return true;
  return Date.now() - entry.timestamp > CACHE_TTL;
}
