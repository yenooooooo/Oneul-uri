"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useCouple } from "@/hooks/useCouple";
import { useAuth } from "@/hooks/useAuth";
import type { DateRecord, CreateDateRecord, UpdateDateRecord } from "@/types";
import { toast } from "sonner";

/**
 * 데이트 기록 CRUD를 관리하는 커스텀 훅
 * 조회, 생성, 수정, 삭제 기능 제공
 * @returns 기록 목록 및 액션 함수
 */
export function useDateRecords() {
  const { user } = useAuth();
  const { couple } = useCouple();
  const [records, setRecords] = useState<DateRecord[]>([]); // 기록 목록
  const [loading, setLoading] = useState(true); // 로딩 상태
  const supabase = createClient();

  /**
   * 데이트 기록 목록을 날짜 역순으로 조회한다.
   * couple_id 기준으로 본인 커플의 기록만 가져옴
   */
  const fetchRecords = useCallback(async () => {
    if (!couple) return;

    try {
      setLoading(true);
      // date_records 테이블에서 해당 커플의 기록을 최신순으로 조회
      const { data, error } = await supabase
        .from("date_records")
        .select("*")
        .eq("couple_id", couple.id)
        .order("date", { ascending: false });

      if (error) {
        console.error("[useDateRecords/fetchRecords] 조회 실패:", error.message);
        toast.error("기록을 불러오지 못했어요.");
        return;
      }

      setRecords((data as DateRecord[]) ?? []);
    } catch (error) {
      console.error("[useDateRecords/fetchRecords] 예외 발생:", error);
      toast.error("기록을 불러오는 중 오류가 발생했어요.");
    } finally {
      setLoading(false);
    }
  }, [couple]);

  // 커플 정보가 준비되면 기록 목록 조회
  useEffect(() => {
    if (couple) fetchRecords();
  }, [couple, fetchRecords]);

  /**
   * 새 데이트 기록을 생성한다.
   * @param input - 기록 생성 데이터 (제목, 날짜, 장소, 메모, 사진)
   * @returns 생성된 기록 또는 null
   */
  const createRecord = async (input: CreateDateRecord): Promise<DateRecord | null> => {
    if (!couple || !user) return null;

    try {
      // date_records 테이블에 새 레코드 삽입
      const { data, error } = await supabase
        .from("date_records")
        .insert({
          couple_id: couple.id,
          author_id: user.id,
          title: input.title,
          date: input.date,
          location: input.location || null,
          memo: input.memo || null,
          photos: input.photos || [],
        })
        .select()
        .single();

      if (error) {
        console.error("[useDateRecords/createRecord] 생성 실패:", error.message);
        toast.error("기록 저장에 실패했어요.");
        return null;
      }

      const newRecord = data as DateRecord;
      // 목록 앞에 추가 후 날짜 역순 정렬
      setRecords((prev) =>
        [newRecord, ...prev].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      );
      toast.success("기록이 저장되었어요!");
      return newRecord;
    } catch (error) {
      console.error("[useDateRecords/createRecord] 예외 발생:", error);
      toast.error("기록 저장 중 오류가 발생했어요.");
      return null;
    }
  };

  /**
   * 기존 데이트 기록을 수정한다.
   * @param id - 기록 ID
   * @param input - 수정할 필드
   * @returns 성공 여부
   */
  const updateRecord = async (id: string, input: UpdateDateRecord): Promise<boolean> => {
    try {
      // date_records 테이블에서 해당 ID의 레코드 업데이트
      const { error } = await supabase
        .from("date_records")
        .update({ ...input, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) {
        console.error("[useDateRecords/updateRecord] 수정 실패:", error.message);
        toast.error("기록 수정에 실패했어요.");
        return false;
      }

      // 로컬 상태 업데이트
      setRecords((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...input } : r))
      );
      toast.success("기록이 수정되었어요!");
      return true;
    } catch (error) {
      console.error("[useDateRecords/updateRecord] 예외 발생:", error);
      toast.error("기록 수정 중 오류가 발생했어요.");
      return false;
    }
  };

  /**
   * 데이트 기록을 삭제한다.
   * @param id - 삭제할 기록 ID
   * @returns 성공 여부
   */
  const deleteRecord = async (id: string): Promise<boolean> => {
    try {
      // date_records 테이블에서 해당 ID의 레코드 삭제
      const { error } = await supabase
        .from("date_records")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("[useDateRecords/deleteRecord] 삭제 실패:", error.message);
        toast.error("기록 삭제에 실패했어요.");
        return false;
      }

      // 로컬 상태에서 제거
      setRecords((prev) => prev.filter((r) => r.id !== id));
      toast.success("기록이 삭제되었어요.");
      return true;
    } catch (error) {
      console.error("[useDateRecords/deleteRecord] 예외 발생:", error);
      toast.error("기록 삭제 중 오류가 발생했어요.");
      return false;
    }
  };

  return { records, loading, fetchRecords, createRecord, updateRecord, deleteRecord };
}
