/**
 * 환경변수를 한 곳에서 관리하고 타입 체크한다.
 * 필수 환경변수가 없으면 에러를 발생시킨다.
 */

/** Supabase 프로젝트 URL */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

/** Supabase 익명(공개) 키 */
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** VAPID 공개 키 (웹 푸시 알림용, 선택) */
export const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";

/**
 * 필수 환경변수가 설정되어 있는지 검증한다.
 * 서버 시작 시 호출하여 누락된 변수를 조기에 감지
 */
export function validateEnv(): void {
  const required = [
    { key: "NEXT_PUBLIC_SUPABASE_URL", value: SUPABASE_URL },
    { key: "NEXT_PUBLIC_SUPABASE_ANON_KEY", value: SUPABASE_ANON_KEY },
  ];

  const missing = required.filter((env) => !env.value);

  if (missing.length > 0) {
    console.error(
      "[env] 필수 환경변수 누락:",
      missing.map((e) => e.key).join(", ")
    );
  }
}
