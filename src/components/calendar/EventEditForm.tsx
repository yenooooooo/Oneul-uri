"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Loader2 } from "lucide-react";
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
          <div className="space-y-1.5">
            <Label htmlFor="edit-title">제목</Label>
            <Input id="edit-title" value={title}
              onChange={(e) => setTitle(e.target.value)}
              required className="rounded-xl" />
          </div>

          <div className="space-y-1.5">
            <Label>카테고리</Label>
            <div className="flex gap-2">
              {CATEGORIES.map((cat) => (
                <button key={cat.value} type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`flex-1 py-2 rounded-xl text-sm border transition-colors ${
                    category === cat.value
                      ? "bg-coral-50 border-coral-300 text-coral-500"
                      : "bg-white border-coral-100 text-txt-secondary"
                  }`}>
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-time">시간 (선택)</Label>
            <Input id="edit-time" type="time" value={time}
              onChange={(e) => setTime(e.target.value)} className="rounded-xl" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-memo">메모 (선택)</Label>
            <Input id="edit-memo" value={memo}
              onChange={(e) => setMemo(e.target.value)} className="rounded-xl" />
          </div>

          <Button type="submit" disabled={loading || !title}
            className="w-full rounded-full bg-coral-500 hover:bg-coral-600 text-white">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "수정하기"}
          </Button>
        </form>
      </div>
    </div>
  );
}
