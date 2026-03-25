"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Loader2 } from "lucide-react";

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
          <div className="space-y-1.5">
            <Label htmlFor="event-title">제목</Label>
            <Input
              id="event-title"
              placeholder="무슨 일정인가요?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="rounded-xl"
            />
          </div>

          {/* 카테고리 선택 */}
          <div className="space-y-1.5">
            <Label>카테고리</Label>
            <div className="flex gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`flex-1 py-2 rounded-xl text-sm border transition-colors ${
                    category === cat.value
                      ? "bg-coral-50 border-coral-300 text-coral-500"
                      : "bg-white border-coral-100 text-txt-secondary"
                  }`}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* 시간 (선택) */}
          <div className="space-y-1.5">
            <Label htmlFor="event-time">시간 (선택)</Label>
            <Input
              id="event-time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="rounded-xl"
            />
          </div>

          {/* 메모 (선택) */}
          <div className="space-y-1.5">
            <Label htmlFor="event-memo">메모 (선택)</Label>
            <Input
              id="event-memo"
              placeholder="메모를 남겨보세요"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="rounded-xl"
            />
          </div>

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
