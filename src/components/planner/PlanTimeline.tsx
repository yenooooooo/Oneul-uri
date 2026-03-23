"use client";

import PlanItemCard from "@/components/planner/PlanItemCard";
import { ClipboardList } from "lucide-react";
import type { DatePlanItem } from "@/types/planner";

/** PlanTimeline 컴포넌트 props */
interface PlanTimelineProps {
  items: DatePlanItem[];
  onEdit: (item: DatePlanItem) => void;
  onDelete: (itemId: string) => void;
}

/**
 * 타임라인 뷰 — 시간순 아이템 나열 + 시간 미정 분리
 */
export default function PlanTimeline({ items, onEdit, onDelete }: PlanTimelineProps) {
  // 시간 있는 항목 (시간순 정렬) + 시간 미정 항목 분리
  const timed = items
    .filter((i) => i.time)
    .sort((a, b) => (a.time ?? "").localeCompare(b.time ?? ""));
  const untimed = items.filter((i) => !i.time);

  if (items.length === 0) {
    return (
      <div className="text-center py-10">
        <ClipboardList className="w-12 h-12 text-coral-200 mx-auto mb-3" />
        <p className="text-txt-secondary font-medium">아직 일정이 없어요</p>
        <p className="text-sm text-txt-tertiary mt-1">
          아래 버튼으로 일정을 추가해보세요
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* 시간 있는 항목 */}
      {timed.map((item) => (
        <PlanItemCard
          key={item.id}
          item={item}
          onEdit={() => onEdit(item)}
          onDelete={() => onDelete(item.id)}
        />
      ))}

      {/* 시간 미정 항목 */}
      {untimed.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium text-txt-tertiary mb-2 ml-1">
            시간 미정
          </p>
          {untimed.map((item) => (
            <PlanItemCard
              key={item.id}
              item={item}
              onEdit={() => onEdit(item)}
              onDelete={() => onDelete(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
