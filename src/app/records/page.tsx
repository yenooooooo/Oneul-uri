"use client";

import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import RecordList from "@/components/records/RecordList";
import RecordWriteModal from "@/components/records/RecordWriteModal";
import { useDateRecords } from "@/hooks/useDateRecords";
import { Plus } from "lucide-react";

/**
 * 데이트 기록 목록 페이지 — /records
 * 타임라인 뷰로 기록 카드 나열 + FAB 버튼으로 새 기록 작성
 */
export default function RecordsPage() {
  const { records, loading, createRecord } = useDateRecords();
  const [showWrite, setShowWrite] = useState(false); // 작성 모달 표시 여부

  return (
    <AppLayout>
      <div className="px-4 pt-6">
        {/* 페이지 헤더 */}
        <h1 className="text-2xl font-bold text-txt-primary mb-4">
          데이트 기록
        </h1>

        {/* 기록 타임라인 목록 */}
        <RecordList records={records} loading={loading} />
      </div>

      {/* FAB — 새 기록 작성 버튼 */}
      <button
        onClick={() => setShowWrite(true)}
        style={{ bottom: "calc(5rem + env(safe-area-inset-bottom, 0px))" }} className="fixed right-4 w-14 h-14 bg-coral-400 rounded-full shadow-float flex items-center justify-center text-white active:scale-95 transition-transform z-40"
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
