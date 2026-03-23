-- =============================================
-- 통장 업그레이드 마이그레이션
-- Supabase SQL Editor에서 실행하세요
-- =============================================

-- 1. 목표 기간 필드 추가
ALTER TABLE wallet_goals
  ADD COLUMN IF NOT EXISTS target_date date;

-- 2. 달성된 마일스톤 배열 필드 추가
ALTER TABLE wallet_goals
  ADD COLUMN IF NOT EXISTS achieved_milestones integer[] DEFAULT '{}';
