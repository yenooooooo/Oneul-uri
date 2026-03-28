"use client";

import { useState } from "react";
import { useLockScroll } from "@/hooks/useLockScroll";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import FormInput from "@/components/common/FormInput";

/** DepositForm 컴포넌트 props */
interface DepositFormProps {
  goalId: string;
  onSubmit: (goalId: string, amount: number, memo?: string) => Promise<boolean | null>;
  onClose: () => void;
}

/**
 * 입금/출금 폼 모달
 * 금액 + 메모 입력
 */
export default function DepositForm({ goalId, onSubmit, onClose }: DepositFormProps) {
  useLockScroll();
  const [amount, setAmount] = useState(""); // 금액 입력값
  const [memo, setMemo] = useState(""); // 메모
  const [loading, setLoading] = useState(false); // 로딩

  /** 폼 제출 */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseInt(amount, 10);
    if (isNaN(numAmount) || numAmount === 0) return;

    setLoading(true);
    await onSubmit(goalId, numAmount, memo || undefined);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-txt-primary">입금하기</h3>
          <button onClick={onClose} className="p-1 text-txt-tertiary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 금액 */}
          <FormInput
            id="deposit-amount"
            label="금액 (원)"
            type="number"
            placeholder="10000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min={1}
            className="text-lg"
          />

          {/* 메모 */}
          <FormInput
            id="deposit-memo"
            label="메모 (선택)"
            placeholder="3월 월급에서 5만원"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />

          <Button
            type="submit"
            disabled={loading || !amount}
            className="w-full rounded-full bg-coral-500 hover:bg-coral-600 text-white"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "입금하기"}
          </Button>
        </form>
      </div>
    </div>
  );
}
