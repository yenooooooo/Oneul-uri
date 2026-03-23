-- 데이트 코스 북마크 테이블
CREATE TABLE IF NOT EXISTS bookmarked_places (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id uuid REFERENCES couples(id) NOT NULL,
  author_id uuid REFERENCES auth.users(id) NOT NULL,
  name text NOT NULL,               -- 장소명
  category text DEFAULT 'etc',      -- 'food' | 'cafe' | 'culture' | 'nature' | 'etc'
  memo text,                        -- 메모 ("분위기 좋음", "웨이팅 있음")
  visit_count integer DEFAULT 1,    -- 방문 횟수
  last_visited date,                -- 마지막 방문일
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bookmarked_places ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bookmarked_places_all" ON bookmarked_places FOR ALL USING (
  is_couple_member(couple_id)
);
