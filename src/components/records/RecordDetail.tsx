"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Calendar, Trash2, Pencil, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { DateRecord, UpdateDateRecord } from "@/types";
import { MOOD_OPTIONS } from "@/types/record";
import { useBookmarks } from "@/hooks/useBookmarks";
import RecordWriteModal from "@/components/records/RecordWriteModal";
import CommentSection from "@/components/records/CommentSection";
import PhotoGallery from "@/components/records/PhotoGallery";

/** RecordDetail 컴포넌트 props */
interface RecordDetailProps {
  record: DateRecord;
  onUpdate: (id: string, data: UpdateDateRecord) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

/**
 * 데이트 기록 상세 뷰
 * 사진 갤러리 + 제목 + 날짜/장소 + 메모 전체 표시
 * 수정/삭제 버튼 포함
 */
export default function RecordDetail({ record, onUpdate, onDelete }: RecordDetailProps) {
  const router = useRouter();
  const { bookmarkPlace, isBookmarked } = useBookmarks();
  const [showEdit, setShowEdit] = useState(false); // 수정 모달 표시
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // 삭제 확인

  // 삭제 확인 모달 열릴 때 스크롤 방지 + BottomNav 숨김
  useEffect(() => {
    if (showDeleteConfirm) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [showDeleteConfirm]);

  /** 삭제 처리 */
  const handleDelete = async () => {
    const success = await onDelete(record.id);
    if (success) router.push("/records");
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* 상단 바 */}
      <div className="sticky top-0 z-10 bg-cream/80 backdrop-blur-lg px-4 py-3 flex items-center justify-between">
        <button onClick={() => router.back()} className="p-1">
          <ArrowLeft className="w-5 h-5 text-txt-primary" />
        </button>
        <div className="flex gap-2">
          <button onClick={() => setShowEdit(true)} className="p-2 text-txt-secondary">
            <Pencil className="w-4 h-4" />
          </button>
          <button onClick={() => setShowDeleteConfirm(true)} className="p-2 text-error">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 사진 갤러리 (가로 스크롤 + 도트 인디케이터) */}
      {record.photos.length > 0 && (
        <PhotoGallery photos={record.photos} />
      )}

      {/* 기록 정보 */}
      <div className="px-4 pt-2 pb-8 space-y-4 max-w-lg mx-auto">
        <div className="flex items-center gap-2">
          {record.mood && (
            <span className="text-2xl">
              {MOOD_OPTIONS.find((m) => m.value === record.mood)?.emoji}
            </span>
          )}
          <h1 className="text-2xl font-bold text-txt-primary">{record.title}</h1>
        </div>

        <div className="flex items-center gap-4 text-sm text-txt-secondary">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {formatDate(record.date, "long")}{" "}
            {new Date(record.created_at).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
          </span>
          {record.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {record.location}
            </span>
          )}
          {/* 장소 북마크 버튼 */}
          {record.location && (
            <button
              onClick={() => bookmarkPlace({ name: record.location! })}
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full transition-colors ${
                isBookmarked(record.location)
                  ? "bg-coral-100 text-coral-400"
                  : "bg-cream-dark text-txt-tertiary"
              }`}
            >
              <Bookmark className="w-3 h-3" />
              {isBookmarked(record.location) ? "저장됨" : "저장"}
            </button>
          )}
        </div>

        {/* 메모 — 따뜻한 인용구 스타일 */}
        {record.memo && (
          <div className="bg-coral-50/50 rounded-2xl p-5 border-l-[3px] border-coral-200">
            <p className="font-serif-ko text-txt-primary whitespace-pre-wrap leading-relaxed italic">
              &ldquo;{record.memo}&rdquo;
            </p>
          </div>
        )}

        {/* 댓글 섹션 */}
        <div className="bg-surface-low rounded-2xl p-4">
          <CommentSection recordId={record.id} />
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center px-6">
          <div className="bg-surface-low rounded-3xl p-6 w-full max-w-xs text-center space-y-4">
            <p className="font-semibold text-txt-primary">
              이 기록을 삭제할까요?
            </p>
            <p className="text-sm text-txt-secondary">
              삭제하면 되돌릴 수 없어요.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 rounded-full"
              >
                취소
              </Button>
              <Button
                onClick={handleDelete}
                className="flex-1 rounded-full bg-error hover:bg-red-600 text-white"
              >
                삭제
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 수정 모달 */}
      {showEdit && (
        <RecordWriteModal
          initialData={{
            title: record.title,
            date: record.date,
            location: record.location ?? "",
            memo: record.memo ?? "",
            mood: record.mood ?? "",
            photos: record.photos,
          }}
          onSubmit={async (data) => {
            const success = await onUpdate(record.id, data);
            if (success) setShowEdit(false);
          }}
          onClose={() => setShowEdit(false)}
        />
      )}
    </div>
  );
}
