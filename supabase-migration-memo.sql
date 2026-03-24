-- =============================================
-- 커플 공용 메모장 테이블
-- Supabase SQL Editor에서 실행하세요
-- =============================================

-- 메모 테이블
CREATE TABLE IF NOT EXISTS couple_memos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id uuid REFERENCES couples(id) NOT NULL,
  author_id uuid REFERENCES auth.users(id) NOT NULL,
  category text NOT NULL DEFAULT 'free',     -- 'wishlist' | 'places' | 'bucket' | 'grocery' | 'free'
  title text NOT NULL,
  is_pinned boolean DEFAULT false,           -- 상단 고정
  color text DEFAULT 'default',              -- 'default' | 'pink' | 'blue' | 'yellow' | 'green'
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 메모 체크리스트 아이템
CREATE TABLE IF NOT EXISTS memo_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  memo_id uuid REFERENCES couple_memos(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  is_checked boolean DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE couple_memos ENABLE ROW LEVEL SECURITY;
ALTER TABLE memo_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "couple_memos_all" ON couple_memos FOR ALL USING (
  is_couple_member(couple_id)
);

CREATE POLICY "memo_items_all" ON memo_items FOR ALL USING (
  memo_id IN (SELECT id FROM couple_memos WHERE is_couple_member(couple_id))
);
