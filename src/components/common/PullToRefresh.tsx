"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

/** 당기기 임계값 (px) — 이만큼 당겨야 새로고침 트리거 */
const THRESHOLD = 80;

/**
 * Pull-to-Refresh 컴포넌트 — iOS PWA standalone 모드 대응
 * 페이지 최상단에서 아래로 당기면 새로고침
 * children을 감싸서 사용
 */
export default function PullToRefresh({ children }: { children: React.ReactNode }) {
  const [pullDistance, setPullDistance] = useState(0); // 당긴 거리 (px)
  const [refreshing, setRefreshing] = useState(false); // 새로고침 중
  const startY = useRef(0); // 터치 시작 Y 좌표
  const pulling = useRef(false); // 당기기 진행 중

  useEffect(() => {
    /** 터치 시작 — 스크롤이 최상단일 때만 당기기 시작 */
    const onTouchStart = (e: TouchEvent) => {
      if (window.scrollY <= 0 && !refreshing) {
        startY.current = e.touches[0].clientY;
        pulling.current = true;
      }
    };

    /** 터치 이동 — 당긴 거리 계산 */
    const onTouchMove = (e: TouchEvent) => {
      if (!pulling.current || refreshing) return;

      const diff = e.touches[0].clientY - startY.current;
      if (diff > 0) {
        // 저항감 적용 (당길수록 느려지게)
        setPullDistance(Math.min(diff * 0.4, THRESHOLD * 1.5));
      }
    };

    /** 터치 끝 — 임계값 넘으면 새로고침 */
    const onTouchEnd = () => {
      if (!pulling.current) return;
      pulling.current = false;

      if (pullDistance >= THRESHOLD) {
        setRefreshing(true);
        // 짧은 딜레이 후 새로고침 (스피너 보이도록)
        setTimeout(() => window.location.reload(), 300);
      } else {
        setPullDistance(0);
      }
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("touchend", onTouchEnd);

    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [pullDistance, refreshing]);

  // 당기기 진행률 (0~1)
  const progress = Math.min(pullDistance / THRESHOLD, 1);

  return (
    <>
      {/* 새로고침 인디케이터 */}
      {(pullDistance > 10 || refreshing) && (
        <div
          className="fixed top-0 left-0 right-0 z-50 flex justify-center transition-transform"
          style={{ transform: `translateY(${pullDistance - 40}px)` }}
        >
          <div className="w-10 h-10 bg-white rounded-full shadow-card flex items-center justify-center">
            {refreshing ? (
              <Loader2 className="w-5 h-5 text-coral-400 animate-spin" />
            ) : (
              <Loader2
                className="w-5 h-5 text-coral-300 transition-transform"
                style={{ transform: `rotate(${progress * 360}deg)` }}
              />
            )}
          </div>
        </div>
      )}

      {/* 콘텐츠 — 당기면 아래로 밀림 */}
      <div
        style={{
          transform: pullDistance > 10 ? `translateY(${pullDistance}px)` : "none",
          transition: pulling.current ? "none" : "transform 0.3s ease",
        }}
      >
        {children}
      </div>
    </>
  );
}
