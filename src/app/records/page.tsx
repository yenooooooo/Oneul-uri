"use client";

import { useMemo, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import RecordSummary from "@/components/records/RecordSummary";
import RecordList from "@/components/records/RecordList";
import RecordWriteModal from "@/components/records/RecordWriteModal";
import { useDateRecords } from "@/hooks/useDateRecords";
import { useBookmarks } from "@/hooks/useBookmarks";
import { Plus, Settings, Search, X } from "lucide-react";
import Link from "next/link";
import { FAB_BOTTOM } from "@/lib/constants";

/**
 * 데이트 기록 목록 페이지 — /records
 * 상단 요약 + 검색 + 월별 그룹핑 타임라인 + FAB
 */
export default function RecordsPage() {
  const {
    records, loading, loadingMore, hasMore, totalCount,
    createRecord, loadMore,
  } = useDateRecords();
  const { bookmarkPlace } = useBookmarks();
  const [showWrite, setShowWrite] = useState(false);
  const [query, setQuery] = useState(""); // 검색어

  /** 검색 필터 — 제목, 장소, 메모에서 검색 */
  const filtered = useMemo(() => {
    if (!query.trim()) return records;
    const q = query.trim().toLowerCase();
    return records.filter((r) =>
      r.title.toLowerCase().includes(q) ||
      (r.location && r.location.toLowerCase().includes(q)) ||
      (r.memo && r.memo.toLowerCase().includes(q))
    );
  }, [records, query]);

  /** 기록 작성 + 장소 자동 북마크 */
  const handleCreate = async (data: Parameters<typeof createRecord>[0]) => {
    const result = await createRecord(data);
    if (result) {
      if (result.location) bookmarkPlace({ name: result.location }).catch(() => {});
      setShowWrite(false);
    }
  };

  return (
    <AppLayout>
      <div className="px-6 pt-6 space-y-6 animate-page-in">
        {/* 페이지 헤더 */}
        <div className="flex items-center justify-between">
          <h1 className="font-serif-ko text-3xl font-black text-txt-primary">기록</h1>
          <Link href="/settings" className="p-2 text-txt-tertiary">
            <Settings className="w-5 h-5" />
          </Link>
        </div>

        <RecordSummary totalCount={totalCount} />

        {/* 검색바 */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="제목, 장소, 메모로 검색..."
            className="w-full h-11 pl-10 pr-10 rounded-full bg-surface-low text-sm outline-none focus:ring-1 focus:ring-inset focus:ring-coral-500/30 placeholder:text-txt-tertiary"
          />
          {query && (
            <button onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-txt-tertiary">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 검색 결과 카운트 */}
        {query.trim() && (
          <p className="text-xs text-txt-tertiary">
            &ldquo;{query}&rdquo; 검색 결과 {filtered.length}개
          </p>
        )}

        <RecordList
          records={filtered} loading={loading}
          loadingMore={loadingMore} hasMore={!query.trim() && hasMore}
          onLoadMore={loadMore}
        />
      </div>

      <button onClick={() => setShowWrite(true)}
        style={{ bottom: FAB_BOTTOM }}
        className="fixed right-4 w-14 h-14 bg-coral-400 rounded-full shadow-float flex items-center justify-center text-white active:scale-95 transition-transform z-40">
        <Plus className="w-6 h-6" />
      </button>

      {showWrite && (
        <RecordWriteModal onSubmit={handleCreate} onClose={() => setShowWrite(false)} />
      )}
    </AppLayout>
  );
}
