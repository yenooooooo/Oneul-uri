"use client";

import Link from "next/link";
import { Camera } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { MOOD_OPTIONS } from "@/types/record";
import type { DateRecord } from "@/types";
import FadeImage from "@/components/common/FadeImage";

interface RecordCardProps {
  record: DateRecord;
}

/**
 * 사진 기록 — stitch(4) 에디토리얼 스타일
 * 4:3 사진 + 그라데이션 + 사진 아래 세리프 인용구
 */
export default function RecordCard({ record }: RecordCardProps) {
  const thumbnail = record.photos?.[0];
  const photoCount = record.photos?.length ?? 0;
  const moodEmoji = MOOD_OPTIONS.find((m) => m.value === record.mood)?.emoji;

  return (
    <Link href={`/records/${record.id}`}>
      <article className="group">
        {thumbnail && (
          <div className="aspect-[4/3] rounded-2xl overflow-hidden relative">
            <FadeImage src={thumbnail} alt={record.title}
              className="w-full h-full rounded-2xl" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5">
              <span className="text-white/70 text-xs font-bold tracking-widest uppercase mb-1.5 block">
                {formatDate(record.date, "dot")}
              </span>
              <h4 className="font-serif-ko text-xl text-white font-bold leading-tight">
                {moodEmoji && <span className="mr-1">{moodEmoji}</span>}
                {record.title}
              </h4>
            </div>
            {photoCount > 1 && (
              <span className="absolute top-3 right-3 bg-black/40 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                <Camera className="w-3 h-3" /> {photoCount}
              </span>
            )}
          </div>
        )}

        {/* 메모 — 사진 아래 세리프 인용구 */}
        {record.memo && thumbnail && (
          <div className="mt-5 pl-2 max-w-[90%]">
            <p className="font-serif-ko text-txt-secondary italic leading-relaxed text-base">
              &ldquo;{record.memo}&rdquo;
            </p>
          </div>
        )}

        {/* 사진 없는 경우 — RecordList에서 RecordMiniCard로 처리 */}
      </article>
    </Link>
  );
}
