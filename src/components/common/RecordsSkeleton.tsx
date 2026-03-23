"use client";

import Skeleton from "@/components/common/Skeleton";

/**
 * 기록 페이지 스켈레톤 — 요약 + 카드 뼈대
 */
export default function RecordsSkeleton() {
  return (
    <div className="px-4 pt-6 space-y-4">
      {/* 상단 요약 */}
      <div className="bg-white rounded-2xl p-5 shadow-soft space-y-3">
        <Skeleton className="w-24 h-5" />
        <Skeleton className="w-48 h-7" />
        <Skeleton className="w-full h-2" />
      </div>

      {/* 월 헤더 */}
      <div className="flex items-center gap-2">
        <Skeleton className="w-20 h-4" />
        <div className="flex-1 h-px bg-cream-dark" />
      </div>

      {/* 기록 카드 */}
      <Skeleton className="w-full h-48 rounded-2xl" />
      <Skeleton className="w-full h-48 rounded-2xl" />

      {/* 미니 카드 묶음 */}
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <Skeleton className="w-full h-12" />
        <Skeleton className="w-full h-12" />
      </div>
    </div>
  );
}
