-- ============================================
-- 반려견 기능 — 테이블 + RLS + 트리거
-- ============================================

-- 1. pets 테이블 — 반려견 프로필
CREATE TABLE IF NOT EXISTS pets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  breed TEXT,
  birthday DATE,
  adoption_date DATE,
  gender TEXT NOT NULL DEFAULT 'unknown',
  weight_kg NUMERIC,
  photo_url TEXT,
  personality TEXT,
  likes TEXT[] DEFAULT '{}',
  dislikes TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. pet_diaries 테이블 — 성장 일기
CREATE TABLE IF NOT EXISTS pet_diaries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id),
  date DATE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  category TEXT NOT NULL DEFAULT 'daily',
  photos TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. pet_health 테이블 — 건강 기록
CREATE TABLE IF NOT EXISTS pet_health (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  type TEXT NOT NULL DEFAULT 'checkup',
  title TEXT NOT NULL,
  hospital TEXT,
  cost INTEGER,
  next_date DATE,
  memo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- RLS 정책 — 본인 커플 스페이스만 접근
-- ============================================

ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet_diaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet_health ENABLE ROW LEVEL SECURITY;

-- pets RLS
CREATE POLICY "pets_select" ON pets FOR SELECT USING (
  couple_id IN (
    SELECT id FROM couples WHERE user1_id = auth.uid() OR user2_id = auth.uid()
  )
);
CREATE POLICY "pets_insert" ON pets FOR INSERT WITH CHECK (
  couple_id IN (
    SELECT id FROM couples WHERE user1_id = auth.uid() OR user2_id = auth.uid()
  )
);
CREATE POLICY "pets_update" ON pets FOR UPDATE USING (
  couple_id IN (
    SELECT id FROM couples WHERE user1_id = auth.uid() OR user2_id = auth.uid()
  )
);
CREATE POLICY "pets_delete" ON pets FOR DELETE USING (
  couple_id IN (
    SELECT id FROM couples WHERE user1_id = auth.uid() OR user2_id = auth.uid()
  )
);

-- pet_diaries RLS
CREATE POLICY "pet_diaries_select" ON pet_diaries FOR SELECT USING (
  couple_id IN (
    SELECT id FROM couples WHERE user1_id = auth.uid() OR user2_id = auth.uid()
  )
);
CREATE POLICY "pet_diaries_insert" ON pet_diaries FOR INSERT WITH CHECK (
  couple_id IN (
    SELECT id FROM couples WHERE user1_id = auth.uid() OR user2_id = auth.uid()
  )
);
CREATE POLICY "pet_diaries_update" ON pet_diaries FOR UPDATE USING (
  couple_id IN (
    SELECT id FROM couples WHERE user1_id = auth.uid() OR user2_id = auth.uid()
  )
);
CREATE POLICY "pet_diaries_delete" ON pet_diaries FOR DELETE USING (
  couple_id IN (
    SELECT id FROM couples WHERE user1_id = auth.uid() OR user2_id = auth.uid()
  )
);

-- pet_health RLS
CREATE POLICY "pet_health_select" ON pet_health FOR SELECT USING (
  couple_id IN (
    SELECT id FROM couples WHERE user1_id = auth.uid() OR user2_id = auth.uid()
  )
);
CREATE POLICY "pet_health_insert" ON pet_health FOR INSERT WITH CHECK (
  couple_id IN (
    SELECT id FROM couples WHERE user1_id = auth.uid() OR user2_id = auth.uid()
  )
);
CREATE POLICY "pet_health_update" ON pet_health FOR UPDATE USING (
  couple_id IN (
    SELECT id FROM couples WHERE user1_id = auth.uid() OR user2_id = auth.uid()
  )
);
CREATE POLICY "pet_health_delete" ON pet_health FOR DELETE USING (
  couple_id IN (
    SELECT id FROM couples WHERE user1_id = auth.uid() OR user2_id = auth.uid()
  )
);

-- ============================================
-- updated_at 자동 갱신 트리거 (pets 테이블)
-- ============================================
CREATE OR REPLACE FUNCTION update_pets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER pets_updated_at_trigger
  BEFORE UPDATE ON pets
  FOR EACH ROW EXECUTE FUNCTION update_pets_updated_at();
