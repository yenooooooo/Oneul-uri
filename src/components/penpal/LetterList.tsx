"use client";

import { Loader2, Mail } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { PenpalLetter } from "@/types";

interface MonthGroup {
  key: string;
  label: string; // "10월", "9월"
  letters: PenpalLetter[];
}

interface LetterListProps {
  letters: PenpalLetter[];
  senderName: string;
  isReceived: boolean;
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
  onLetterClick: (letter: PenpalLetter) => void;
}

function groupByMonth(letters: PenpalLetter[]): MonthGroup[] {
  const map = new Map<string, MonthGroup>();
  letters.forEach((l) => {
    const d = new Date(l.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!map.has(key)) {
      map.set(key, { key, label: `${d.getMonth() + 1}월`, letters: [] });
    }
    map.get(key)!.letters.push(l);
  });
  return Array.from(map.values());
}

/**
 * 편지 목록 — stitch(5) 스타일
 * 읽지 않은: 큰 코랄 카드 + 세리프 인용구
 * 읽은: 월별 그룹 + 작은 한 줄 카드
 */
export default function LetterList({
  letters, senderName, isReceived,
  hasMore, loadingMore, onLoadMore, onLetterClick,
}: LetterListProps) {
  if (letters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center w-full py-20">
        <Mail className="w-12 h-12 text-coral-200 mb-4" />
        <p className="text-txt-secondary font-medium">
          {isReceived ? "아직 받은 편지가 없어요" : "아직 보낸 편지가 없어요"}
        </p>
        <p className="text-sm text-txt-tertiary mt-1">소중한 마음을 편지로 전해보세요</p>
      </div>
    );
  }

  const unread = isReceived ? letters.filter((l) => !l.is_read) : [];
  const read = isReceived ? letters.filter((l) => l.is_read) : letters;
  const groups = groupByMonth(read);

  return (
    <div className="space-y-8">
      {/* 읽지 않은 편지 — 큰 코랄 카드 */}
      {unread.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-txt-tertiary">읽지 않은 소식</h3>
          {unread.map((letter) => (
            <button key={letter.id} onClick={() => onLetterClick(letter)}
              className="w-full bg-gradient-to-br from-coral-100 to-coral-50 rounded-3xl p-6 text-left active:scale-[0.98] transition-transform">
              {/* 세리프 인용구 — 편지 내용이 주인공 */}
              <p className="font-serif-ko text-lg text-coral-600 leading-relaxed line-clamp-3 mb-4">
                &ldquo;{letter.content}&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-coral-400 font-medium">{senderName}</span>
                <span className="text-[10px] text-coral-300">
                  {formatDate(letter.created_at.split("T")[0], "short")}{" "}
                  {new Date(letter.created_at).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </button>
          ))}
        </section>
      )}

      {/* 읽은 편지 — 월별 그룹 + 작은 카드 */}
      {groups.map((group) => (
        <section key={group.key} className="space-y-3">
          <h3 className="font-serif-ko text-2xl font-black text-txt-primary/30">
            {group.label}
          </h3>
          <div className="space-y-2">
            {group.letters.map((letter) => (
              <button key={letter.id} onClick={() => onLetterClick(letter)}
                className="w-full flex items-center gap-3 bg-surface-low rounded-xl px-4 py-3 text-left active:scale-[0.98] transition-transform">
                <p className="font-serif-ko text-sm text-txt-secondary italic flex-1 truncate">
                  &ldquo;{letter.content}&rdquo;
                </p>
                <span className="text-[10px] text-txt-tertiary flex-shrink-0">
                  {formatDate(letter.created_at.split("T")[0], "short")}
                </span>
              </button>
            ))}
          </div>
        </section>
      ))}

      {hasMore && (
        <button onClick={onLoadMore} disabled={loadingMore}
          className="w-full py-3 text-sm text-coral-500 font-medium">
          {loadingMore ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "이전 편지 더 보기"}
        </button>
      )}
    </div>
  );
}
