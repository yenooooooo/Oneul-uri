-- =============================================
-- 데이트 플래너 테이블 마이그레이션
-- Supabase SQL Editor에서 실행하세요
-- =============================================

-- 1. 데이트 플래너 테이블
create table if not exists date_plans (
  id uuid default gen_random_uuid() primary key,
  couple_id uuid references couples(id) not null,
  author_id uuid references auth.users(id) not null,
  title text not null,
  date date not null,
  status text default 'planned',
  converted_record_id uuid references date_records(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. 플래너 아이템 테이블
create table if not exists date_plan_items (
  id uuid default gen_random_uuid() primary key,
  plan_id uuid references date_plans(id) on delete cascade not null,
  sort_order integer not null,
  time text,
  category text not null default 'etc',
  title text not null,
  memo text,
  link text,
  is_from_roulette boolean default false,
  created_at timestamptz default now()
);

-- 3. RLS 정책
alter table date_plans enable row level security;
alter table date_plan_items enable row level security;

create policy "date_plans_all" on date_plans for all using (
  is_couple_member(couple_id)
);

-- plan_items는 plan_id를 통해 간접 접근 제어
create policy "date_plan_items_all" on date_plan_items for all using (
  plan_id in (
    select id from date_plans
    where is_couple_member(couple_id)
  )
);
