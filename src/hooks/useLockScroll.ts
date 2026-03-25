"use client";

import { useEffect } from "react";

/**
 * 모달/오버레이 열릴 때 뒷배경 스크롤 방지 훅
 * 컴포넌트 마운트 시 body overflow: hidden, 언마운트 시 복원
 */
export function useLockScroll() {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
}
