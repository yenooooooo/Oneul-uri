"use client";

import Skeleton from "@/components/common/Skeleton";

/**
 * 캘린더 페이지 스켈레톤 — 캘린더 그리드 + 일정 뼈대
 */
export default function CalendarSkeleton() {
  return (
    <div className="px-4 pt-6 space-y-4">
      <Skeleton className="w-20 h-7" />

      {/* 캘린더 그리드 */}
      <div className="bg-white rounded-3xl p-4 shadow-soft">
        <div className="flex justify-between mb-4">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="w-24 h-6" />
          <Skeleton className="w-8 h-8 rounded-lg" />
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      </div>

      {/* 일정 목록 */}
      <div className="bg-white rounded-3xl p-4 shadow-soft space-y-2">
        <Skeleton className="w-32 h-4" />
        <Skeleton className="w-full h-12 rounded-xl" />
        <Skeleton className="w-full h-12 rounded-xl" />
      </div>
    </div>
  );
}
