"use client";

import { useEffect } from "react";
import { registerServiceWorker } from "@/lib/pwa/register-sw";

/**
 * Service Worker 등록 컴포넌트
 * 앱 로드 시 자동으로 SW를 등록한다
 * 루트 레이아웃에 포함하여 모든 페이지에서 활성화
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  // UI 렌더링 없음
  return null;
}
