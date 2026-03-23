"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Loader2 } from "lucide-react";

/** AnniversaryAddForm 컴포넌트 props */
interface AnniversaryAddFormProps {
  onSubmit: (title: string, date: string, isRecurring: boolean) => Promise<boolean>;
  onClose: () => void;
}

/**
 * 커스텀 기념일 추가 폼 — 모달로 표시
 * 제목 + 날짜 + 매년 반복 여부 입력
 */
export default function AnniversaryAddForm({ onSubmit, onClose }: AnniversaryAddFormProps) {
  const [title, setTitle] = useState(""); // 기념일 제목
  const [date, setDate] = useState(""); // 기념일 날짜
  const [isRecurring, setIsRecurring] = useState(false); // 매년 반복
  const [loading, setLoading] = useState(false); // 로딩

  /** 폼 제출 */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await onSubmit(title, date, isRecurring);
    if (success) onClose();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-txt-primary">기념일 추가</h3>
          <button onClick={onClose} className="p-1 text-txt-tertiary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 제목 */}
          <div className="space-y-1.5">
            <Label htmlFor="ann-title">기념일 이름</Label>
            <Input
              id="ann-title"
              placeholder="예: 여자친구 생일"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="rounded-xl"
            />
          </div>

          {/* 날짜 */}
          <div className="space-y-1.5">
            <Label htmlFor="ann-date">날짜</Label>
            <Input
              id="ann-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="rounded-xl"
            />
          </div>

          {/* 매년 반복 */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="w-4 h-4 rounded border-coral-200 text-coral-400 focus:ring-coral-400"
            />
            <span className="text-sm text-txt-secondary">매년 반복</span>
          </label>

          <Button
            type="submit"
            disabled={loading || !title || !date}
            className="w-full rounded-full bg-coral-400 hover:bg-coral-500 text-white"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "추가하기"}
          </Button>
        </form>
      </div>
    </div>
  );
}
