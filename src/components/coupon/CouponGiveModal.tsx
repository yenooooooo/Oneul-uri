"use client";

import { useState } from "react";
import { useLockScroll } from "@/hooks/useLockScroll";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Loader2, Trash2 } from "lucide-react";
import type { CouponType } from "@/types/coupon";
import type { Couple } from "@/types";
import { cn } from "@/lib/utils";

interface CouponGiveModalProps {
  types: CouponType[];
  couple: Couple;
  userId: string;
  onSubmit: (typeId: string, winnerId: string, memo?: string) => Promise<boolean>;
  onDeleteType?: (typeId: string) => Promise<boolean>;
  onClose: () => void;
}

/**
 * 쿠폰 지급 모달 — 어떤 쿠폰을 누구에게 줄지 선택
 */
export default function CouponGiveModal({
  types, couple, userId, onSubmit, onDeleteType, onClose,
}: CouponGiveModalProps) {
  useLockScroll();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [winnerId, setWinnerId] = useState(userId); // 기본: 나
  const [betMemo, setBetMemo] = useState("");
  const [loading, setLoading] = useState(false);

  const partnerId = couple.user1_id === userId ? couple.user2_id : couple.user1_id;
  const myName = couple.user1_id === userId ? couple.user1_nickname : couple.user2_nickname;
  const partnerName = couple.user1_id === userId ? couple.user2_nickname : couple.user1_nickname;

  const handleSubmit = async () => {
    if (!selectedType) return;
    setLoading(true);
    const ok = await onSubmit(selectedType, winnerId, betMemo || undefined);
    if (ok) onClose();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}>
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-serif-ko text-lg font-bold text-txt-primary">쿠폰 지급 🏆</h3>
          <button onClick={onClose} className="p-1 text-txt-tertiary"><X className="w-5 h-5" /></button>
        </div>

        <div className="space-y-5">
          {/* 승자 선택 */}
          <div className="space-y-2">
            <Label>누가 이겼나요?</Label>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setWinnerId(userId)}
                className={cn("py-3 rounded-2xl text-sm font-medium transition-all",
                  winnerId === userId ? "bg-coral-500 text-white" : "bg-surface-low text-txt-secondary"
                )}>
                {couple.user1_id === userId ? couple.user1_emoji : couple.user2_emoji} {myName}
              </button>
              {partnerId && (
                <button onClick={() => setWinnerId(partnerId)}
                  className={cn("py-3 rounded-2xl text-sm font-medium transition-all",
                    winnerId === partnerId ? "bg-coral-500 text-white" : "bg-surface-low text-txt-secondary"
                  )}>
                  {couple.user1_id === userId ? couple.user2_emoji : couple.user1_emoji} {partnerName}
                </button>
              )}
            </div>
          </div>

          {/* 쿠폰 선택 */}
          <div className="space-y-2">
            <Label>어떤 쿠폰?</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto p-1">
              {types.map((t) => (
                <button key={t.id} onClick={() => setSelectedType(t.id)}
                  className={cn("w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all",
                    selectedType === t.id ? "bg-coral-50 ring-2 ring-coral-500" : "bg-surface-low"
                  )}>
                  <span className="text-2xl">{t.emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-txt-primary">{t.title}</p>
                    {t.description && <p className="text-xs text-txt-tertiary">{t.description}</p>}
                  </div>
                  {onDeleteType && (
                    <span onClick={(e) => { e.stopPropagation(); onDeleteType(t.id); }}
                      className="p-1 text-txt-tertiary hover:text-error flex-shrink-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 내기 메모 */}
          <div className="space-y-1.5">
            <Label>무슨 내기였나요? (선택)</Label>
            <Input placeholder="예: 강아지 찾기 내기 승리!" value={betMemo}
              onChange={(e) => setBetMemo(e.target.value)} className="rounded-xl" />
          </div>

          <Button onClick={handleSubmit} disabled={loading || !selectedType}
            className="w-full rounded-full bg-coral-500 hover:bg-coral-600 text-white">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "쿠폰 지급하기 🎉"}
          </Button>
        </div>
      </div>
    </div>
  );
}
