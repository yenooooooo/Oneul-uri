"use client";

import { useState } from "react";
import type { RouletteItem } from "@/hooks/useRoulette";

/** RouletteWheel 컴포넌트 props */
interface RouletteWheelProps {
  items: RouletteItem[];
  onResult: (result: string) => void;
}

/** 룰렛 항목별 색상 (8가지 순환) */
const COLORS = [
  "#FF6B6B", "#FFD66B", "#7EC8A0", "#7EB8E0",
  "#F5A0B8", "#E85555", "#FFB0B0", "#CC4444",
];

/**
 * 룰렛 휠 컴포넌트 — CSS 회전 애니메이션 기반
 * 돌리기 버튼 클릭 → 랜덤 각도로 회전 → 결과 반환
 */
export default function RouletteWheel({ items, onResult }: RouletteWheelProps) {
  const [rotation, setRotation] = useState(0); // 현재 회전 각도
  const [spinning, setSpinning] = useState(false); // 회전 중 여부

  // 항목이 없으면 안내 표시
  if (items.length === 0) {
    return (
      <p className="text-sm text-txt-tertiary text-center py-8">
        항목을 추가해주세요
      </p>
    );
  }

  // 각 항목이 차지하는 각도
  const sliceAngle = 360 / items.length;

  /** 룰렛 돌리기 */
  const handleSpin = () => {
    if (spinning) return;

    setSpinning(true);

    // 5~8바퀴 + 랜덤 각도
    const extraSpins = (5 + Math.floor(Math.random() * 3)) * 360;
    const randomAngle = Math.floor(Math.random() * 360);
    const totalRotation = rotation + extraSpins + randomAngle;

    setRotation(totalRotation);

    // 3초 후 결과 계산
    setTimeout(() => {
      // 최종 멈춘 각도에서 어떤 항목이 선택되었는지 계산
      // 포인터가 상단(0도)에 있으므로, 360 - (totalRotation % 360)으로 계산
      const finalAngle = totalRotation % 360;
      const normalizedAngle = (360 - finalAngle + sliceAngle / 2) % 360;
      const selectedIndex = Math.floor(normalizedAngle / sliceAngle) % items.length;

      onResult(items[selectedIndex].label);
      setSpinning(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* 포인터 (상단 삼각형) */}
      <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-coral-400 -mb-2 z-10" />

      {/* 룰렛 휠 */}
      <div
        className="w-64 h-64 rounded-full relative shadow-float overflow-hidden"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: spinning ? "transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
        }}
      >
        {items.map((item, index) => {
          const startAngle = index * sliceAngle;
          const color = COLORS[index % COLORS.length];

          return (
            <div
              key={item.id}
              className="absolute w-full h-full"
              style={{
                transform: `rotate(${startAngle}deg)`,
              }}
            >
              {/* 부채꼴 — clip-path로 표현 */}
              <div
                className="absolute top-0 left-1/2 origin-bottom h-1/2 w-1/2"
                style={{
                  transform: `rotate(${-sliceAngle / 2}deg)`,
                  clipPath: `polygon(0 0, 100% 0, 50% 100%)`,
                  backgroundColor: color,
                  width: "100%",
                  left: "0",
                  transformOrigin: "50% 100%",
                }}
              />
              {/* 항목 텍스트 */}
              <div
                className="absolute text-white text-xs font-medium"
                style={{
                  top: "18%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                  maxWidth: "60px",
                  textAlign: "center",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {item.label}
              </div>
            </div>
          );
        })}

        {/* 중앙 원 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-md z-10" />
      </div>

      {/* 돌리기 버튼 */}
      <button
        onClick={handleSpin}
        disabled={spinning}
        className="bg-coral-400 text-white rounded-full px-8 py-3 text-lg font-bold shadow-card active:scale-95 transition-transform disabled:opacity-60"
      >
        {spinning ? "돌리는 중..." : "돌리기!"}
      </button>
    </div>
  );
}
