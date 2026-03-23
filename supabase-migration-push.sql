-- =============================================
-- 푸시 알림 마이그레이션
-- Supabase SQL Editor에서 실행하세요
-- =============================================

-- push_subscriptions에 user_id unique constraint 추가 (upsert용)
ALTER TABLE push_subscriptions
  ADD CONSTRAINT push_subscriptions_user_id_unique UNIQUE (user_id);
