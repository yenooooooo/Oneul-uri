"use client";

import LetterCard from "@/components/penpal/LetterCard";
import { Loader2, Mail } from "lucide-react";
import type { PenpalLetter } from "@/types";

/** 월별 그룹 */
interface MonthGroup {
  key: string;
  label: string;
  letters: PenpalLetter[];
}

/** LetterList 컴포넌트 props */
interface LetterListProps {
  letters: PenpalLetter[];
  senderName: string;
  isReceived: boolean;
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
  onLetterClick: (letter: PenpalLetter) => void;
}

/** 편지를 월별로 그룹핑한다 */
function groupByMonth(letters: PenpalLetter[]): MonthGroup[] {
  const map = new Map<string, MonthGroup>();
  letters.forEach((l) => {
    const d = new Date(l.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!map.has(key)) {
      map.set(key, {
        key,
        label: `${d.getFullYear()}년 ${d.getMonth() + 1}월`,
        letters: [],
      });
    }
    map.get(key)!.letters.push(l);
  });
  return Array.from(map.values());
}

/**
 * 편지 목록 — 읽지 않은 편지 상단 고정 + 월별 그룹핑 + 무한 스크롤
 */
export default function LetterList({
  letters, senderName, isReceived,
  hasMore, loadingMore, onLoadMore, onLetterClick,
}: LetterListProps) {
  if (letters.length === 0) {
    return (
      <div className="text-center py-12">
        <Mail className="w-12 h-12 text-coral-200 mx-auto mb-3" />
        <p className="text-txt-secondary font-medium">
          {isReceived ? "아직 받은 편지가 없어요" : "아직 보낸 편지가 없어요"}
        </p>
        <p className="text-sm text-txt-tertiary mt-1">
          소중한 마음을 편지로 전해보세요
        </p>
      </div>
    );
  }

  // 받은 편지: 읽지 않은 것 먼저, 그 외 월별 그룹핑
  const unread = isReceived ? letters.filter((l) => !l.is_read) : [];
  const read = isReceived ? letters.filter((l) => l.is_read) : letters;
  const groups = groupByMonth(read);

  return (
    <div className="space-y-4">
      {/* 읽지 않은 편지 — 상단 고정 */}
      {unread.length > 0 && (
        <section>
          <p className="text-xs font-semibold text-coral-400 mb-2">
            새 편지 {unread.length}통
          </p>
          <div className="space-y-2">
            {unread.map((letter) => (
              <LetterCard
                key={letter.id} letter={letter}
                senderName={senderName} isReceived
                onClick={() => onLetterClick(letter)}
              />
            ))}
          </div>
        </section>
      )}

      {/* 월별 그룹핑 */}
      {groups.map((group) => (
        <section key={group.key}>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xs font-semibold text-txt-tertiary">{group.label}</h3>
            <div className="flex-1 h-px bg-coral-100" />
          </div>
          <div className="space-y-2">
            {group.letters.map((letter) => (
              <LetterCard
                key={letter.id} letter={letter}
                senderName={senderName} isReceived={isReceived}
                onClick={() => onLetterClick(letter)}
              />
            ))}
          </div>
        </section>
      ))}

      {/* 더 보기 */}
      {hasMore && (
        <button
          onClick={onLoadMore}
          disabled={loadingMore}
          className="w-full py-3 text-sm text-coral-400 font-medium"
        >
          {loadingMore ? (
            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
          ) : (
            "이전 편지 더 보기"
          )}
        </button>
      )}
    </div>
  );
}
