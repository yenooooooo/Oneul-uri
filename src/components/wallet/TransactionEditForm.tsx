"use client";

import { useState } from "react";
import { useLockScroll } from "@/hooks/useLockScroll";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Loader2 } from "lucide-react";
import type { WalletTransaction } from "@/types/wallet";

/** TransactionEditForm 컴포넌트 props */
interface TransactionEditFormProps {
  transaction: WalletTransaction;
  onSubmit: (amount: number, memo?: string) => Promise<void>;
  onClose: () => void;
}

/**
 * 거래 내역 수정 모달 — 금액 + 메모 수정
 */
export default function TransactionEditForm({
  transaction, onSubmit, onClose,
}: TransactionEditFormProps) {
  useLockScroll();
  const [amount, setAmount] = useState(String(transaction.amount)); // 금액
  const [memo, setMemo] = useState(transaction.memo ?? ""); // 메모
  const [loading, setLoading] = useState(false); // 로딩

  /** 폼 제출 */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseInt(amount, 10);
    if (isNaN(numAmount) || numAmount === 0) return;

    setLoading(true);
    await onSubmit(numAmount, memo || undefined);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-txt-primary">내역 수정</h3>
          <button onClick={onClose} className="p-1 text-txt-tertiary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 금액 */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-amount">금액 (원)</Label>
            <Input
              id="edit-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="rounded-xl text-lg"
            />
          </div>

          {/* 메모 */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-memo">메모</Label>
            <Input
              id="edit-memo"
              placeholder="메모를 입력하세요"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <Button
            type="submit"
            disabled={loading || !amount}
            className="w-full rounded-full bg-coral-500 hover:bg-coral-600 text-white"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "수정하기"}
          </Button>
        </form>
      </div>
    </div>
  );
}
