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
 * 사진 있는 기록 — 큰 카드 (썸네일 + 제목 + 날짜 + 메모 미리보기)
 */
export default function RecordCard({ record }: RecordCardProps) {
  const thumbnail = record.photos?.[0];
  const photoCount = record.photos?.length ?? 0;

  return (
    <Link href={`/records/${record.id}`}>
      <article className="bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-card transition-shadow active:scale-[0.99]">
        {/* 썸네일 이미지 */}
        {thumbnail && (
          <div className="aspect-[16/9] overflow-hidden relative">
            <img
              src={thumbnail}
              alt={record.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* 사진 개수 뱃지 */}
            {photoCount > 1 && (
              <span className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                <Camera className="w-3 h-3" /> {photoCount}
              </span>
            )}
          </div>
        )}

        {/* 기록 정보 */}
        <div className="p-4">
          <div className="flex items-center gap-1.5 mb-1">
            {record.mood && (
              <span className="text-base">
                {MOOD_OPTIONS.find((m) => m.value === record.mood)?.emoji}
              </span>
            )}
            <h3 className="font-semibold text-txt-primary">{record.title}</h3>
          </div>
          <div className="flex items-center gap-3 text-xs text-txt-tertiary">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(record.date, "short")}
            </span>
            {record.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {record.location}
              </span>
            )}
          </div>
          {record.memo && (
            <p className="text-sm text-txt-secondary mt-2 line-clamp-2">{record.memo}</p>
          )}
        </div>
      </article>
    </Link>
  );
}
