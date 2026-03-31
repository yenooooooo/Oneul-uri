"use client";

import { useState } from "react";
import { useLockScroll } from "@/hooks/useLockScroll";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import FormInput from "@/components/common/FormInput";
import FormDatePicker from "@/components/common/FormDatePicker";
import type { CreateWalletGoal } from "@/types/wallet";

/** GoalCreateForm 컴포넌트 props */
interface GoalCreateFormProps {
  onSubmit: (input: CreateWalletGoal) => Promise<boolean>;
  onClose: () => void;
}

/**
 * 저축 목표 생성 모달 — 목표명 + 목표 금액 + 목표 기간(선택)
 */
export default function GoalCreateForm({ onSubmit, onClose }: GoalCreateFormProps) {
  useLockScroll();
  const [title, setTitle] = useState(""); // 목표명
  const [targetAmount, setTargetAmount] = useState(""); // 목표 금액
  const [targetDate, setTargetDate] = useState(""); // 목표 달성 날짜 (선택)
  const [loading, setLoading] = useState(false); // 로딩

  /** 폼 제출 */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(targetAmount, 10);
    if (isNaN(amount) || amount <= 0) return;

    setLoading(true);
    const success = await onSubmit({
      title,
      target_amount: amount,
      target_date: targetDate || undefined,
    });
    if (success) onClose();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-txt-primary">새 목표</h3>
          <button onClick={onClose} className="p-1 text-txt-tertiary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput id="goal-title" label="목표 이름" placeholder="예: 제주도 여행"
            value={title} onChange={(e) => setTitle(e.target.value)}
            required />

          <FormInput id="goal-amount" label="목표 금액 (원)" type="number" placeholder="500000"
            value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)}
            required min={1} className="text-lg" />

          {/* 목표 달성 희망 날짜 (선택) */}
          <div>
            <FormDatePicker id="goal-date" label="목표 달성 날짜 (선택)"
              value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
            <p className="text-xs text-txt-tertiary mt-1">
              설정하면 페이스 분석을 볼 수 있어요
            </p>
          </div>

          <Button type="submit" disabled={loading || !title || !targetAmount}
            className="w-full rounded-full bg-coral-500 hover:bg-coral-600 text-white">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "목표 설정"}
          </Button>
        </form>
      </div>
    </div>
  );
}
