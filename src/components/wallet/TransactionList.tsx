"use client";

import { useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowDownCircle, ArrowUpCircle, MoreVertical, Pencil, Trash2 } from "lucide-react";
import type { WalletTransaction } from "@/types/wallet";
import type { Couple } from "@/types";
import TransactionEditForm from "@/components/wallet/TransactionEditForm";

/** TransactionList 컴포넌트 props */
interface TransactionListProps {
  transactions: WalletTransaction[];
  couple: Couple | null;
  onUpdate: (txId: string, goalId: string, amount: number, memo?: string) => Promise<boolean>;
  onDelete: (txId: string, goalId: string) => Promise<boolean>;
}

/**
 * 입출금 내역 리스트 — 수정/삭제 지원
 * 각 항목 우측 ··· 버튼으로 수정/삭제 메뉴 토글
 */
export default function TransactionList({
  transactions, couple, onUpdate, onDelete,
}: TransactionListProps) {
  const [menuOpen, setMenuOpen] = useState<string | null>(null); // 열린 메뉴 ID
  const [editTx, setEditTx] = useState<WalletTransaction | null>(null); // 수정 중인 거래

  if (transactions.length === 0) {
    return (
      <p className="text-sm text-txt-tertiary text-center py-6">
        아직 내역이 없어요
      </p>
    );
  }

  /** user_id → 닉네임 변환 */
  const getNickname = (userId: string): string => {
    if (!couple) return "";
    if (userId === couple.user1_id) return couple.user1_nickname;
    if (userId === couple.user2_id) return couple.user2_nickname;
    return "";
  };

  /** 삭제 확인 후 실행 */
  const handleDelete = async (tx: WalletTransaction) => {
    setMenuOpen(null);
    await onDelete(tx.id, tx.goal_id);
  };

  return (
    <>
      <div className="space-y-1">
        {transactions.map((tx) => {
          const isDeposit = tx.amount > 0;
          const nickname = getNickname(tx.user_id);

          return (
            <div key={tx.id} className="flex items-center gap-3 py-2.5 border-b border-cream-dark last:border-0 relative">
              {/* 입금/출금 아이콘 */}
              {isDeposit ? (
                <ArrowDownCircle className="w-5 h-5 text-green-soft flex-shrink-0" />
              ) : (
                <ArrowUpCircle className="w-5 h-5 text-error flex-shrink-0" />
              )}

              {/* 메모 + 날짜 + 입금자 */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-txt-primary truncate">
                  {tx.memo || (isDeposit ? "입금" : "출금")}
                </p>
                <div className="flex items-center gap-2 text-xs text-txt-tertiary">
                  <span>
                    {formatDate(tx.created_at.split("T")[0], "short")}{" "}
                    {new Date(tx.created_at).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  {nickname && <span>· {nickname}</span>}
                </div>
              </div>

              {/* 금액 */}
              <p className={`text-sm font-semibold ${isDeposit ? "text-green-soft" : "text-error"}`}>
                {isDeposit ? "+" : ""}{formatCurrency(tx.amount)}
              </p>

              {/* ··· 메뉴 버튼 */}
              <button
                onClick={() => setMenuOpen(menuOpen === tx.id ? null : tx.id)}
                className="p-1 text-txt-tertiary"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {/* 드롭다운 메뉴 */}
              {menuOpen === tx.id && (
                <div className="absolute right-0 top-10 bg-white rounded-xl shadow-card border border-cream-dark z-10 py-1 min-w-[100px]">
                  <button
                    onClick={() => { setMenuOpen(null); setEditTx(tx); }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-txt-primary hover:bg-cream w-full"
                  >
                    <Pencil className="w-3.5 h-3.5" /> 수정
                  </button>
                  <button
                    onClick={() => handleDelete(tx)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-error hover:bg-cream w-full"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> 삭제
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 수정 모달 */}
      {editTx && (
        <TransactionEditForm
          transaction={editTx}
          onSubmit={async (amount, memo) => {
            const ok = await onUpdate(editTx.id, editTx.goal_id, amount, memo);
            if (ok) setEditTx(null);
          }}
          onClose={() => setEditTx(null)}
        />
      )}
    </>
  );
}
