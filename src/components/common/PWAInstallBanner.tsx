"use client";

import { useEffect, useState } from "react";
import { X, Share, PlusSquare } from "lucide-react";
import {
  shouldShowInstallBanner,
  dismissInstallPrompt,
  isIOS,
} from "@/lib/pwa/install-prompt";
import { FAB_BOTTOM } from "@/lib/constants";

/**
 * PWA 설치 유도 배너
 * iOS Safari에서 "홈 화면에 추가" 가이드 표시
 * 한 번 닫으면 localStorage에 저장하고 다시 안 보여줌
 */
export default function PWAInstallBanner() {
  const [show, setShow] = useState(false); // 배너 표시 여부

  // 클라이언트 사이드에서만 표시 여부 판단
  useEffect(() => {
    setShow(shouldShowInstallBanner());
  }, []);

  if (!show) return null;

  /** 배너 닫기 */
  const handleDismiss = () => {
    dismissInstallPrompt();
    setShow(false);
  };

  const isIOSDevice = isIOS();

  return (
    <div
      className="fixed left-4 right-4 z-40 animate-fade-up"
      style={{ bottom: FAB_BOTTOM }}
    >
      <div className="bg-white rounded-2xl p-4 shadow-float border border-coral-100 relative max-w-lg mx-auto">
        {/* 닫기 버튼 */}
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 text-txt-tertiary"
        >
          <X className="w-4 h-4" />
        </button>

        <p className="font-medium text-txt-primary text-sm mb-2">
          홈 화면에 추가하면 앱처럼 사용할 수 있어요!
        </p>

        {isIOSDevice ? (
          /* iOS 가이드 */
          <div className="flex items-center gap-3 text-xs text-txt-secondary">
            <div className="flex items-center gap-1">
              <span className="font-medium">1.</span>
              <Share className="w-4 h-4 text-blue-soft" />
              <span>공유 버튼</span>
            </div>
            <span>→</span>
            <div className="flex items-center gap-1">
              <span className="font-medium">2.</span>
              <PlusSquare className="w-4 h-4 text-blue-soft" />
              <span>홈 화면에 추가</span>
            </div>
          </div>
        ) : (
          /* Android/기타 가이드 */
          <p className="text-xs text-txt-secondary">
            브라우저 메뉴에서 &quot;홈 화면에 추가&quot;를 선택해주세요
          </p>
        )}
      </div>
    </div>
  );
}
