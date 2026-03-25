"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Loader2, MapPin } from "lucide-react";
import PhotoUploader from "@/components/records/PhotoUploader";
import { MOOD_OPTIONS } from "@/types/record";
import type { CreateDateRecord } from "@/types";
import { cn } from "@/lib/utils";

/** RecordWriteModal 컴포넌트 props */
interface RecordWriteModalProps {
  onSubmit: (data: CreateDateRecord) => Promise<void>;
  onClose: () => void;
  initialData?: Partial<CreateDateRecord>;
}

/**
 * 데이트 기록 작성/수정 — 전체 화면 모달
 * 제목, 날짜, 감정, 장소, 메모, 사진
 */
export default function RecordWriteModal({
  onSubmit, onClose, initialData,
}: RecordWriteModalProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [date, setDate] = useState(
    initialData?.date ?? new Date().toISOString().split("T")[0]
  );
  const [mood, setMood] = useState(initialData?.mood ?? "");
  const [location, setLocation] = useState(initialData?.location ?? "");
  const [memo, setMemo] = useState(initialData?.memo ?? "");
  const [photos, setPhotos] = useState<string[]>(initialData?.photos ?? []);
  const [loading, setLoading] = useState(false);

  /** 폼 제출 */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit({ title, date, mood: mood || undefined, location, memo, photos });
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-cream flex flex-col">
      <div className="flex-1 w-full max-w-lg mx-auto overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-coral-50">
          <h2 className="text-lg font-semibold text-txt-primary">
            {initialData ? "기록 수정" : "새 기록"}
          </h2>
          <button onClick={onClose} className="p-1 text-txt-tertiary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* 제목 */}
          <div className="space-y-1.5">
            <Label htmlFor="title">제목</Label>
            <Input id="title" placeholder="오늘의 데이트 한 줄 제목"
              value={title} onChange={(e) => setTitle(e.target.value)}
              required className="rounded-xl" />
          </div>

          {/* 날짜 */}
          <div className="space-y-1.5">
            <Label htmlFor="date">날짜</Label>
            <Input id="date" type="date" value={date}
              onChange={(e) => setDate(e.target.value)}
              required className="rounded-xl" />
          </div>

          {/* 감정 태그 */}
          <div className="space-y-1.5">
            <Label>오늘의 기분</Label>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {MOOD_OPTIONS.map((m) => (
                <button key={m.value} type="button"
                  onClick={() => setMood(mood === m.value ? "" : m.value)}
                  className={cn(
                    "flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl border transition-colors flex-shrink-0",
                    mood === m.value
                      ? "bg-coral-50 border-coral-300"
                      : "bg-white border-cream-dark"
                  )}>
                  <span className="text-xl">{m.emoji}</span>
                  <span className="text-[10px] text-txt-secondary">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 장소 */}
          <div className="space-y-1.5">
            <Label htmlFor="location">장소</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-tertiary" />
              <Input id="location" placeholder="어디서 만났나요?"
                value={location} onChange={(e) => setLocation(e.target.value)}
                className="rounded-xl pl-9" />
            </div>
          </div>

          {/* 메모 */}
          <div className="space-y-1.5">
            <Label htmlFor="memo">메모</Label>
            <textarea id="memo" placeholder="오늘의 기억을 남겨보세요"
              value={memo} onChange={(e) => setMemo(e.target.value)} rows={4}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>

          {/* 사진 */}
          <div className="space-y-1.5">
            <Label>사진 (최대 5장)</Label>
            <PhotoUploader photos={photos} onChange={setPhotos} />
          </div>

          {/* 제출 */}
          <Button type="submit" disabled={loading || !title}
            className="w-full rounded-full bg-coral-500 hover:bg-coral-600 text-white py-3">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" />
              : initialData ? "수정하기" : "기록하기"}
          </Button>
        </form>
      </div>
    </div>
  );
}
