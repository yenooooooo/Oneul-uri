-- =============================================
-- 기념일 중복 정리 + 생일 필드 추가 마이그레이션
-- Supabase SQL Editor에서 실행하세요
-- =============================================

-- 1. 기존 중복 기념일 정리 (같은 couple_id + title + date 중 가장 오래된 것만 남김)
DELETE FROM anniversaries
WHERE id NOT IN (
  SELECT DISTINCT ON (couple_id, title, date) id
  FROM anniversaries
  ORDER BY couple_id, title, date, created_at ASC
);

-- 2. unique constraint 추가 (couple_id + title + date 조합 중복 방지)
ALTER TABLE anniversaries
  ADD CONSTRAINT anniversaries_couple_title_date_unique
  UNIQUE (couple_id, title, date);

-- 3. couples 테이블에 생일 필드 추가
ALTER TABLE couples
  ADD COLUMN IF NOT EXISTS user1_birthday date,
  ADD COLUMN IF NOT EXISTS user2_birthday date;
