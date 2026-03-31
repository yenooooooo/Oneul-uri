"use client";

import { useEffect } from "react";

/**
 * 모달/오버레이 열릴 때 뒷배경 스크롤 방지 훅
 * body overflow: hidden 설정 → BottomNav가 MutationObserver로 감지하여 자동 숨김
 */
export function useLockScroll() {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
}
