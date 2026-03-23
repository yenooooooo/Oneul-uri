/** 기록 댓글 — record_comments 테이블 */
export interface RecordComment {
  id: string;
  record_id: string;
  couple_id: string;
  author_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}
