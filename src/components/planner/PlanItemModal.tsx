"use client";

import { useState } from "react";
import { useLockScroll } from "@/hooks/useLockScroll";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Loader2, Dices } from "lucide-react";
import FormInput from "@/components/common/FormInput";
import { PLAN_CATEGORIES } from "@/types/planner";
import type { PlanCategory, CreatePlanItem, DatePlanItem } from "@/types/planner";
import { cn } from "@/lib/utils";

/** PlanItemModal 컴포넌트 props */
interface PlanItemModalProps {
  initial?: DatePlanItem; // 수정 시 기존 데이터
  onSubmit: (input: CreatePlanItem) => Promise<boolean>;
  onRoulette?: (category: PlanCategory) => void; // 룰렛 연동
  onClose: () => void;
}

const CATEGORY_KEYS = Object.keys(PLAN_CATEGORIES) as PlanCategory[];

/**
 * 아이템 추가/수정 모달
 * 시간 + 카테고리 + 제목 + 메모 + 링크 + 룰렛 연동
 */
export default function PlanItemModal({
  initial, onSubmit, onRoulette, onClose,
}: PlanItemModalProps) {
  useLockScroll();
  const [time, setTime] = useState(initial?.time ?? "");
  const [category, setCategory] = useState<PlanCategory>(initial?.category ?? "food");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [memo, setMemo] = useState(initial?.memo ?? "");
  const [link, setLink] = useState(initial?.link ?? "");
  const [isRoulette, setIsRoulette] = useState(initial?.is_from_roulette ?? false);
  const [loading, setLoading] = useState(false);

  /** 폼 제출 */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = await onSubmit({
      time: time || undefined, category, title,
      memo: memo || undefined, link: link || undefined,
      is_from_roulette: isRoulette,
    });
    if (ok) onClose();
    setLoading(false);
  };

  /** 룰렛으로 제목 정하기 */
  const handleRoulette = () => {
    if (onRoulette) onRoulette(category);
  };

  /** 룰렛 결과 적용 (외부에서 title을 세팅) */
  // 이 컴포넌트를 사용하는 곳에서 onRoulette 결과를 받아 setTitle로 반영

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-y-auto p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-txt-primary">
            {initial ? "일정 수정" : "일정 추가"}
          </h3>
          <button onClick={onClose} className="p-1 text-txt-tertiary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 시간 */}
          <FormInput label="시간 (선택)" type="time" value={time}
            onChange={(e) => setTime(e.target.value)} />

          {/* 카테고리 선택 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">카테고리</label>
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
              {CATEGORY_KEYS.map((key) => {
                const cat = PLAN_CATEGORIES[key];
                return (
                  <button key={key} type="button" onClick={() => setCategory(key)}
                    className={cn(
                      "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors",
                      category === key ? cat.color + " border-transparent" : "bg-white border-cream-dark text-txt-secondary"
                    )}>
                    {cat.emoji} {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 제목 + 룰렛 버튼 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">제목</label>
            <div className="flex gap-2">
              <Input placeholder="예: 초밥 맛집" value={title}
                onChange={(e) => { setTitle(e.target.value); setIsRoulette(false); }}
                required className="flex-1" />
              {onRoulette && (
                <button type="button" onClick={handleRoulette}
                  className="w-10 h-10 bg-yellow-warm/20 rounded-xl flex items-center justify-center text-yellow-warm flex-shrink-0">
                  <Dices className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* 메모 */}
          <FormInput label="메모 (선택)" placeholder="웨이팅 길어서 일찍 가야 함" value={memo}
            onChange={(e) => setMemo(e.target.value)} />

          {/* 링크 */}
          <FormInput label="링크 (선택)" placeholder="네이버 지도 링크, 전화번호 등" value={link}
            onChange={(e) => setLink(e.target.value)} />

          <Button type="submit" disabled={loading || !title}
            className="w-full rounded-full bg-coral-500 hover:bg-coral-600 text-white">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : initial ? "수정하기" : "추가하기"}
          </Button>
        </form>
      </div>
    </div>
  );
}
