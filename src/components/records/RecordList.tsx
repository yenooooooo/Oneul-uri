"use client";

import RecordCard from "@/components/records/RecordCard";
import RecordMiniCard from "@/components/records/RecordMiniCard";
import RecordsSkeleton from "@/components/common/RecordsSkeleton";
import { Loader2, PenSquare } from "lucide-react";
import type { DateRecord } from "@/types";

/** 월별 그룹 타입 */
interface MonthGroup {
  key: string; // "2026-03"
  label: string; // "2026년 3월"
  withPhotos: DateRecord[]; // 사진 있는 기록
  withoutPhotos: DateRecord[]; // 사진 없는 기록
}

/** RecordList 컴포넌트 props */
interface RecordListProps {
  records: DateRecord[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

/**
 * 월별 그룹핑하여 기록을 분류한다.
 * 사진 유무에 따라 큰 카드/미니 카드로 분리
 */
function groupByMonth(records: DateRecord[]): MonthGroup[] {
  const map = new Map<string, MonthGroup>();

  records.forEach((r) => {
    const d = new Date(r.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

    if (!map.has(key)) {
      map.set(key, {
        key,
        label: `${d.getFullYear()}년 ${d.getMonth() + 1}월`,
        withPhotos: [],
        withoutPhotos: [],
      });
    }

    const group = map.get(key)!;
    if (r.photos && r.photos.length > 0) {
      group.withPhotos.push(r);
    } else {
      group.withoutPhotos.push(r);
    }
  });

  return Array.from(map.values());
}

/**
 * 데이트 기록 목록 — 월별 그룹핑 + 카드 스타일 분리 + 무한 스크롤
 */
export default function RecordList({
  records, loading, loadingMore, hasMore, onLoadMore,
}: RecordListProps) {
  // 초기 로딩
  if (loading) {
    return <RecordsSkeleton />;
  }

  // 빈 상태
  if (records.length === 0) {
    return (
      <div className="text-center py-12">
        <PenSquare className="w-12 h-12 text-coral-200 mx-auto mb-3" />
        <p className="text-txt-secondary font-medium">아직 기록이 없어요</p>
        <p className="text-sm text-txt-tertiary mt-1">첫 번째 데이트를 기록해보세요</p>
      </div>
    );
  }

  const groups = groupByMonth(records);

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <section key={group.key}>
          {/* 월 헤더 */}
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-sm font-semibold text-txt-secondary">{group.label}</h3>
            <div className="flex-1 h-px bg-coral-100" />
            <span className="text-xs text-txt-tertiary">
              {group.withPhotos.length + group.withoutPhotos.length}개
            </span>
          </div>

          {/* 사진 있는 기록 — 큰 카드 */}
          {group.withPhotos.length > 0 && (
            <div className="space-y-3 mb-2">
              {group.withPhotos.map((r) => (
                <RecordCard key={r.id} record={r} />
              ))}
            </div>
          )}

          {/* 사진 없는 기록 — 미니 카드 묶음 */}
          {group.withoutPhotos.length > 0 && (
            <div className="bg-white rounded-2xl shadow-soft overflow-hidden divide-y divide-cream-dark">
              {group.withoutPhotos.map((r) => (
                <RecordMiniCard key={r.id} record={r} />
              ))}
            </div>
          )}
        </section>
      ))}

      {/* 무한 스크롤 — 더 불러오기 */}
      {hasMore && (
        <button
          onClick={onLoadMore}
          disabled={loadingMore}
          className="w-full py-3 text-sm text-coral-400 font-medium"
        >
          {loadingMore ? (
            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
          ) : (
            "이전 기록 더 보기"
          )}
        </button>
      )}
    </div>
  );
}
