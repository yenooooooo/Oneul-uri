"use client";

import { calculateDday, formatDate } from "@/lib/utils";
import { Gift, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Anniversary } from "@/types";

/** AnniversaryCard 컴포넌트 props */
interface AnniversaryCardProps {
  anniversary: Anniversary;
  onDelete?: (id: string) => void;
  compact?: boolean; // 홈 대시보드용 간략 표시
}

/**
 * 기념일 카드 — D-day 표시 + 제목 + 날짜
 * compact 모드는 홈 대시보드에서 간략하게 표시
 */
export default function AnniversaryCard({
  anniversary,
  onDelete,
  compact = false,
}: AnniversaryCardProps) {
  const dday = calculateDday(anniversary.date);

  // D-day 텍스트 포맷팅
  const ddayText = dday === 0 ? "D-DAY" : dday > 0 ? `D+${dday}` : `D${dday}`;

  // D-day에 따른 강조 색상 (7일 이내면 코랄, 아니면 기본)
  const isNear = dday >= -7 && dday <= 0;

  if (compact) {
    return (
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <Gift className="w-4 h-4 text-coral-300" />
          <span className="text-sm text-txt-primary">{anniversary.title}</span>
        </div>
        <Badge
          variant="secondary"
          className={isNear ? "bg-coral-100 text-coral-500" : ""}
        >
          {ddayText}
        </Badge>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-soft flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* 아이콘 */}
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isNear ? "bg-coral-100" : "bg-cream-dark"
          }`}
        >
          <Gift className={`w-5 h-5 ${isNear ? "text-coral-400" : "text-txt-tertiary"}`} />
        </div>

        {/* 기념일 정보 */}
        <div>
          <p className="font-medium text-txt-primary">{anniversary.title}</p>
          <p className="text-xs text-txt-tertiary">
            {formatDate(anniversary.date, "long")}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* D-day 뱃지 */}
        <Badge
          variant="secondary"
          className={`text-sm font-semibold ${
            isNear ? "bg-coral-100 text-coral-500" : ""
          }`}
        >
          {ddayText}
        </Badge>

        {/* 삭제 버튼 (커스텀 기념일만) */}
        {onDelete && anniversary.type === "custom" && (
          <button
            onClick={() => onDelete(anniversary.id)}
            className="p-1 text-txt-tertiary hover:text-error"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
