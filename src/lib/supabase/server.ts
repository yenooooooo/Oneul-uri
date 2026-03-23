import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/env";

/**
 * Supabase 서버 클라이언트를 생성한다.
 * 서버 컴포넌트, API 라우트, 미들웨어에서 사용
 * 쿠키 기반 인증 세션을 자동으로 처리
 * 환경변수 미설정 시 placeholder URL로 생성 (빌드 시 에러 방지)
 * @returns Supabase 서버 클라이언트 인스턴스
 */
export async function createClient() {
  const cookieStore = await cookies();

  // 환경변수가 없으면 placeholder로 생성 (빌드 시 에러 방지)
  const url = SUPABASE_URL || "https://placeholder.supabase.co";
  const key = SUPABASE_ANON_KEY || "placeholder-key";

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // 서버 컴포넌트에서는 쿠키 설정 불가 — 무시
        }
      },
    },
  });
}
