"use client";

import { cn } from "@/lib/utils";

/** Skeleton 컴포넌트 props */
interface SkeletonProps {
  className?: string;
}

/**
 * 스켈레톤 로딩 블록 — shimmer 애니메이션
 */
export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("bg-surface-high rounded-xl animate-pulse", className)} />
  );
}

/** 원형 스켈레톤 (이모지/아바타용) */
export function SkeletonCircle({ className }: SkeletonProps) {
  return (
    <div className={cn("bg-surface-high rounded-full animate-pulse", className)} />
  );
}
