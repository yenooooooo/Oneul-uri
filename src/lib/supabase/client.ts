import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/env";

/**
 * Supabase 브라우저 클라이언트를 생성한다.
 * 클라이언트 컴포넌트에서 Supabase에 접근할 때 사용
 * 환경변수 미설정 시 placeholder URL로 생성 (빌드 시 에러 방지)
 * @returns Supabase 클라이언트 인스턴스
 */
export function createClient() {
  // 환경변수가 없으면 placeholder로 생성 (실제 요청 시 실패하지만 빌드는 통과)
  const url = SUPABASE_URL || "https://placeholder.supabase.co";
  const key = SUPABASE_ANON_KEY || "placeholder-key";

  return createBrowserClient(url, key);
}
