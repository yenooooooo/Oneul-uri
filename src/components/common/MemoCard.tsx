"use client";

import Link from "next/link";
import { Pin } from "lucide-react";
import { MEMO_CATEGORIES, MEMO_COLORS } from "@/types/memo";
import type { CoupleMemo } from "@/types/memo";
import type { Couple as CoupleType } from "@/types";

/** MemoCard 컴포넌트 props */
interface MemoCardProps {
  memo: CoupleMemo;
  couple: CoupleType | null; // 작성자 이모지 표시용
}

/**
 * 메모 카드 — 목록에서 사용
 * 카테고리 이모지 + 제목 + 작성자 + 핀 표시
 */
export default function MemoCard({ memo, couple }: MemoCardProps) {
  const cat = MEMO_CATEGORIES[memo.category];
  const bgClass = MEMO_COLORS[memo.color] ?? MEMO_COLORS.default;

  /** 작성자 이모지 */
  const authorEmoji = couple
    ? memo.author_id === couple.user1_id ? couple.user1_emoji : couple.user2_emoji
    : "💬";

  return (
    <Link href={`/memos/${memo.id}`}>
      <div className={`${bgClass} rounded-2xl p-4 shadow-soft active:scale-[0.98] transition-transform`}>
        <div className="flex items-start justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">{cat.emoji}</span>
            <span className="text-xs text-txt-tertiary">{cat.label}</span>
          </div>
          <div className="flex items-center gap-1">
            {memo.is_pinned && <Pin className="w-3 h-3 text-coral-400" />}
            <span className="text-sm">{authorEmoji}</span>
          </div>
        </div>
        <p className="font-medium text-txt-primary truncate">{memo.title}</p>
      </div>
    </Link>
  );
}
