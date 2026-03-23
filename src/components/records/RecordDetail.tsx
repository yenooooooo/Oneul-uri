"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Calendar, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { DateRecord, UpdateDateRecord } from "@/types";
import RecordWriteModal from "@/components/records/RecordWriteModal";

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
  const [showEdit, setShowEdit] = useState(false); // 수정 모달 표시
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // 삭제 확인

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

      {/* 사진 갤러리 (가로 스크롤) */}
      {record.photos.length > 0 && (
        <div className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-hide">
          {record.photos.map((url, i) => (
            <img
              key={url}
              src={url}
              alt={`사진 ${i + 1}`}
              className="w-72 h-48 rounded-2xl object-cover flex-shrink-0"
            />
          ))}
        </div>
      )}

      {/* 기록 정보 */}
      <div className="px-4 pt-2 pb-8 space-y-4 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-txt-primary">
          {record.title}
        </h1>

        <div className="flex items-center gap-4 text-sm text-txt-secondary">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {formatDate(record.date, "long")}
          </span>
          {record.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {record.location}
            </span>
          )}
        </div>

        {/* 메모 */}
        {record.memo && (
          <div className="bg-white rounded-2xl p-4 shadow-soft">
            <p className="text-txt-primary whitespace-pre-wrap leading-relaxed">
              {record.memo}
            </p>
          </div>
        )}
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-6">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs text-center space-y-4">
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
