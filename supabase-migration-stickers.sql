-- 캘린더 스티커 테이블
CREATE TABLE IF NOT EXISTS calendar_stickers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id uuid REFERENCES couples(id) NOT NULL,
  author_id uuid REFERENCES auth.users(id) NOT NULL,
  date date NOT NULL,
  sticker_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(couple_id, date)
);

ALTER TABLE calendar_stickers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "calendar_stickers_all" ON calendar_stickers FOR ALL USING (
  is_couple_member(couple_id)
);
