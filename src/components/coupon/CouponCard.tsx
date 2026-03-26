"use client";

import { useState } from "react";
import { formatDate } from "@/lib/utils";
import { MoreVertical, Trash2 } from "lucide-react";
import type { CouponWithType } from "@/types/coupon";
import type { Couple as CoupleType } from "@/types";

interface CouponCardProps {
  coupon: CouponWithType;
  couple: CoupleType | null;
  isMine: boolean;
  onUse?: () => void;
  onDelete?: () => void;
}

/**
 * 쿠폰 카드 — 티켓 느낌 + 삭제 메뉴
 */
export default function CouponCard({ coupon, couple, isMine, onUse, onDelete }: CouponCardProps) {
  const ct = coupon.coupon_type;
  const isUsed = coupon.status === "used";
  const [menuOpen, setMenuOpen] = useState(false);

  const winnerName = couple
    ? coupon.winner_id === couple.user1_id ? couple.user1_nickname : couple.user2_nickname
    : "";

  return (
    <div className={`relative rounded-3xl overflow-hidden ${isUsed ? "opacity-50" : ""}`}>
      <div className="flex">
        {/* 좌측 이모지 */}
        <div className={`w-20 flex-shrink-0 flex items-center justify-center ${
          isUsed ? "bg-surface-high" : "bg-gradient-to-b from-coral-100 to-coral-50"
        }`}>
          <span className="text-3xl">{ct.emoji}</span>
        </div>

        <div className="w-px border-l border-dashed border-coral-200 my-3" />

        {/* 우측 정보 */}
        <div className="flex-1 bg-white p-4 relative">
          {/* ⋮ 메뉴 */}
          {onDelete && !isUsed && (
            <div className="absolute top-2 right-2">
              <button onClick={() => setMenuOpen(!menuOpen)} className="p-1 text-txt-tertiary">
                <MoreVertical className="w-4 h-4" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-7 bg-white rounded-xl shadow-card border border-surface-high z-10 py-1 min-w-[80px]">
                  <button onClick={() => { setMenuOpen(false); onDelete(); }}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs text-error w-full">
                    <Trash2 className="w-3 h-3" /> 삭제
                  </button>
                </div>
              )}
            </div>
          )}

          <p className="font-serif-ko font-bold text-txt-primary pr-6">{ct.title}</p>
          {ct.description && (
            <p className="text-xs text-txt-tertiary mt-0.5">{ct.description}</p>
          )}
          {coupon.bet_memo && (
            <p className="text-xs text-coral-500 mt-1.5 italic">
              &ldquo;{coupon.bet_memo}&rdquo;
            </p>
          )}
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-txt-tertiary">
              {winnerName} · {formatDate(coupon.created_at.split("T")[0], "short")}
            </span>
            {isUsed ? (
              <span className="text-[10px] text-txt-tertiary">
                사용완료 {coupon.used_at ? formatDate(coupon.used_at.split("T")[0], "short") : ""}
              </span>
            ) : isMine && onUse ? (
              <button onClick={onUse}
                className="text-xs bg-coral-500 text-white px-3 py-1 rounded-full font-medium active:scale-95 transition-transform">
                사용하기
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* 티켓 반원 구멍 */}
      <div className="absolute left-[76px] top-0 w-4 h-2 bg-surface rounded-b-full" />
      <div className="absolute left-[76px] bottom-0 w-4 h-2 bg-surface rounded-t-full" />
    </div>
  );
}
