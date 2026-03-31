import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/components/common/AuthProvider";
import { CoupleProvider } from "@/components/common/CoupleProvider";
import ServiceWorkerRegister from "@/components/common/ServiceWorkerRegister";
import PullToRefresh from "@/components/common/PullToRefresh";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import OfflineBanner from "@/components/common/OfflineBanner";
import BottomNav from "@/components/layout/BottomNav";
import { ModalStateProvider } from "@/hooks/useModalState";

/**
 * 오늘우리 앱의 메타데이터 설정
 * PWA manifest, iOS 전용 메타태그, SEO 정보 포함
 */
export const metadata: Metadata = {
  title: "오늘우리",
  description: "우리 둘만의 데이트 기록 앱",
  manifest: "/manifest.json",
  /* iOS PWA 전용 메타태그 */
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "오늘우리",
  },
  /* 아이콘 */
  icons: {
    icon: [
      { url: "/icons/favicon.ico", sizes: "any" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
};

/**
 * 뷰포트 설정 — 모바일 최적화 + PWA 테마 컬러
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#FF6B6B",
  viewportFit: "cover",
};

/**
 * 루트 레이아웃 — 전체 앱을 감싸는 최상위 레이아웃
 * BottomNav는 PullToRefresh 바깥에 배치 (fixed 안정성)
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased overscroll-none">
        <ErrorBoundary>
          <AuthProvider>
            <CoupleProvider>
              <ModalStateProvider>
                {/* 메인 콘텐츠 — PullToRefresh 래퍼 */}
                <PullToRefresh>
                  {children}
                </PullToRefresh>

                {/* 하단 네비 — PullToRefresh 바깥, 모달 열리면 숨김 */}
                <BottomNav />
              </ModalStateProvider>
            </CoupleProvider>
          </AuthProvider>
        </ErrorBoundary>
        {/* 오프라인 감지 배너 */}
        <OfflineBanner />
        {/* 토스트 알림 — 친절한 한글 메시지용 */}
        <Toaster position="top-center" richColors />
        {/* Service Worker 등록 — PWA 캐싱 + 푸시 알림 */}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
