-- 편지 답장 연결 컬럼 추가
ALTER TABLE penpal_letters
  ADD COLUMN IF NOT EXISTS reply_to_id uuid REFERENCES penpal_letters(id);
