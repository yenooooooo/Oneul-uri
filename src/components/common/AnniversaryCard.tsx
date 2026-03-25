"use client";

import { calculateAnniversaryDday } from "@/lib/utils";
import { Gift, Cake, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Anniversary } from "@/types";

/** AnniversaryCard 컴포넌트 props */
interface AnniversaryCardProps {
  anniversary: Anniversary;
  onDelete?: (id: string) => void;
  compact?: boolean; // 홈 대시보드용 간략 표시
}

/**
 * 기념일 카드 — D-day 표시 (반복 기념일 대응)
 * 생일: 🎂 N번째 생일 + 매년 M월 D일
 * 일반: 기존 날짜 표시
 */
export default function AnniversaryCard({
  anniversary,
  onDelete,
  compact = false,
}: AnniversaryCardProps) {
  // 반복 기념일은 다가오는 날짜 기준 D-day 계산
  const dday = calculateAnniversaryDday(anniversary.date, anniversary.is_recurring);

  // D-day 텍스트
  const ddayText = dday === 0 ? "D-DAY 🎉" : dday > 0 ? `D+${dday}` : `D${dday}`;

  // 7일 이내 강조
  const isNear = dday >= -7 && dday <= 0;

  // 생일이면 N번째 생일 계산
  const isBirthday = anniversary.type === "birthday";
  const birthdayAge = isBirthday
    ? new Date().getFullYear() - new Date(anniversary.date).getFullYear()
    : null;

  // 반복 기념일 날짜 표시 (매년 M월 D일)
  const origDate = new Date(anniversary.date);
  const recurringLabel = anniversary.is_recurring
    ? `매년 ${origDate.getMonth() + 1}월 ${origDate.getDate()}일`
    : null;

  // 아이콘 선택
  const IconComponent = isBirthday ? Cake : Gift;

  if (compact) {
    return (
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <IconComponent className="w-4 h-4 text-coral-300" />
          <span className="text-sm text-txt-primary font-serif-ko">{anniversary.title}</span>
          {isBirthday && birthdayAge && (
            <span className="text-xs text-txt-tertiary">({birthdayAge}번째)</span>
          )}
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
    <div className={`rounded-2xl p-4 flex items-center justify-between ${
      isNear ? "bg-coral-50" : "bg-surface-low"
    }`}>
      <div className="flex items-center gap-3">
        {/* 아이콘 */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          isNear ? "bg-coral-100" : "bg-surface-high"
        }`}>
          <IconComponent className={`w-5 h-5 ${isNear ? "text-coral-500" : "text-txt-tertiary"}`} />
        </div>

        {/* 기념일 정보 */}
        <div>
          <p className="font-medium text-txt-primary font-serif-ko">
            {anniversary.title}
            {isBirthday && birthdayAge ? ` (${birthdayAge}번째)` : ""}
          </p>
          <p className="text-xs text-txt-tertiary">
            {recurringLabel ?? `${origDate.getFullYear()}년 ${origDate.getMonth() + 1}월 ${origDate.getDate()}일`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge
          variant="secondary"
          className={`text-sm font-semibold ${isNear ? "bg-coral-100 text-coral-500" : ""}`}
        >
          {ddayText}
        </Badge>

        {onDelete && anniversary.type === "custom" && (
          <button onClick={() => onDelete(anniversary.id)}
            className="p-1 text-txt-tertiary hover:text-error">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
