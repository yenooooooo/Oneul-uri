-- =============================================
-- 오늘우리 (Oneul-uri) — Supabase DB 스키마
-- Supabase SQL Editor에서 실행하세요
-- =============================================

-- 1. 커플 스페이스 테이블
create table if not exists couples (
  id uuid default gen_random_uuid() primary key,
  invite_code text unique not null,
  start_date date not null,
  user1_id uuid references auth.users(id),
  user2_id uuid references auth.users(id),
  user1_nickname text default '나',
  user2_nickname text default '상대방',
  user1_emoji text default '💙',
  user2_emoji text default '💗',
  created_at timestamptz default now()
);

-- 2. 데이트 기록 테이블
create table if not exists date_records (
  id uuid default gen_random_uuid() primary key,
  couple_id uuid references couples(id) not null,
  author_id uuid references auth.users(id) not null,
  title text not null,
  date date not null,
  location text,
  memo text,
  photos text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. 기념일 테이블
create table if not exists anniversaries (
  id uuid default gen_random_uuid() primary key,
  couple_id uuid references couples(id) not null,
  title text not null,
  date date not null,
  type text not null default 'custom',
  is_recurring boolean default false,
  memo text,
  created_at timestamptz default now()
);

-- 4. 펜팔 편지 테이블
create table if not exists penpal_letters (
  id uuid default gen_random_uuid() primary key,
  couple_id uuid references couples(id) not null,
  sender_id uuid references auth.users(id) not null,
  receiver_id uuid references auth.users(id) not null,
  content text not null,
  stationery text default 'default',
  photo_url text,
  is_read boolean default false,
  read_at timestamptz,
  created_at timestamptz default now()
);

-- 5. 데이트 통장 목표 테이블
create table if not exists wallet_goals (
  id uuid default gen_random_uuid() primary key,
  couple_id uuid references couples(id) not null,
  title text not null,
  target_amount integer not null,
  current_amount integer default 0,
  is_achieved boolean default false,
  achieved_at timestamptz,
  created_at timestamptz default now()
);

-- 6. 통장 거래 내역 테이블
create table if not exists wallet_transactions (
  id uuid default gen_random_uuid() primary key,
  couple_id uuid references couples(id) not null,
  goal_id uuid references wallet_goals(id) not null,
  user_id uuid references auth.users(id) not null,
  amount integer not null,
  memo text,
  created_at timestamptz default now()
);

-- 7. 캘린더 일정 테이블
create table if not exists calendar_events (
  id uuid default gen_random_uuid() primary key,
  couple_id uuid references couples(id) not null,
  author_id uuid references auth.users(id) not null,
  title text not null,
  date date not null,
  time time,
  category text default 'date',
  memo text,
  created_at timestamptz default now()
);

-- 8. 룰렛 항목 테이블
create table if not exists roulette_items (
  id uuid default gen_random_uuid() primary key,
  couple_id uuid references couples(id) not null,
  category text not null,
  label text not null,
  is_default boolean default false,
  created_at timestamptz default now()
);

-- 9. 룰렛 히스토리 테이블
create table if not exists roulette_history (
  id uuid default gen_random_uuid() primary key,
  couple_id uuid references couples(id) not null,
  category text not null,
  result text not null,
  created_at timestamptz default now()
);

-- 10. 푸시 알림 구독 테이블
create table if not exists push_subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  couple_id uuid references couples(id) not null,
  endpoint text not null,
  p256dh text not null,
  auth text not null,
  created_at timestamptz default now()
);

-- =============================================
-- RLS (Row Level Security) 정책
-- 모든 테이블에서 본인 커플 스페이스 데이터만 접근 가능
-- =============================================

-- RLS 활성화
alter table couples enable row level security;
alter table date_records enable row level security;
alter table anniversaries enable row level security;
alter table penpal_letters enable row level security;
alter table wallet_goals enable row level security;
alter table wallet_transactions enable row level security;
alter table calendar_events enable row level security;
alter table roulette_items enable row level security;
alter table roulette_history enable row level security;
alter table push_subscriptions enable row level security;

-- couples 테이블 RLS
create policy "couples_select" on couples for select using (
  user1_id = auth.uid() or user2_id = auth.uid()
);
create policy "couples_insert" on couples for insert with check (
  user1_id = auth.uid()
);
create policy "couples_update" on couples for update using (
  user1_id = auth.uid() or user2_id = auth.uid()
);

-- 공통 RLS 패턴 함수 — 본인 커플 스페이스 확인
create or replace function is_couple_member(target_couple_id uuid)
returns boolean as $$
  select exists (
    select 1 from couples
    where id = target_couple_id
    and (user1_id = auth.uid() or user2_id = auth.uid())
  );
$$ language sql security definer;

-- date_records RLS
create policy "date_records_all" on date_records for all using (
  is_couple_member(couple_id)
);

-- anniversaries RLS
create policy "anniversaries_all" on anniversaries for all using (
  is_couple_member(couple_id)
);

-- penpal_letters RLS
create policy "penpal_letters_all" on penpal_letters for all using (
  is_couple_member(couple_id)
);

-- wallet_goals RLS
create policy "wallet_goals_all" on wallet_goals for all using (
  is_couple_member(couple_id)
);

-- wallet_transactions RLS
create policy "wallet_transactions_all" on wallet_transactions for all using (
  is_couple_member(couple_id)
);

-- calendar_events RLS
create policy "calendar_events_all" on calendar_events for all using (
  is_couple_member(couple_id)
);

-- roulette_items RLS
create policy "roulette_items_all" on roulette_items for all using (
  is_couple_member(couple_id)
);

-- roulette_history RLS
create policy "roulette_history_all" on roulette_history for all using (
  is_couple_member(couple_id)
);

-- push_subscriptions RLS
create policy "push_subscriptions_all" on push_subscriptions for all using (
  user_id = auth.uid()
);
