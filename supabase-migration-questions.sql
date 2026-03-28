-- ============================================
-- 커플 질문 기능 — 테이블 + RLS
-- ============================================

-- 1. couple_question_daily — 매일 할당된 질문
CREATE TABLE IF NOT EXISTS couple_question_daily (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(couple_id, question_id, date)
);

-- 2. couple_answers — 답변
CREATE TABLE IF NOT EXISTS couple_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  daily_id UUID NOT NULL REFERENCES couple_question_daily(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  answer_text TEXT,
  answer_choice TEXT,
  answer_scale INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(daily_id, user_id)
);

-- ============================================
-- RLS 정책
-- ============================================

ALTER TABLE couple_question_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE couple_answers ENABLE ROW LEVEL SECURITY;

-- couple_question_daily RLS
CREATE POLICY "cqd_select" ON couple_question_daily FOR SELECT USING (
  couple_id IN (
    SELECT id FROM couples WHERE user1_id = auth.uid() OR user2_id = auth.uid()
  )
);
CREATE POLICY "cqd_insert" ON couple_question_daily FOR INSERT WITH CHECK (
  couple_id IN (
    SELECT id FROM couples WHERE user1_id = auth.uid() OR user2_id = auth.uid()
  )
);

-- couple_answers RLS
CREATE POLICY "ca_select" ON couple_answers FOR SELECT USING (
  daily_id IN (
    SELECT id FROM couple_question_daily WHERE couple_id IN (
      SELECT id FROM couples WHERE user1_id = auth.uid() OR user2_id = auth.uid()
    )
  )
);
CREATE POLICY "ca_insert" ON couple_answers FOR INSERT WITH CHECK (
  user_id = auth.uid() AND
  daily_id IN (
    SELECT id FROM couple_question_daily WHERE couple_id IN (
      SELECT id FROM couples WHERE user1_id = auth.uid() OR user2_id = auth.uid()
    )
  )
);
