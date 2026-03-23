"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useDateRecords } from "@/hooks/useDateRecords";
import RecordDetail from "@/components/records/RecordDetail";
import { Loader2 } from "lucide-react";
import type { DateRecord } from "@/types";

/**
 * 데이트 기록 상세 페이지 — /records/[id]
 * URL 파라미터에서 기록 ID를 가져와 상세 정보 표시
 */
export default function RecordDetailPage() {
  const params = useParams();
  const id = params.id as string; // URL에서 기록 ID 추출
  const [record, setRecord] = useState<DateRecord | null>(null); // 기록 데이터
  const [loading, setLoading] = useState(true); // 로딩 상태
  const { updateRecord, deleteRecord } = useDateRecords();
  const supabase = createClient();

  /** 기록 ID로 상세 데이터를 조회한다 */
  useEffect(() => {
    const fetchRecord = async () => {
      try {
        // date_records 테이블에서 해당 ID의 레코드 조회
        const { data, error } = await supabase
          .from("date_records")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error("[RecordDetailPage] 조회 실패:", error.message);
          return;
        }
        setRecord(data as DateRecord);
      } catch (error) {
        console.error("[RecordDetailPage] 예외 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRecord();
  }, [id]);

  // 로딩 중
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Loader2 className="w-8 h-8 animate-spin text-coral-400" />
      </div>
    );
  }

  // 기록을 찾을 수 없음
  if (!record) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <p className="text-txt-secondary">기록을 찾을 수 없어요.</p>
      </div>
    );
  }

  return (
    <RecordDetail
      record={record}
      onUpdate={updateRecord}
      onDelete={deleteRecord}
    />
  );
}
