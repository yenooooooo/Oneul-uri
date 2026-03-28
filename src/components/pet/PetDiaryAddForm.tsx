"use client";

import { useState } from "react";
import type { CreatePetDiary, PetDiaryCategory } from "@/types";
import { PET_DIARY_CATEGORIES } from "@/types/pet";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import { useLockScroll } from "@/hooks/useLockScroll";
import PhotoUploader from "@/components/records/PhotoUploader";
import FormInput from "@/components/common/FormInput";
import FormTextarea from "@/components/common/FormTextarea";
import FormDatePicker from "@/components/common/FormDatePicker";
import FormCategorySelect from "@/components/common/FormCategorySelect";

interface Props {
  onSubmit: (data: CreatePetDiary) => Promise<boolean>;
  onClose: () => void;
}

/**
 * 성장 일기 작성 모달 — 날짜, 카테고리, 제목, 내용
 */
export default function PetDiaryAddForm({ onSubmit, onClose }: Props) {
  useLockScroll(); // 뒷배경 스크롤 방지
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<PetDiaryCategory>("daily");
  const [photos, setPhotos] = useState<string[]>([]); // 사진 URL 배열
  const [saving, setSaving] = useState(false);

  /** 폼 제출 */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const ok = await onSubmit({ date, title, content: content || undefined, category, photos });
    setSaving(false);
    if (ok) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-cream flex flex-col">
      <div className="flex-1 w-full max-w-lg mx-auto overflow-y-auto px-4 py-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold font-serif-ko">다이어리 작성</h3>
          <button onClick={onClose} className="p-1 text-txt-tertiary"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 날짜 */}
          <FormDatePicker id="diary-date" label="날짜" value={date}
            onChange={(e) => setDate(e.target.value)} required />

          {/* 카테고리 */}
          <FormCategorySelect label="카테고리" value={category}
            onChange={(v) => setCategory(v as PetDiaryCategory)}
            options={Object.entries(PET_DIARY_CATEGORIES).map(([key, cat]) => ({
              value: key, label: cat.label, emoji: cat.emoji,
            }))} />

          {/* 제목 */}
          <FormInput id="diary-title" label="제목" placeholder="오늘의 한마디"
            value={title} onChange={(e) => setTitle(e.target.value)} required />

          {/* 내용 */}
          <FormTextarea id="diary-content" label="내용 (선택)" placeholder="자세한 이야기를 적어보세요"
            value={content} onChange={(e) => setContent(e.target.value)} rows={3} />

          {/* 사진 (최대 3장) */}
          <div className="space-y-2">
            <span className="text-sm font-medium text-gray-700">사진 (최대 3장)</span>
            <PhotoUploader photos={photos} onChange={setPhotos} />
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
