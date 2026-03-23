"use client";

import { PLAN_CATEGORIES } from "@/types/planner";
import type { PlanCategory } from "@/types/planner";
import { cn } from "@/lib/utils";

/** CategoryTag 컴포넌트 props */
interface CategoryTagProps {
  category: PlanCategory;
  size?: "sm" | "md"; // 표시 크기
}

/**
 * 카테고리 태그 뱃지 — 이모지 + 라벨 + 컬러 배경
 */
export default function CategoryTag({ category, size = "sm" }: CategoryTagProps) {
  const cat = PLAN_CATEGORIES[category];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full font-medium",
        cat.color,
        size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1"
      )}
    >
      {cat.emoji} {cat.label}
    </span>
  );
}
