import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/env";

/**
 * Next.js 미들웨어 — 인증 세션 갱신 및 보호 라우트 처리
 * 모든 요청에서 Supabase 세션 쿠키를 갱신하고,
 * 로그인이 필요한 페이지에 미인증 접근 시 리다이렉트
 */
export async function middleware(request: NextRequest) {
  // 환경변수가 없으면 미들웨어 스킵 (빌드 시 또는 설정 전)
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  // Supabase 서버 클라이언트 생성 (미들웨어용 쿠키 처리)
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // 세션 갱신 시도
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 인증이 필요 없는 경로 (로그인, 회원가입)
  const publicPaths = ["/auth/login", "/auth/signup"];
  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // 미인증 사용자가 보호된 페이지에 접근 → 로그인으로 리다이렉트
  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // 로그인된 사용자가 인증 페이지에 접근 → 홈으로 리다이렉트
  if (user && isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

/** 미들웨어 적용 경로 설정 — 정적 파일과 API 제외 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
