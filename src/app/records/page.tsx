"use client";

import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import RecordSummary from "@/components/records/RecordSummary";
import RecordList from "@/components/records/RecordList";
import RecordWriteModal from "@/components/records/RecordWriteModal";
import { useDateRecords } from "@/hooks/useDateRecords";
import { useBookmarks } from "@/hooks/useBookmarks";
import { Plus, Settings } from "lucide-react";
import Link from "next/link";
import { FAB_BOTTOM } from "@/lib/constants";

/**
 * 데이트 기록 목록 페이지 — /records
 * 상단 요약 + 월별 그룹핑 타임라인 + FAB
 * 기록 작성 시 장소가 있으면 자동 북마크
 */
export default function RecordsPage() {
  const {
    records, loading, loadingMore, hasMore, totalCount,
    createRecord, loadMore,
  } = useDateRecords();
  const { bookmarkPlace } = useBookmarks();
  const [showWrite, setShowWrite] = useState(false);

  /** 기록 작성 + 장소 자동 북마크 */
  const handleCreate = async (data: Parameters<typeof createRecord>[0]) => {
    const result = await createRecord(data);
    if (result) {
      // 장소가 있으면 자동으로 북마크 (실패해도 기록에는 영향 없음)
      if (result.location) {
        bookmarkPlace({ name: result.location }).catch(() => {});
      }
      setShowWrite(false);
    }
  };

  return (
    <AppLayout>
      <div className="px-6 pt-6 space-y-12 animate-page-in">
        {/* 페이지 헤더 — 설정 아이콘 */}
        <div className="flex items-center justify-between">
          <h1 className="font-serif-ko text-3xl font-black text-txt-primary">기록</h1>
          <Link href="/settings" className="p-2 text-txt-tertiary">
            <Settings className="w-5 h-5" />
          </Link>
        </div>
        <RecordSummary totalCount={totalCount} />
        <RecordList
          records={records} loading={loading}
          loadingMore={loadingMore} hasMore={hasMore}
          onLoadMore={loadMore}
        />
      </div>

      <button
        onClick={() => setShowWrite(true)}
        style={{ bottom: FAB_BOTTOM }}
        className="fixed right-4 w-14 h-14 bg-coral-400 rounded-full shadow-float flex items-center justify-center text-white active:scale-95 transition-transform z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      {showWrite && (
        <RecordWriteModal onSubmit={handleCreate} onClose={() => setShowWrite(false)} />
      )}
    </AppLayout>
  );
}
