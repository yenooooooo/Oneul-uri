"use client";

import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import RecordSummary from "@/components/records/RecordSummary";
import RecordList from "@/components/records/RecordList";
import RecordWriteModal from "@/components/records/RecordWriteModal";
import { useDateRecords } from "@/hooks/useDateRecords";
import { Plus } from "lucide-react";

/**
 * 데이트 기록 목록 페이지 — /records
 * 상단 요약 + 월별 그룹핑 타임라인 + FAB
 */
export default function RecordsPage() {
  const {
    records, loading, loadingMore, hasMore, totalCount,
    createRecord, loadMore,
  } = useDateRecords();
  const [showWrite, setShowWrite] = useState(false); // 작성 모달

  return (
    <AppLayout>
      <div className="px-5 pt-6 space-y-5">
        {/* 상단 요약 */}
        <RecordSummary totalCount={totalCount} />

        {/* 월별 그룹핑 기록 목록 */}
        <RecordList
          records={records}
          loading={loading}
          loadingMore={loadingMore}
          hasMore={hasMore}
          onLoadMore={loadMore}
        />
      </div>

      {/* FAB — 새 기록 작성 */}
      <button
        onClick={() => setShowWrite(true)}
        style={{ bottom: "calc(5rem + env(safe-area-inset-bottom, 0px))" }}
        className="fixed right-4 w-14 h-14 bg-coral-400 rounded-full shadow-float flex items-center justify-center text-white active:scale-95 transition-transform z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* 기록 작성 모달 */}
      {showWrite && (
        <RecordWriteModal
          onSubmit={async (data) => {
            const result = await createRecord(data);
            if (result) setShowWrite(false);
          }}
          onClose={() => setShowWrite(false)}
        />
      )}
    </AppLayout>
  );
}
