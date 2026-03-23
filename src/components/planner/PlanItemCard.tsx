"use client";

import { ExternalLink, Trash2, Pencil } from "lucide-react";
import CategoryTag from "@/components/planner/CategoryTag";
import type { DatePlanItem } from "@/types/planner";

/** PlanItemCard 컴포넌트 props */
interface PlanItemCardProps {
  item: DatePlanItem;
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * 플래너 아이템 카드 — 타임라인 내 개별 일정 항목
 * 시간 + 카테고리 태그 + 제목 + 메모 + 링크
 */
export default function PlanItemCard({ item, onEdit, onDelete }: PlanItemCardProps) {
  return (
    <div className="flex gap-3">
      {/* 타임라인 도트 + 시간 */}
      <div className="flex flex-col items-center w-14 flex-shrink-0">
        <div className="w-3 h-3 rounded-full bg-coral-400 border-2 border-white shadow-sm" />
        <div className="w-0.5 flex-1 bg-coral-100" />
        <p className="text-xs font-medium text-coral-400 mt-1">
          {item.time ?? ""}
        </p>
      </div>

      {/* 카드 본체 */}
      <div className="flex-1 bg-white rounded-2xl p-3.5 shadow-soft mb-3">
        {/* 상단: 카테고리 + 액션 버튼 */}
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <CategoryTag category={item.category} />
            {item.is_from_roulette && (
              <span className="text-xs bg-yellow-warm/20 text-yellow-warm px-1.5 py-0.5 rounded-full">
                🎰
              </span>
            )}
          </div>
          <div className="flex gap-1">
            <button onClick={onEdit} className="p-1 text-txt-tertiary">
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button onClick={onDelete} className="p-1 text-txt-tertiary hover:text-error">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 제목 */}
        <p className="font-semibold text-sm text-txt-primary">{item.title}</p>

        {/* 메모 */}
        {item.memo && (
          <p className="text-xs text-txt-secondary mt-1">{item.memo}</p>
        )}

        {/* 링크 */}
        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-blue-soft mt-1.5"
          >
            <ExternalLink className="w-3 h-3" />
            링크 열기
          </a>
        )}
      </div>
    </div>
  );
}
