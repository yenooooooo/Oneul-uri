-- 커플 쿠폰 시스템
-- 쿠폰 종류 (등록된 쿠폰 템플릿)
CREATE TABLE IF NOT EXISTS coupon_types (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id uuid REFERENCES couples(id) NOT NULL,
  author_id uuid REFERENCES auth.users(id) NOT NULL,
  emoji text NOT NULL DEFAULT '🎟️',
  title text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- 획득된 쿠폰 (실제 보유/사용 내역)
CREATE TABLE IF NOT EXISTS coupons (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id uuid REFERENCES couples(id) NOT NULL,
  coupon_type_id uuid REFERENCES coupon_types(id) NOT NULL,
  winner_id uuid REFERENCES auth.users(id) NOT NULL,
  bet_memo text,
  status text DEFAULT 'active',
  used_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE coupon_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "coupon_types_all" ON coupon_types FOR ALL USING (is_couple_member(couple_id));
CREATE POLICY "coupons_all" ON coupons FOR ALL USING (is_couple_member(couple_id));
