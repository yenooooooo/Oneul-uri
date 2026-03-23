"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useCouple } from "@/hooks/useCouple";
import { useAuth } from "@/hooks/useAuth";
import type { RecordComment } from "@/types/comment";
import { toast } from "sonner";

/**
 * 데이트 기록 댓글 관리 훅
 * @param recordId - 기록 ID
 */
export function useRecordComments(recordId: string) {
  const { user } = useAuth();
  const { couple } = useCouple();
  const [comments, setComments] = useState<RecordComment[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  /** 댓글 목록 조회 (오래된 순) */
  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("record_comments").select("*")
        .eq("record_id", recordId)
        .order("created_at", { ascending: true });
      if (error) console.error("[useRecordComments/fetch]:", error.message);
      setComments((data as RecordComment[]) ?? []);
    } catch (error) {
      console.error("[useRecordComments/fetch] 예외:", error);
    } finally {
      setLoading(false);
    }
  }, [recordId]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  /** 댓글 추가 */
  const addComment = async (content: string): Promise<boolean> => {
    if (!couple || !user || !content.trim()) return false;
    try {
      const { error } = await supabase.from("record_comments").insert({
        record_id: recordId,
        couple_id: couple.id,
        author_id: user.id,
        content: content.trim(),
      });
      if (error) { toast.error("댓글 작성에 실패했어요."); return false; }
      await fetchComments();
      return true;
    } catch (error) {
      console.error("[useRecordComments/add] 예외:", error);
      return false;
    }
  };

  /** 댓글 수정 */
  const updateComment = async (id: string, content: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from("record_comments")
        .update({ content, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) { toast.error("수정에 실패했어요."); return false; }
      await fetchComments();
      return true;
    } catch (error) {
      console.error("[useRecordComments/update] 예외:", error);
      return false;
    }
  };

  /** 댓글 삭제 */
  const deleteComment = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from("record_comments")
        .delete().eq("id", id);
      if (error) { toast.error("삭제에 실패했어요."); return false; }
      setComments((prev) => prev.filter((c) => c.id !== id));
      return true;
    } catch (error) {
      console.error("[useRecordComments/delete] 예외:", error);
      return false;
    }
  };

  return { comments, loading, addComment, updateComment, deleteComment };
}
