"use client";

import { useState } from "react";
import { useLockScroll } from "@/hooks/useLockScroll";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import FormInput from "@/components/common/FormInput";
import FormCategorySelect from "@/components/common/FormCategorySelect";

/** EventAddForm 컴포넌트 props */
interface EventAddFormProps {
  selectedDate: string; // 선택된 날짜 (YYYY-MM-DD)
  onSubmit: (
    title: string,
    date: string,
    category: string,
    time?: string,
    memo?: string
  ) => Promise<boolean>;
  onClose: () => void;
}

/** 카테고리 옵션 */
const CATEGORIES = [
  { value: "date", label: "데이트", emoji: "💕" },
  { value: "personal", label: "개인", emoji: "📌" },
  { value: "anniversary", label: "기념일", emoji: "🎉" },
];

/**
 * 캘린더 일정 추가 모달
 * 제목, 카테고리, 시간, 메모 입력
 */
export default function EventAddForm({
  selectedDate,
  onSubmit,
  onClose,
}: EventAddFormProps) {
  useLockScroll();
  const [title, setTitle] = useState(""); // 일정 제목
  const [category, setCategory] = useState("date"); // 카테고리
  const [time, setTime] = useState(""); // 시간 (선택)
  const [memo, setMemo] = useState(""); // 메모 (선택)
  const [loading, setLoading] = useState(false); // 로딩

  /** 폼 제출 */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await onSubmit(title, selectedDate, category, time || undefined, memo || undefined);
    if (success) onClose();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-txt-primary">일정 추가</h3>
          <button onClick={onClose} className="p-1 text-txt-tertiary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 제목 */}
          <FormInput
            id="event-title"
            label="제목"
            placeholder="무슨 일정인가요?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          {/* 카테고리 선택 */}
          <FormCategorySelect
            label="카테고리"
            options={CATEGORIES}
            value={category}
            onChange={setCategory}
          />

          {/* 시간 (선택) */}
          <FormInput
            id="event-time"
            label="시간 (선택)"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />

          {/* 메모 (선택) */}
          <FormInput
            id="event-memo"
            label="메모 (선택)"
            placeholder="메모를 남겨보세요"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />

          <Button
            type="submit"
            disabled={loading || !title}
            className="w-full rounded-full bg-coral-500 hover:bg-coral-600 text-white"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "추가하기"}
          </Button>
        </form>
      </div>
    </div>
  );
}
