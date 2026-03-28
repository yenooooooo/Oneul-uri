"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

/** 당기기 임계값 (px) — 이만큼 당겨야 새로고침 트리거 */
const THRESHOLD = 120;

/**
 * Pull-to-Refresh 컴포넌트 — iOS PWA standalone 모드 대응
 * 페이지 최상단에서 명확히 세로로 당길 때만 새로고침
 * 가로 스와이프(사진 넘기기 등)는 무시
 */
export default function PullToRefresh({ children }: { children: React.ReactNode }) {
  const [pullDistance, setPullDistance] = useState(0); // 당긴 거리
  const [refreshing, setRefreshing] = useState(false); // 새로고침 중
  const startY = useRef(0); // 터치 시작 Y
  const startX = useRef(0); // 터치 시작 X
  const pulling = useRef(false); // 당기기 활성
  const directionLocked = useRef(false); // 방향 결정 완료
  const isVertical = useRef(false); // 세로 방향 확정

  useEffect(() => {
    /** 터치 시작 — 좌표 기록만, 방향은 아직 미결정 */
    const onTouchStart = (e: TouchEvent) => {
      if (window.scrollY <= 0 && !refreshing) {
        startY.current = e.touches[0].clientY;
        startX.current = e.touches[0].clientX;
        pulling.current = true;
        directionLocked.current = false;
        isVertical.current = false;
      }
    };

    /** 터치 이동 — 첫 10px 이동으로 가로/세로 방향 판별 */
    const onTouchMove = (e: TouchEvent) => {
      if (!pulling.current || refreshing) return;

      const diffY = e.touches[0].clientY - startY.current;
      const diffX = e.touches[0].clientX - startX.current;

      // 방향 아직 미결정 → 첫 이동으로 판별
      if (!directionLocked.current) {
        const absDiffY = Math.abs(diffY);
        const absDiffX = Math.abs(diffX);

        // 최소 10px 이동해야 방향 결정
        if (absDiffY < 10 && absDiffX < 10) return;

        directionLocked.current = true;
        // 세로 이동이 가로보다 1.5배 이상 크면 세로로 판정
        isVertical.current = absDiffY > absDiffX * 1.5;

        // 가로 스와이프 → 당기기 중단
        if (!isVertical.current) {
          pulling.current = false;
          return;
        }
      }

      // 세로 확정 + 아래로 당기는 경우만 처리
      if (isVertical.current && diffY > 0) {
        setPullDistance(Math.min(diffY * 0.3, THRESHOLD * 1.5));
      }
    };

    /** 터치 끝 — 임계값 넘으면 새로고침 */
    const onTouchEnd = () => {
      if (!pulling.current) return;
      pulling.current = false;
      directionLocked.current = false;

      if (isVertical.current && pullDistance >= THRESHOLD) {
        setRefreshing(true);
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

  const progress = Math.min(pullDistance / THRESHOLD, 1);

  return (
    <>
      {(pullDistance > 10 || refreshing) && (
        <div
          className="fixed top-0 left-0 right-0 z-50 flex justify-center"
          style={{ transform: `translateY(${pullDistance - 40}px)` }}
        >
          <div className="w-10 h-10 bg-white rounded-full shadow-card flex items-center justify-center">
            {refreshing ? (
              <Loader2 className="w-5 h-5 text-coral-400 animate-spin" />
            ) : (
              <Loader2
                className="w-5 h-5 text-coral-300"
                style={{ transform: `rotate(${progress * 360}deg)` }}
              />
            )}
          </div>
        </div>
      )}

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
