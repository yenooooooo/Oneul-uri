"use client";

import { useRef, useState } from "react";
import { Camera, X, Loader2 } from "lucide-react";
import { uploadPhoto } from "@/lib/supabase/storage";
import { MAX_PHOTOS } from "@/lib/constants";
import { toast } from "sonner";

/** PhotoUploader 컴포넌트 props */
interface PhotoUploaderProps {
  photos: string[]; // 현재 사진 URL 배열
  onChange: (photos: string[]) => void; // 사진 변경 콜백
}

/**
 * 사진 업로드 컴포넌트 — 최대 5장까지 업로드 + 미리보기 + 삭제
 * Supabase Storage에 직접 업로드
 */
export default function PhotoUploader({ photos, onChange }: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null); // 파일 input ref
  const [uploading, setUploading] = useState(false); // 업로드 중 상태

  /** 파일 선택 시 업로드 처리 */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // 최대 사진 수 체크
    const remaining = MAX_PHOTOS - photos.length;
    if (remaining <= 0) {
      toast.error(`사진은 최대 ${MAX_PHOTOS}장까지 추가할 수 있어요.`);
      return;
    }

    setUploading(true);

    // 선택한 파일들을 순차 업로드
    const newPhotos = [...photos];
    const filesToUpload = Array.from(files).slice(0, remaining);

    for (const file of filesToUpload) {
      const url = await uploadPhoto(file);
      if (url) {
        newPhotos.push(url);
      } else {
        toast.error("사진 업로드에 실패했어요.");
      }
    }

    onChange(newPhotos);
    setUploading(false);

    // input 초기화 (같은 파일 재선택 가능하도록)
    if (inputRef.current) inputRef.current.value = "";
  };

  /** 사진 삭제 */
  const handleRemove = (index: number) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      {/* 사진 미리보기 그리드 */}
      <div className="flex gap-2 flex-wrap">
        {photos.map((url, index) => (
          <div key={url} className="relative w-20 h-20 rounded-xl overflow-hidden">
            <img
              src={url}
              alt={`사진 ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {/* 삭제 버튼 */}
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        ))}

        {/* 추가 버튼 (최대 수량 미만일 때만 표시) */}
        {photos.length < MAX_PHOTOS && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-20 h-20 rounded-xl border-2 border-dashed border-coral-200 flex items-center justify-center text-coral-300 hover:border-coral-400 hover:text-coral-400 transition-colors"
          >
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Camera className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {/* 숨겨진 파일 input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
