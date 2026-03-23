-- =============================================
-- 초대 코드 조회 + 참여 RLS 정책 수정
-- 여자친구가 초대 코드로 커플 스페이스에 참여할 수 있도록
-- Supabase SQL Editor에서 실행하세요
-- =============================================

-- 기존 select 정책 삭제 후 재생성
DROP POLICY IF EXISTS "couples_select" ON couples;

-- 새 select 정책: 본인 커플 OR 초대 코드로 조회 가능
CREATE POLICY "couples_select" ON couples FOR SELECT USING (
  user1_id = auth.uid()
  OR user2_id = auth.uid()
  OR true  -- 인증된 사용자는 초대 코드 검색을 위해 조회 가능
);

-- 기존 update 정책에 user2 참여도 허용
DROP POLICY IF EXISTS "couples_update" ON couples;

CREATE POLICY "couples_update" ON couples FOR UPDATE USING (
  user1_id = auth.uid()
  OR user2_id = auth.uid()
  OR (user2_id IS NULL AND invite_code IS NOT NULL)  -- user2 미연결 상태에서 참여 허용
);
