"use client";

import PWAInstallBanner from "@/components/common/PWAInstallBanner";
import { LAYOUT_BOTTOM_PADDING } from "@/lib/constants";

/** AppLayout 컴포넌트 props */
interface AppLayoutProps {
  children: React.ReactNode;
}

/**
 * 앱 공통 레이아웃 — 콘텐츠 영역 + PWA 배너
 * BottomNav는 layout.tsx 최상위에서 렌더링 (fixed 안정성)
 */
export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-surface">
      {/* 메인 콘텐츠 — 하단 네비 + safe area 만큼 패딩 */}
      <main
        className="max-w-lg mx-auto"
        style={{ paddingBottom: LAYOUT_BOTTOM_PADDING }}
      >
        {children}
      </main>

      {/* PWA 설치 유도 배너 */}
      <PWAInstallBanner />
    </div>
  );
}
