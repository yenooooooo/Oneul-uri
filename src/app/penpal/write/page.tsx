"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePenpal } from "@/hooks/usePenpal";
import { useCouple } from "@/hooks/useCouple";
import StationeryPicker from "@/components/penpal/StationeryPicker";
import { ArrowLeft, Loader2, Send, ImagePlus, X } from "lucide-react";
import { uploadPhoto } from "@/lib/supabase/storage";
import { MAX_LETTER_LENGTH } from "@/lib/constants";
import FadeImage from "@/components/common/FadeImage";
import { toast } from "sonner";
import type { StationeryType } from "@/types";

/** 편지지 배경 스타일 매핑 */
const BG_STYLES: Record<string, string> = {
  default: "bg-[#FFFDF7]",
  flower: "bg-[#FFF5F5]",
  star: "bg-[#F5F5FF]",
  lined: "bg-white",
  craft: "bg-[#F5EDE0]",
};

/** Suspense 래퍼 — useSearchParams 필요 */
export default function WriteLetterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream" />}>
      <WriteLetterForm />
    </Suspense>
  );
}

/**
 * 편지 쓰기 폼 — /penpal/write?replyTo=ID&replyPreview=TEXT
 * 답장 시 원문 미리보기 + reply_to_id 저장
 */
function WriteLetterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const replyToId = searchParams.get("replyTo"); // 답장 원본 ID
  const replyPreview = searchParams.get("replyPreview"); // 원문 미리보기

  const { sendLetter } = usePenpal();
  const { partnerNickname, isPartnerConnected, loading: coupleLoading } = useCouple();

  // 커플 로딩 완료 후, user2 미연결이면 편지함으로 리다이렉트
  useEffect(() => {
    if (!coupleLoading && !isPartnerConnected) {
      toast.error("상대방이 연결되어야 편지를 보낼 수 있어요.");
      router.replace("/penpal");
    }
  }, [coupleLoading, isPartnerConnected, router]);
  const [content, setContent] = useState(""); // 편지 내용
  const [stationery, setStationery] = useState<StationeryType>("default"); // 편지지
  const [photoUrl, setPhotoUrl] = useState<string | null>(null); // 첨부 사진
  const [uploading, setUploading] = useState(false); // 사진 업로드 중
  const [sending, setSending] = useState(false); // 발송 중

  /** 사진 첨부 핸들러 */
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const url = await uploadPhoto(file, "penpal-attachments");
    if (url) {
      setPhotoUrl(url);
    } else {
      toast.error("사진 업로드에 실패했어요.");
    }
    setUploading(false);
  };

  /** 편지 발송 핸들러 */
  const handleSend = async () => {
    if (!content.trim()) {
      toast.error("편지 내용을 작성해주세요.");
      return;
    }

    setSending(true);
    const success = await sendLetter({
      content: content.trim(),
      stationery,
      photo_url: photoUrl ?? undefined,
      reply_to_id: replyToId ?? undefined,
    });

    if (success) {
      router.push("/penpal");
    }
    setSending(false);
  };

  const bgClass = BG_STYLES[stationery] ?? BG_STYLES.default;

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* 상단 바 */}
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={() => router.back()} className="p-1">
          <ArrowLeft className="w-5 h-5 text-txt-primary" />
        </button>
        <h1 className="text-lg font-bold text-txt-primary">편지 쓰기</h1>
        <button
          onClick={handleSend}
          disabled={sending || !content.trim()}
          className="p-2 text-coral-400 disabled:opacity-40"
        >
          {sending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* 편지지 선택 */}
      <div className="px-4 mb-3">
        <StationeryPicker value={stationery} onChange={setStationery} />
      </div>

      {/* 답장 원문 미리보기 */}
      {replyPreview && (
        <div className="mx-4 mb-2 bg-cream-dark rounded-xl px-4 py-2.5">
          <p className="text-xs text-txt-tertiary mb-0.5">↩ 답장 원문</p>
          <p className="text-sm text-txt-secondary line-clamp-2 font-handwriting">
            {decodeURIComponent(replyPreview)}
          </p>
        </div>
      )}

      {/* 편지 작성 영역 */}
      <div className={`flex-1 mx-4 mb-4 rounded-3xl ${bgClass} shadow-card p-5 flex flex-col`}>
        {/* 받는 사람 */}
        <p className="text-sm text-txt-tertiary mb-3">
          To. {partnerNickname ?? "상대방"}
        </p>

        {/* 편지 내용 입력 — 손글씨 폰트 */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="소중한 마음을 담아 편지를 써보세요..."
          maxLength={MAX_LETTER_LENGTH}
          className="flex-1 bg-transparent font-handwriting text-lg leading-relaxed text-txt-primary placeholder:text-txt-tertiary/50 focus:outline-none resize-none caret-coral-500"
        />

        {/* 글자 수 */}
        <p className="text-xs text-txt-tertiary text-right mt-2">
          {content.length} / {MAX_LETTER_LENGTH}
        </p>

        {/* 첨부 사진 미리보기 */}
        {photoUrl && (
          <div className="relative mt-3">
            <FadeImage src={photoUrl} alt="첨부" className="w-full h-40 rounded-xl" />
            <button
              onClick={() => setPhotoUrl(null)}
              className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center"
            >
              <X className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        )}
      </div>

      {/* 하단 도구 바 — 사진 첨부 */}
      <div className="px-4 pb-6">
        <label className="inline-flex items-center gap-2 text-sm text-txt-secondary cursor-pointer">
          {uploading ? (
            <Loader2 className="w-5 h-5 animate-spin text-coral-400" />
          ) : (
            <ImagePlus className="w-5 h-5 text-coral-400" />
          )}
          사진 첨부
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}
