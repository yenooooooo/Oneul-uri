"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Loader2, MapPin } from "lucide-react";
import PhotoUploader from "@/components/records/PhotoUploader";
import type { CreateDateRecord } from "@/types";

/** RecordWriteModal 컴포넌트 props */
interface RecordWriteModalProps {
  onSubmit: (data: CreateDateRecord) => Promise<void>;
  onClose: () => void;
  /** 수정 모드일 때 초기값 */
  initialData?: Partial<CreateDateRecord>;
}

/**
 * 데이트 기록 작성/수정 모달
 * 제목, 날짜, 장소, 메모, 사진 입력 폼
 */
export default function RecordWriteModal({
  onSubmit,
  onClose,
  initialData,
}: RecordWriteModalProps) {
  const [title, setTitle] = useState(initialData?.title ?? ""); // 기록 제목
  const [date, setDate] = useState(
    initialData?.date ?? new Date().toISOString().split("T")[0]
  ); // 데이트 날짜
  const [location, setLocation] = useState(initialData?.location ?? ""); // 장소
  const [memo, setMemo] = useState(initialData?.memo ?? ""); // 메모
  const [photos, setPhotos] = useState<string[]>(initialData?.photos ?? []); // 사진 URL 배열
  const [loading, setLoading] = useState(false); // 제출 로딩

  /** 폼 제출 핸들러 */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit({ title, date, location, memo, photos });
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

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* 제목 */}
          <div className="space-y-1.5">
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              placeholder="오늘의 데이트 한 줄 제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="rounded-xl"
            />
          </div>

          {/* 날짜 */}
          <div className="space-y-1.5">
            <Label htmlFor="date">날짜</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="rounded-xl"
            />
          </div>

          {/* 장소 */}
          <div className="space-y-1.5">
            <Label htmlFor="location">장소</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-tertiary" />
              <Input
                id="location"
                placeholder="어디서 만났나요?"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="rounded-xl pl-9"
              />
            </div>
          </div>

          {/* 메모 */}
          <div className="space-y-1.5">
            <Label htmlFor="memo">메모</Label>
            <textarea
              id="memo"
              placeholder="오늘의 기억을 남겨보세요"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          {/* 사진 업로드 */}
          <div className="space-y-1.5">
            <Label>사진 (최대 5장)</Label>
            <PhotoUploader photos={photos} onChange={setPhotos} />
          </div>

          {/* 제출 버튼 */}
          <Button
            type="submit"
            disabled={loading || !title}
            className="w-full rounded-full bg-coral-400 hover:bg-coral-500 text-white py-3"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : initialData ? (
              "수정하기"
            ) : (
              "기록하기"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
