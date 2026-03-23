"use client";

import BottomNav from "@/components/layout/BottomNav";
import PWAInstallBanner from "@/components/common/PWAInstallBanner";

/** AppLayout 컴포넌트 props */
interface AppLayoutProps {
  children: React.ReactNode;
}

/**
 * 앱 공통 레이아웃 — 하단 네비게이션 + PWA 설치 배너 포함
 * 인증된 사용자의 메인 화면에서 사용
 * 하단 네비 높이만큼 콘텐츠 영역에 패딩 추가
 */
export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-cream">
      {/* 메인 콘텐츠 — 하단 네비 높이(80px)만큼 패딩 */}
      <main className="pb-20 max-w-lg mx-auto">{children}</main>

      {/* PWA 설치 유도 배너 */}
      <PWAInstallBanner />

      {/* 하단 네비게이션 */}
      <BottomNav />
    </div>
  );
}
