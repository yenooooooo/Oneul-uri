"use client";

import Link from "next/link";
import { MapPin, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { DateRecord } from "@/types";

/** RecordCard 컴포넌트 props */
interface RecordCardProps {
  record: DateRecord;
}

/**
 * 데이트 기록 카드 — 타임라인 목록에서 사용
 * 썸네일 사진 + 제목 + 날짜 + 장소 표시
 */
export default function RecordCard({ record }: RecordCardProps) {
  // 첫 번째 사진을 썸네일로 사용
  const thumbnail = record.photos?.[0];

  return (
    <Link href={`/records/${record.id}`}>
      <article className="bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-card transition-shadow duration-200 active:scale-[0.98]">
        {/* 썸네일 이미지 */}
        {thumbnail && (
          <div className="aspect-[16/9] overflow-hidden">
            <img
              src={thumbnail}
              alt={record.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        {/* 기록 정보 */}
        <div className="p-4">
          <h3 className="font-semibold text-txt-primary mb-1">
            {record.title}
          </h3>

          <div className="flex items-center gap-3 text-xs text-txt-tertiary">
            {/* 날짜 */}
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(record.date, "short")}
            </span>

            {/* 장소 */}
            {record.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {record.location}
              </span>
            )}
          </div>

          {/* 메모 미리보기 (2줄까지) */}
          {record.memo && (
            <p className="text-sm text-txt-secondary mt-2 line-clamp-2">
              {record.memo}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
