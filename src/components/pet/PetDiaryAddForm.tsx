"use client";

import { useState } from "react";
import type { CreatePetDiary, PetDiaryCategory } from "@/types";
import { PET_DIARY_CATEGORIES } from "@/types/pet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  onSubmit: (data: CreatePetDiary) => Promise<boolean>;
  onClose: () => void;
}

/**
 * 성장 일기 작성 모달 — 날짜, 카테고리, 제목, 내용
 */
export default function PetDiaryAddForm({ onSubmit, onClose }: Props) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<PetDiaryCategory>("daily");
  const [saving, setSaving] = useState(false);

  /** 폼 제출 */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const ok = await onSubmit({ date, title, content: content || undefined, category });
    setSaving(false);
    if (ok) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-cream flex flex-col">
      <div className="flex-1 w-full max-w-lg mx-auto overflow-y-auto p-6 space-y-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold font-serif-ko">다이어리 작성</h3>
          <button onClick={onClose} className="p-1 text-txt-tertiary"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* 날짜 */}
          <div className="space-y-1">
            <Label htmlFor="diary-date">날짜</Label>
            <Input id="diary-date" type="date" value={date}
              onChange={(e) => setDate(e.target.value)} required className="rounded-xl" />
          </div>

          {/* 카테고리 */}
          <div className="space-y-1">
            <Label>카테고리</Label>
            <div className="flex gap-2">
              {(Object.entries(PET_DIARY_CATEGORIES) as [PetDiaryCategory, { emoji: string; label: string }][]).map(([key, cat]) => (
                <button key={key} type="button" onClick={() => setCategory(key)}
                  className={cn("flex-1 py-2 rounded-xl text-xs font-medium transition-colors",
                    category === key ? "bg-coral-500 text-white" : "bg-surface-low text-txt-secondary"
                  )}>{cat.emoji} {cat.label}</button>
              ))}
            </div>
          </div>

          {/* 제목 */}
          <div className="space-y-1">
            <Label htmlFor="diary-title">제목</Label>
            <Input id="diary-title" placeholder="오늘의 한마디" value={title}
              onChange={(e) => setTitle(e.target.value)} required className="rounded-xl" />
          </div>

          {/* 내용 */}
          <div className="space-y-1">
            <Label htmlFor="diary-content">내용 (선택)</Label>
            <textarea id="diary-content" placeholder="자세한 이야기를 적어보세요"
              value={content} onChange={(e) => setContent(e.target.value)} rows={3}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>

          <Button type="submit" disabled={saving || !title}
            className="w-full rounded-full bg-coral-500 hover:bg-coral-600 text-white py-3">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "저장하기"}
          </Button>
        </form>
      </div>
    </div>
  );
}
