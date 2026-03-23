-- =============================================
-- 커플 프로필 상태 메시지 마이그레이션
-- Supabase SQL Editor에서 실행하세요
-- =============================================

ALTER TABLE couples
  ADD COLUMN IF NOT EXISTS user1_status text DEFAULT '',
  ADD COLUMN IF NOT EXISTS user2_status text DEFAULT '';
