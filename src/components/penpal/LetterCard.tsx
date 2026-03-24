"use client";

import { Mail, MailOpen } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { PenpalLetter } from "@/types";
import { cn } from "@/lib/utils";

/** LetterCard 컴포넌트 props */
interface LetterCardProps {
  letter: PenpalLetter;
  senderName: string; // 보낸 사람 닉네임
  onClick: () => void;
  isReceived: boolean; // 받은 편지 여부
}

/**
 * 편지 카드 — 편지함 목록에서 사용
 * 읽지 않은 편지는 봉투 아이콘이 흔들리는 애니메이션
 */
export default function LetterCard({
  letter,
  senderName,
  onClick,
  isReceived,
}: LetterCardProps) {
  const isUnread = isReceived && !letter.is_read;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full rounded-2xl p-4 flex items-center gap-3 text-left active:scale-[0.98] transition-all",
        isUnread
          ? "bg-gradient-to-r from-coral-50 via-white to-pink-soft/20 shadow-card border border-coral-100"
          : "bg-gradient-to-r from-cream to-white shadow-soft"
      )}
    >
      {/* 봉투 아이콘 */}
      <div
        className={cn(
          "w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0",
          isUnread ? "bg-coral-100" : "bg-cream-dark"
        )}
      >
        {isUnread ? (
          <Mail className="w-5 h-5 text-coral-400 animate-shake" />
        ) : (
          <MailOpen className="w-5 h-5 text-txt-tertiary" />
        )}
      </div>

      {/* 편지 정보 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-txt-primary truncate">
            {isReceived ? `${senderName}가 보낸 편지` : `${senderName}에게 보낸 편지`}
          </p>
          {/* 답장 뱃지 */}
          {letter.reply_to_id && (
            <span className="text-xs bg-cream-dark text-txt-tertiary px-1.5 py-0.5 rounded-full flex-shrink-0">↩</span>
          )}
          {/* 읽지 않은 편지 뱃지 */}
          {isUnread && (
            <span className="w-2 h-2 rounded-full bg-coral-400 flex-shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-xs text-txt-tertiary">
            {formatDate(letter.created_at.split("T")[0], "short")}{" "}
            {new Date(letter.created_at).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
          </p>
          {/* 보낸 편지의 읽음 표시 */}
          {!isReceived && (
            letter.is_read ? (
              <span className="text-[10px] text-blue-soft flex items-center gap-0.5">
                ✓ 읽음
                {letter.read_at && (
                  <span className="text-txt-tertiary">
                    · {new Date(letter.read_at).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                )}
              </span>
            ) : (
              <span className="text-[10px] text-txt-tertiary">전송됨</span>
            )
          )}
        </div>
        {/* 내용 미리보기 — 인용구 스타일 */}
        <p className="text-sm text-txt-secondary mt-1 truncate font-serif-ko italic">
          &ldquo;{letter.content}&rdquo;
        </p>
      </div>
    </button>
  );
}
