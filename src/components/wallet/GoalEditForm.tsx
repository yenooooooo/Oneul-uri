"use client";

import { useState } from "react";
import { useLockScroll } from "@/hooks/useLockScroll";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import FormInput from "@/components/common/FormInput";
import FormDatePicker from "@/components/common/FormDatePicker";
import type { WalletGoal } from "@/types/wallet";

/** GoalEditForm 컴포넌트 props */
interface GoalEditFormProps {
  goal: WalletGoal;
  onSubmit: (updates: { title?: string; target_amount?: number; target_date?: string | null }) => Promise<boolean>;
  onClose: () => void;
}

/**
 * 저축 목표 수정 모달 — 제목, 목표 금액, 목표 날짜 수정
 */
export default function GoalEditForm({ goal, onSubmit, onClose }: GoalEditFormProps) {
  useLockScroll();
  const [title, setTitle] = useState(goal.title);
  const [targetAmount, setTargetAmount] = useState(String(goal.target_amount));
  const [targetDate, setTargetDate] = useState(goal.target_date ?? "");
  const [loading, setLoading] = useState(false);

  /** 폼 제출 */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(targetAmount, 10);
    if (isNaN(amount) || amount <= 0) return;

    setLoading(true);
    const ok = await onSubmit({
      title,
      target_amount: amount,
      target_date: targetDate || null,
    });
    if (ok) onClose();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-txt-primary">목표 수정</h3>
          <button onClick={onClose} className="p-1 text-txt-tertiary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput id="edit-goal-title" label="목표 이름" value={title}
            onChange={(e) => setTitle(e.target.value)}
            required />

          <FormInput id="edit-goal-amount" label="목표 금액 (원)" type="number" value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            required min={1} className="text-lg" />

          <FormDatePicker id="edit-goal-date" label="목표 달성 날짜 (선택)" value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)} />

          <Button type="submit" disabled={loading || !title || !targetAmount}
            className="w-full rounded-full bg-coral-500 hover:bg-coral-600 text-white">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "수정하기"}
          </Button>
        </form>
      </div>
    </div>
  );
}
