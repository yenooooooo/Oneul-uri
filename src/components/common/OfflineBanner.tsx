"use client";

import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

/**
 * 오프라인 감지 배너 — 네트워크 끊기면 상단에 표시
 * 온라인 복귀 시 자동 숨김
 */
export default function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    /** 초기 상태 체크 */
    setOffline(!navigator.onLine);

    const goOffline = () => setOffline(true);
    const goOnline = () => setOffline(false);

    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);

    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-gray-800 text-white py-2 px-4 flex items-center justify-center gap-2 text-sm">
      <WifiOff className="w-4 h-4" />
      <span>인터넷 연결이 끊어졌어요</span>
    </div>
  );
}
