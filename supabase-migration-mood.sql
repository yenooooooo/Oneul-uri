-- 데이트 기록에 감정 태그 추가
ALTER TABLE date_records
  ADD COLUMN IF NOT EXISTS mood text;
