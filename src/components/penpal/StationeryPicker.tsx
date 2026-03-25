"use client";

import { STATIONERY_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { StationeryType } from "@/types";

/** StationeryPicker 컴포넌트 props */
interface StationeryPickerProps {
  value: StationeryType;
  onChange: (value: StationeryType) => void;
}

/** 편지지 미리보기 색상 */
const STATIONERY_COLORS: Record<string, string> = {
  default: "bg-[#FFFDF7] border-yellow-warm/30",
  flower: "bg-[#FFF5F5] border-pink-soft/30",
  star: "bg-[#F5F5FF] border-blue-soft/30",
  lined: "bg-white border-gray-200",
  craft: "bg-[#F5EDE0] border-yellow-warm/40",
};

/**
 * 편지지 선택 컴포넌트 — 5종 편지지 배경 선택
 * 가로 스크롤로 미리보기 원형 버튼 표시
 */
export default function StationeryPicker({ value, onChange }: StationeryPickerProps) {
  return (
    <div className="flex gap-5 overflow-x-auto scrollbar-hide py-3 px-3">
      {STATIONERY_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value as StationeryType)}
          className={cn(
            "flex flex-col items-center gap-2.5 flex-shrink-0"
          )}
        >
          {/* 편지지 미리보기 원 */}
          <div
            className={cn(
              "w-12 h-12 rounded-full border-2 transition-all",
              STATIONERY_COLORS[option.value],
              value === option.value
                ? "ring-2 ring-coral-400 ring-offset-2 scale-110"
                : ""
            )}
          />
          <span
            className={cn(
              "text-xs",
              value === option.value ? "text-coral-400 font-medium" : "text-txt-tertiary"
            )}
          >
            {option.label}
          </span>
        </button>
      ))}
    </div>
  );
}
