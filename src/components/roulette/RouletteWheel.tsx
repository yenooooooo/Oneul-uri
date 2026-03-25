"use client";

import { useMemo, useState } from "react";
import type { RouletteItem } from "@/hooks/useRoulette";

/** RouletteWheel 컴포넌트 props */
interface RouletteWheelProps {
  items: RouletteItem[];
  onResult: (result: string) => void;
}

/** 룰렛 항목별 색상 (10가지 순환) */
const COLORS = [
  "#FF6B6B", "#FFD66B", "#7EC8A0", "#7EB8E0", "#F5A0B8",
  "#E85555", "#FFB0B0", "#CC4444", "#A8D8EA", "#FFC3A0",
];

/**
 * 룰렛 휠 컴포넌트 — conic-gradient 기반 정확한 부채꼴
 * 돌리기 버튼 클릭 → 랜덤 각도 회전 → 포인터 위치의 항목 반환
 */
export default function RouletteWheel({ items, onResult }: RouletteWheelProps) {
  const [rotation, setRotation] = useState(0); // 누적 회전 각도
  const [spinning, setSpinning] = useState(false); // 회전 중

  const sliceAngle = items.length > 0 ? 360 / items.length : 360;

  /** conic-gradient 문자열 생성 — 정확한 부채꼴 */
  const gradient = useMemo(() => {
    if (items.length === 0) return "conic-gradient(#f0e8e0 0deg 360deg)";
    const stops = items.map((_, i) => {
      const color = COLORS[i % COLORS.length];
      const from = (i * sliceAngle).toFixed(2);
      const to = ((i + 1) * sliceAngle).toFixed(2);
      return `${color} ${from}deg ${to}deg`;
    });
    return `conic-gradient(from 0deg, ${stops.join(", ")})`;
  }, [items, sliceAngle]);

  // 항목 없으면 안내 표시
  if (items.length === 0) {
    return (
      <p className="text-sm text-txt-tertiary text-center py-8">
        항목을 추가해주세요
      </p>
    );
  }

  /** 돌리기 — 5~8바퀴 + 랜덤 각도 */
  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);

    const extraSpins = (5 + Math.floor(Math.random() * 3)) * 360;
    const randomAngle = Math.floor(Math.random() * 360);
    const totalRotation = rotation + extraSpins + randomAngle;
    setRotation(totalRotation);

    // 3초 후 결과 계산
    setTimeout(() => {
      // 포인터가 상단(12시 방향)에 있음
      // 휠이 시계방향으로 회전하므로, 멈춘 각도에서 포인터가 가리키는 슬라이스 계산
      const finalAngle = ((360 - (totalRotation % 360)) + 360) % 360;
      const selectedIndex = Math.floor(finalAngle / sliceAngle) % items.length;

      onResult(items[selectedIndex].label);
      setSpinning(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center gap-5">
      {/* 포인터 (상단 삼각형) */}
      <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[18px] border-l-transparent border-r-transparent border-t-coral-400 -mb-3 z-10" />

      {/* 룰렛 휠 */}
      <div
        className="w-64 h-64 rounded-full relative shadow-float"
        style={{
          background: gradient,
          transform: `rotate(${rotation}deg)`,
          transition: spinning
            ? "transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
            : "none",
        }}
      >
        {/* 각 슬라이스 텍스트 라벨 */}
        {items.map((item, i) => {
          // 슬라이스 중앙 각도 (12시 방향 = 0도 기준)
          const midAngle = i * sliceAngle + sliceAngle / 2;
          // 중심에서 바깥쪽으로 65% 지점에 텍스트 배치
          const rad = (midAngle * Math.PI) / 180;
          const radius = 38; // %
          const x = 50 + radius * Math.sin(rad);
          const y = 50 - radius * Math.cos(rad);

          return (
            <div
              key={item.id}
              className="absolute text-white text-[11px] font-bold"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: `translate(-50%, -50%) rotate(${midAngle}deg)`,
                textShadow: "0 1px 3px rgba(0,0,0,0.4)",
                maxWidth: "55px",
                textAlign: "center",
                lineHeight: "1.1",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {item.label}
            </div>
          );
        })}

        {/* 중앙 원 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md z-10 flex items-center justify-center">
          <span className="text-xs font-bold text-coral-400">GO</span>
        </div>
      </div>

      {/* 돌리기 버튼 */}
      <button
        onClick={handleSpin}
        disabled={spinning}
        className="bg-coral-500 text-white rounded-full px-8 py-3 text-lg font-bold shadow-card active:scale-95 transition-transform disabled:opacity-60"
      >
        {spinning ? "돌리는 중..." : "돌리기!"}
      </button>
    </div>
  );
}
