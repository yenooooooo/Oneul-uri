"use client";

import Link from "next/link";
import { MapPin, Calendar, Camera } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { MOOD_OPTIONS } from "@/types/record";
import type { DateRecord } from "@/types";

/** RecordCard 컴포넌트 props */
interface RecordCardProps {
  record: DateRecord;
}

/**
 * 사진 있는 기록 — 감성 카드 (큰 사진 + 인용구 스타일 메모)
 * 레퍼런스: stitch/_3 챕터 스타일
 */
export default function RecordCard({ record }: RecordCardProps) {
  const thumbnail = record.photos?.[0];
  const photoCount = record.photos?.length ?? 0;
  const moodEmoji = MOOD_OPTIONS.find((m) => m.value === record.mood)?.emoji;

  return (
    <Link href={`/records/${record.id}`}>
      <article className="bg-surface-low rounded-3xl overflow-hidden active:scale-[0.98] transition-transform">
        {/* 큰 썸네일 — 4:3 비율 */}
        {thumbnail && (
          <div className="aspect-[4/3] overflow-hidden relative">
            <img src={thumbnail} alt={record.title}
              className="w-full h-full object-cover" loading="lazy" />
            {/* 하단 그라데이션 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            {/* 사진 위 제목 */}
            <div className="absolute bottom-3 left-4 right-4">
              <h3 className="font-serif-ko text-lg font-bold text-white drop-shadow-md">
                {moodEmoji && <span className="mr-1">{moodEmoji}</span>}
                {record.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-white/80 mt-0.5">
                <span className="flex items-center gap-0.5">
                  <Calendar className="w-3 h-3" />
                  {formatDate(record.date, "short")}
                </span>
                {record.location && (
                  <span className="flex items-center gap-0.5">
                    <MapPin className="w-3 h-3" />
                    {record.location}
                  </span>
                )}
              </div>
            </div>
            {/* 사진 개수 */}
            {photoCount > 1 && (
              <span className="absolute top-3 right-3 bg-black/40 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                <Camera className="w-3 h-3" /> {photoCount}
              </span>
            )}
          </div>
        )}

        {/* 메모 — 인용구 스타일 */}
        {record.memo && (
          <div className="px-5 py-4">
            <p className="font-serif-ko text-sm text-txt-secondary italic leading-relaxed line-clamp-2">
              &ldquo;{record.memo}&rdquo;
            </p>
          </div>
        )}

        {/* 사진 없는 경우 기본 레이아웃 */}
        {!thumbnail && (
          <div className="p-5">
            <h3 className="font-semibold text-txt-primary">
              {moodEmoji && <span className="mr-1">{moodEmoji}</span>}
              {record.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-txt-tertiary mt-1">
              <span>{formatDate(record.date, "short")}</span>
              {record.location && <span>· {record.location}</span>}
            </div>
          </div>
        )}
      </article>
    </Link>
  );
}
