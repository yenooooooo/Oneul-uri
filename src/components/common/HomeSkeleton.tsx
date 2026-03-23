"use client";

import Skeleton, { SkeletonCircle } from "@/components/common/Skeleton";

/**
 * 홈 페이지 스켈레톤 — 프로필 + D-day + 기념일 + 기록 뼈대
 */
export default function HomeSkeleton() {
  return (
    <div className="px-4 pt-6 space-y-4">
      {/* 프로필 카드 */}
      <div className="flex items-center justify-center gap-4 py-2">
        <div className="flex flex-col items-center gap-1.5">
          <SkeletonCircle className="w-12 h-12" />
          <Skeleton className="w-12 h-3" />
        </div>
        <Skeleton className="w-6 h-6 rounded-full" />
        <div className="flex flex-col items-center gap-1.5">
          <SkeletonCircle className="w-12 h-12" />
          <Skeleton className="w-12 h-3" />
        </div>
      </div>

      {/* D-day 카드 */}
      <div className="bg-white rounded-3xl p-6 shadow-soft flex flex-col items-center gap-3">
        <SkeletonCircle className="w-6 h-6" />
        <Skeleton className="w-32 h-10" />
        <Skeleton className="w-48 h-4" />
        <Skeleton className="w-28 h-3" />
      </div>

      {/* 기념일 섹션 */}
      <div className="bg-white rounded-3xl p-5 shadow-soft space-y-3">
        <Skeleton className="w-28 h-5" />
        <Skeleton className="w-full h-8" />
        <Skeleton className="w-full h-8" />
      </div>

      {/* 최근 기록 섹션 */}
      <div className="bg-white rounded-3xl p-5 shadow-soft space-y-3">
        <Skeleton className="w-24 h-5" />
        <div className="flex gap-3">
          <Skeleton className="w-32 h-24 rounded-xl" />
          <Skeleton className="w-32 h-24 rounded-xl" />
          <Skeleton className="w-32 h-24 rounded-xl" />
        </div>
      </div>

      {/* 통장 + 룰렛 */}
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="h-28 rounded-2xl" />
      </div>
    </div>
  );
}
