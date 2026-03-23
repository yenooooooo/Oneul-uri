"use client";

import { cn } from "@/lib/utils";

/** Skeleton 컴포넌트 props */
interface SkeletonProps {
  className?: string;
}

/**
 * 스켈레톤 로딩 블록 — shimmer 애니메이션
 * 다양한 크기/모양으로 조합하여 페이지별 로딩 화면 구성
 */
export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-cream-dark rounded-xl animate-pulse",
        className
      )}
    />
  );
}

/** 원형 스켈레톤 (이모지/아바타용) */
export function SkeletonCircle({ className }: SkeletonProps) {
  return (
    <div className={cn("bg-cream-dark rounded-full animate-pulse", className)} />
  );
}
