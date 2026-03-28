"use client";

import { useState } from "react";
import { useLockScroll } from "@/hooks/useLockScroll";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import FormInput from "@/components/common/FormInput";
import FormCategorySelect from "@/components/common/FormCategorySelect";
import type { CalendarEvent } from "@/types";

/** 카테고리 옵션 */
const CATEGORIES = [
  { value: "date", label: "데이트", emoji: "💕" },
  { value: "personal", label: "개인", emoji: "📌" },
  { value: "anniversary", label: "기념일", emoji: "🎉" },
];

/** EventEditForm 컴포넌트 props */
interface EventEditFormProps {
  event: CalendarEvent;
  onSubmit: (updates: { title?: string; category?: string; time?: string; memo?: string }) => Promise<void>;
  onClose: () => void;
}

/**
 * 캘린더 일정 수정 모달
 * 기존 값을 prefill하여 제목/카테고리/시간/메모 수정
 */
export default function EventEditForm({ event, onSubmit, onClose }: EventEditFormProps) {
  useLockScroll();
  const [title, setTitle] = useState(event.title);
  const [category, setCategory] = useState<string>(event.category);
  const [time, setTime] = useState(event.time ?? "");
  const [memo, setMemo] = useState(event.memo ?? "");
  const [loading, setLoading] = useState(false);

  /** 폼 제출 */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit({
      title, category, time: time || undefined, memo: memo || undefined,
    });
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-txt-primary">일정 수정</h3>
          <button onClick={onClose} className="p-1 text-txt-tertiary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput id="edit-title" label="제목" value={title}
            onChange={(e) => setTitle(e.target.value)}
            required />

          {/* 카테고리 선택 */}
          <FormCategorySelect
            label="카테고리"
            options={CATEGORIES}
            value={category}
            onChange={setCategory}
          />

          <div className="space-y-2 overflow-hidden">
            <label htmlFor="edit-time" className="text-sm font-medium text-gray-700">시간 (선택)</label>
            <input id="edit-time" type="time" value={time}
              onChange={(e) => setTime(e.target.value)}
              className="h-12 w-full max-w-full rounded-xl border border-gray-200 bg-white px-4 text-base transition-colors duration-200 outline-none focus:border-coral-500 focus:ring-1 focus:ring-inset focus:ring-coral-500/20"
              style={{ WebkitAppearance: "none" }} />
          </div>

          <FormInput id="edit-memo" label="메모 (선택)" value={memo}
            onChange={(e) => setMemo(e.target.value)} />

          <Button type="submit" disabled={loading || !title}
            className="w-full rounded-full bg-coral-500 hover:bg-coral-600 text-white">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "수정하기"}
          </Button>
        </form>
      </div>
    </div>
  );
}
