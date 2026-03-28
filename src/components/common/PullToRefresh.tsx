"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

/** 당기기 임계값 (px) — 이만큼 당겨야 새로고침 트리거 */
const THRESHOLD = 140;
/** 당기기 시작 무시 구간 (px) */
const DEAD_ZONE = 30;

/**
 * Pull-to-Refresh 컴포넌트 — iOS PWA standalone 모드 대응
 * - 페이지 최상단에서 명확히 세로로 당길 때만 새로고침
 * - 가로 스와이프(사진 넘기기 등) 무시
 * - 모달(body overflow:hidden) 열린 상태에서 비활성화
 * - location.reload 대신 Router.refresh()로 부드러운 갱신
 */
export default function PullToRefresh({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [displayDistance, setDisplayDistance] = useState(0); // UI 표시용 거리
  const [refreshing, setRefreshing] = useState(false); // 새로고침 중

  const startY = useRef(0); // 터치 시작 Y
  const startX = useRef(0); // 터치 시작 X
  const pulling = useRef(false); // 당기기 활성
  const directionLocked = useRef(false); // 방향 결정 완료
  const isVertical = useRef(false); // 세로 방향 확정
  const distanceRef = useRef(0); // 당긴 거리 (ref로 관리 — 리스너 재등록 방지)

  /** 새로고침 실행 — Router.refresh()로 부드러운 데이터 갱신 */
  const doRefresh = useCallback(() => {
    setRefreshing(true);
    router.refresh();
    // 짧은 딜레이 후 리셋 (데이터 fetch 시간 확보)
    setTimeout(() => {
      setRefreshing(false);
      setDisplayDistance(0);
      distanceRef.current = 0;
    }, 800);
  }, [router]);

  useEffect(() => {
    /** 모달 열림 감지 — body overflow:hidden이면 비활성화 */
    const isModalOpen = () => document.body.style.overflow === "hidden";

    /** 터치 시작 — 좌표 기록만, 방향은 아직 미결정 */
    const onTouchStart = (e: TouchEvent) => {
      if (isModalOpen() || window.scrollY > 0 || refreshing) return;
      startY.current = e.touches[0].clientY;
      startX.current = e.touches[0].clientX;
      pulling.current = true;
      directionLocked.current = false;
      isVertical.current = false;
      distanceRef.current = 0;
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
        if (absDiffY < 10 && absDiffX < 10) return;

        directionLocked.current = true;
        isVertical.current = absDiffY > absDiffX * 1.5;

        if (!isVertical.current) {
          pulling.current = false;
          return;
        }
      }

      // 세로 확정 + 아래로 당기는 경우만 처리 (데드존 이후부터 반응)
      if (isVertical.current && diffY > DEAD_ZONE) {
        const effective = (diffY - DEAD_ZONE) * 0.25;
        const clamped = Math.min(effective, THRESHOLD * 1.3);
        distanceRef.current = clamped;
        setDisplayDistance(clamped);
      }
    };

    /** 터치 끝 — 임계값 넘으면 새로고침 */
    const onTouchEnd = () => {
      if (!pulling.current) return;
      pulling.current = false;
      directionLocked.current = false;

      if (isVertical.current && distanceRef.current >= THRESHOLD) {
        doRefresh();
      } else {
        distanceRef.current = 0;
        setDisplayDistance(0);
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
  }, [refreshing, doRefresh]);

  const progress = Math.min(displayDistance / THRESHOLD, 1);

  return (
    <>
      {/* 인디케이터 — 당기는 중이거나 새로고침 중일 때 표시 */}
      {(displayDistance > 30 || refreshing) && (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center"
          style={{ transform: `translateY(${displayDistance - 40}px)` }}>
          <div className="w-10 h-10 bg-white rounded-full shadow-card flex items-center justify-center">
            {refreshing ? (
              <Loader2 className="w-5 h-5 text-coral-400 animate-spin" />
            ) : (
              <Loader2 className="w-5 h-5 text-coral-300"
                style={{ transform: `rotate(${progress * 360}deg)` }} />
            )}
          </div>
        </div>
      )}

      {/* 콘텐츠 — 당기면 아래로 밀림 */}
      <div style={{
        transform: displayDistance > 30 ? `translateY(${displayDistance}px)` : "none",
        transition: pulling.current ? "none" : "transform 0.3s ease",
      }}>
        {children}
      </div>
    </>
  );
}
