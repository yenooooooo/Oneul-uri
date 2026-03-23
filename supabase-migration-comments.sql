-- 데이트 기록 댓글 테이블
CREATE TABLE IF NOT EXISTS record_comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  record_id uuid REFERENCES date_records(id) ON DELETE CASCADE NOT NULL,
  couple_id uuid REFERENCES couples(id) NOT NULL,
  author_id uuid REFERENCES auth.users(id) NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE record_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "record_comments_all" ON record_comments FOR ALL USING (
  is_couple_member(couple_id)
);
