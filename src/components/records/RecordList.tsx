"use client";

import RecordCard from "@/components/records/RecordCard";
import { Loader2, PenSquare } from "lucide-react";
import type { DateRecord } from "@/types";

/** RecordList 컴포넌트 props */
interface RecordListProps {
  records: DateRecord[];
  loading: boolean;
}

/**
 * 데이트 기록 타임라인 목록
 * 로딩, 빈 상태, 기록 카드 리스트 3가지 상태 처리
 */
export default function RecordList({ records, loading }: RecordListProps) {
  // 로딩 중
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-coral-400" />
      </div>
    );
  }

  // 빈 상태
  if (records.length === 0) {
    return (
      <div className="text-center py-12">
        <PenSquare className="w-12 h-12 text-coral-200 mx-auto mb-3" />
        <p className="text-txt-secondary font-medium">
          아직 기록이 없어요
        </p>
        <p className="text-sm text-txt-tertiary mt-1">
          첫 번째 데이트를 기록해보세요
        </p>
      </div>
    );
  }

  // 기록 카드 리스트
  return (
    <div className="space-y-3">
      {records.map((record, index) => (
        <div
          key={record.id}
          className="animate-fade-up"
          style={{ animationDelay: `${index * 60}ms` }}
        >
          <RecordCard record={record} />
        </div>
      ))}
    </div>
  );
}
