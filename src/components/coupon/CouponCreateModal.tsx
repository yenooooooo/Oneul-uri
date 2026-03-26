"use client";

import { useState } from "react";
import { useLockScroll } from "@/hooks/useLockScroll";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Loader2 } from "lucide-react";
import { COUPON_EMOJIS } from "@/types/coupon";
import { cn } from "@/lib/utils";

interface CouponCreateModalProps {
  onSubmit: (emoji: string, title: string, desc?: string) => Promise<boolean>;
  onClose: () => void;
}

/**
 * 쿠폰 종류 등록 모달 — 이모지 선택 + 제목 + 설명
 */
export default function CouponCreateModal({ onSubmit, onClose }: CouponCreateModalProps) {
  useLockScroll();
  const [emoji, setEmoji] = useState("🎟️");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = await onSubmit(emoji, title, desc || undefined);
    if (ok) onClose();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}>
      <div className="bg-white w-full max-w-sm rounded-3xl p-6"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-serif-ko text-lg font-bold text-txt-primary">새 쿠폰 등록</h3>
          <button onClick={onClose} className="p-1 text-txt-tertiary"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 이모지 선택 */}
          <div className="space-y-1.5">
            <Label>아이콘</Label>
            <div className="flex gap-2 flex-wrap">
              {COUPON_EMOJIS.map((e) => (
                <button key={e} type="button" onClick={() => setEmoji(e)}
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all",
                    emoji === e ? "bg-coral-50 ring-2 ring-coral-500 scale-110" : "bg-surface-low"
                  )}>
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>쿠폰 이름</Label>
            <Input placeholder="예: 치킨 쏘기" value={title}
              onChange={(e) => setTitle(e.target.value)} required className="rounded-xl" />
          </div>

          <div className="space-y-1.5">
            <Label>설명 (선택)</Label>
            <Input placeholder="예: 치킨 1마리 사주기" value={desc}
              onChange={(e) => setDesc(e.target.value)} className="rounded-xl" />
          </div>

          <Button type="submit" disabled={loading || !title}
            className="w-full rounded-full bg-coral-500 hover:bg-coral-600 text-white">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "등록하기"}
          </Button>
        </form>
      </div>
    </div>
  );
}
