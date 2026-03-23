"use client";

import BottomNav from "@/components/layout/BottomNav";
import PWAInstallBanner from "@/components/common/PWAInstallBanner";

/** AppLayout 컴포넌트 props */
interface AppLayoutProps {
  children: React.ReactNode;
}

/**
 * 앱 공통 레이아웃 — 하단 네비게이션 + PWA 설치 배너 포함
 * 하단 여백: 네비 높이(56px) + safe area로 콘텐츠가 가려지지 않게 처리
 */
export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-cream">
      {/* 메인 콘텐츠 — 하단 네비 + safe area 만큼 패딩 */}
      <main
        className="max-w-lg mx-auto"
        style={{ paddingBottom: "calc(3.5rem + env(safe-area-inset-bottom, 0px) + 1rem)" }}
      >
        {children}
      </main>

      {/* PWA 설치 유도 배너 */}
      <PWAInstallBanner />

      {/* 하단 네비게이션 */}
      <BottomNav />
    </div>
  );
}
