# 📋 오늘우리 (Oneul-uri) — 프로젝트 기획서 (PLAN.md)

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 프로젝트명 | 오늘우리 (Oneul-uri) |
| 한 줄 소개 | 우리 둘만의 데이트 기록 & 소통 앱 |
| 타겟 | 연호 + 여자친구 (2인 전용, 추후 퍼블릭 확장 가능) |
| 핵심 가치 | 매일의 기록이 쌓여 우리만의 이야기가 된다 |
| 앱 형태 | PWA (홈 화면 추가 → 앱처럼 실행, 추후 네이티브 전환 가능) |
| 타겟 OS | iOS 16.4+ (둘 다 아이폰) |
| 기술 스택 | Next.js 14 + Supabase + Tailwind CSS + shadcn/ui |
| 배포 | Vercel (무료) |
| 비용 | 완전 무료 (0원) |
| 예상 기간 | 2주 (Phase별 점진 개발) |

---

## 2. 핵심 기능 상세

### 2-1. 홈 — D-day 대시보드

**목적:** 앱 진입 시 "우리의 현재"를 한눈에 보여준다.

**기능:**
- 사귄 날짜 기준 D+N일 카운터 (큰 숫자로 감성적 표시)
- 다가오는 기념일 미리보기 (가장 가까운 1~2개)
- 최근 데이트 기록 썸네일 (최신 3개)
- 데이트 통장 현재 잔액 요약
- 오늘의 인사 (커플 프로필 사진 + 닉네임)

**데이터:**
- `couples` 테이블에서 `start_date` 조회
- `anniversaries` 테이블에서 다가오는 기념일 조회
- `date_records` 테이블에서 최신 3개 조회
- `wallet_transactions` 테이블에서 잔액 합산

---

### 2-2. 데이트 기록 (Records)

**목적:** 데이트한 날의 기록을 사진 + 메모로 남긴다.

**기능:**
- 날짜별 데이트 기록 작성 (제목, 날짜, 장소, 메모, 사진)
- 타임라인 뷰로 스크롤하며 추억 감상
- 기록 상세 보기 (사진 갤러리 + 전체 메모)
- 기록 수정 / 삭제
- 사진 최대 5장 업로드 (Supabase Storage)

**DB 테이블: `date_records`**
```sql
create table date_records (
  id uuid default gen_random_uuid() primary key,
  couple_id uuid references couples(id) not null,
  author_id uuid references auth.users(id) not null,
  title text not null,                    -- 기록 제목 ("홍대 데이트")
  date date not null,                     -- 데이트 날짜
  location text,                          -- 장소명
  memo text,                              -- 상세 메모
  photos text[] default '{}',             -- 사진 URL 배열 (최대 5장)
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

---

### 2-3. 기념일 관리 (Anniversary)

**목적:** 커플 기념일을 등록하고 D-day를 자동 계산한다.

**기능:**
- 자동 기념일: 100일, 200일, 300일, 1주년, 2주년... (사귄 날 기준 자동 생성)
- 커스텀 기념일: 생일, 첫 키스, 첫 여행 등 직접 등록
- 기념일 D-day 카운트다운 (D-30, D-7, D-1 강조)
- 지난 기념일은 "지난 기념일" 섹션에 아카이브
- 기념일별 메모 추가 가능 ("작년엔 이렇게 보냈어")

**DB 테이블: `anniversaries`**
```sql
create table anniversaries (
  id uuid default gen_random_uuid() primary key,
  couple_id uuid references couples(id) not null,
  title text not null,                    -- "100일", "여자친구 생일" 등
  date date not null,                     -- 기념일 날짜
  type text not null default 'custom',    -- 'auto' | 'custom'
  is_recurring boolean default false,     -- 매년 반복 여부
  memo text,                              -- 기념일 메모
  created_at timestamptz default now()
);
```

---

### 2-4. 펜팔 — 편지 (Penpal)

**목적:** 실제 편지처럼 감성적으로 메시지를 주고받는다.

**기능:**
- 편지 쓰기: 손글씨 폰트로 작성, 편지지 배경 선택 (5종)
- 편지 보내기: 봉투 날아가는 애니메이션
- 편지 받기: 봉투 열기 인터랙션 (탭해서 봉투를 열면 편지가 펼쳐짐)
- 편지함: 받은 편지 / 보낸 편지 탭
- 읽지 않은 편지 뱃지 표시
- 편지에 사진 1장 첨부 가능

**봉투 열기 연출 상세:**
1. 받은 편지 목록에서 봉투 아이콘이 살짝 흔들림 (unread 상태)
2. 봉투를 탭하면 봉투 뚜껑이 열리는 CSS 애니메이션 (0.6초)
3. 편지지가 봉투에서 슬라이드업으로 올라옴 (0.4초)
4. 편지 내용이 타이핑되듯 한 글자씩 나타남 (선택적)

**DB 테이블: `penpal_letters`**
```sql
create table penpal_letters (
  id uuid default gen_random_uuid() primary key,
  couple_id uuid references couples(id) not null,
  sender_id uuid references auth.users(id) not null,
  receiver_id uuid references auth.users(id) not null,
  content text not null,                  -- 편지 내용
  stationery text default 'default',     -- 편지지 종류
  photo_url text,                         -- 첨부 사진 URL
  is_read boolean default false,          -- 읽음 여부
  read_at timestamptz,                    -- 읽은 시간
  created_at timestamptz default now()
);
```

---

### 2-5. 데이트 통장 (Wallet)

**목적:** 함께 돈을 모아 여행 등 목표를 달성한다.

**기능:**
- 데이트 통장 잔액 표시 (큰 숫자 + 프로그레스 바)
- 입금 기록 추가 (금액, 메모, 날짜, 입금자)
- 목표 설정: 목표명 + 목표 금액 (예: "제주도 여행 50만원")
- 달성률 시각화 (프로그레스 바 + 퍼센트)
- 입출금 내역 리스트 (최신순)
- 목표 달성 시 축하 이펙트 (confetti)

**DB 테이블: `wallet_goals`**
```sql
create table wallet_goals (
  id uuid default gen_random_uuid() primary key,
  couple_id uuid references couples(id) not null,
  title text not null,                    -- "제주도 여행"
  target_amount integer not null,         -- 목표 금액 (원)
  current_amount integer default 0,       -- 현재 모은 금액
  is_achieved boolean default false,      -- 달성 여부
  achieved_at timestamptz,                -- 달성 일시
  created_at timestamptz default now()
);
```

**DB 테이블: `wallet_transactions`**
```sql
create table wallet_transactions (
  id uuid default gen_random_uuid() primary key,
  couple_id uuid references couples(id) not null,
  goal_id uuid references wallet_goals(id) not null,
  user_id uuid references auth.users(id) not null,
  amount integer not null,                -- 금액 (양수: 입금, 음수: 출금)
  memo text,                              -- "3월 월급에서 5만원"
  created_at timestamptz default now()
);
```

---

### 2-6. 공유 캘린더 (Calendar)

**목적:** 둘의 일정을 한 캘린더에서 관리한다.

**기능:**
- 월간 캘린더 뷰 (각 날짜에 이벤트 도트 표시)
- 일정 추가: 제목, 날짜, 시간, 메모, 카테고리 (데이트/개인/기념일)
- 누가 등록했는지 표시 (연호: 파란 도트, 여자친구: 핑크 도트)
- 기념일 자동 표시 (anniversaries 테이블 연동)
- 데이트 기록이 있는 날은 하트 아이콘 표시

**DB 테이블: `calendar_events`**
```sql
create table calendar_events (
  id uuid default gen_random_uuid() primary key,
  couple_id uuid references couples(id) not null,
  author_id uuid references auth.users(id) not null,
  title text not null,                    -- "영화 보기"
  date date not null,
  time time,                              -- 선택사항
  category text default 'date',           -- 'date' | 'personal' | 'anniversary'
  memo text,
  created_at timestamptz default now()
);
```

---

### 2-7. 데이트 룰렛 (Roulette)

**목적:** "뭐 먹지? 어디 가지?" 결정 장애를 해결한다.

**기능:**
- 카테고리별 룰렛: 음식, 장소, 활동
- 기본 선택지 제공 + 커스텀 항목 추가/삭제
- 룰렛 돌리기 애니메이션 (원형 회전 + 결과 표시)
- 히스토리: 이전 룰렛 결과 기록 (이거 또 나왔네!)
- 결과를 캘린더 일정으로 바로 등록 버튼

**DB 테이블: `roulette_items`**
```sql
create table roulette_items (
  id uuid default gen_random_uuid() primary key,
  couple_id uuid references couples(id) not null,
  category text not null,                 -- 'food' | 'place' | 'activity'
  label text not null,                    -- "삼겹살", "한강 공원" 등
  is_default boolean default false,       -- 기본 제공 항목 여부
  created_at timestamptz default now()
);

create table roulette_history (
  id uuid default gen_random_uuid() primary key,
  couple_id uuid references couples(id) not null,
  category text not null,
  result text not null,                   -- 선택된 결과
  created_at timestamptz default now()
);
```

---

## 3. 커플 스페이스 & 인증 구조

### 3-1. 가입 & 연결 플로우

```
연호 (가입) → 커플 스페이스 생성 → 초대 코드 발급 (6자리)
                                         ↓
여자친구 (가입) → 초대 코드 입력 → 같은 커플 스페이스에 연결
```

### 3-2. DB 테이블: `couples`

```sql
create table couples (
  id uuid default gen_random_uuid() primary key,
  invite_code text unique not null,       -- 6자리 초대 코드
  start_date date not null,               -- 사귄 날짜
  user1_id uuid references auth.users(id),
  user2_id uuid references auth.users(id),
  user1_nickname text default '나',
  user2_nickname text default '상대방',
  user1_emoji text default '💙',          -- 프로필 이모지
  user2_emoji text default '💗',
  created_at timestamptz default now()
);
```

### 3-3. RLS 정책 (모든 테이블 공통 패턴)

```sql
-- 본인이 속한 커플 스페이스의 데이터만 접근 가능
create policy "couple_access" on date_records
  for all using (
    couple_id in (
      select id from couples
      where user1_id = auth.uid() or user2_id = auth.uid()
    )
  );
```

---

## 4. 페이지별 와이어프레임 요약

| 페이지 | 핵심 요소 | 하단 네비 |
|--------|----------|----------|
| 홈 `/` | D-day 카운터, 기념일 미리보기, 최근 기록 | 🏠 홈 |
| 기록 `/records` | 타임라인 리스트, 작성 FAB 버튼 | 📝 기록 |
| 캘린더 `/calendar` | 월간 캘린더, 일정 추가 | 📅 캘린더 |
| 편지 `/penpal` | 편지함 (받은/보낸), 편지쓰기 버튼 | 💌 편지 |
| 통장 `/wallet` | 잔액, 프로그레스 바, 입금 버튼, 내역 | 💰 통장 |
| 룰렛 `/roulette` | 카테고리 탭, 룰렛 휠, 히스토리 | (홈에서 진입) |
| 기념일 `/anniversary` | 다가오는/지난 기념일 리스트 | (홈에서 진입) |

---

## 5. 개발 Phase 일정

### Phase 1 — 기반 세팅 (Day 1~2)
- [ ] Next.js 14 프로젝트 초기화 (App Router)
- [ ] Tailwind CSS + shadcn/ui 설정
- [ ] PWA 기본 설정 (manifest.json, 아이콘, iOS 메타태그)
- [ ] Service Worker 등록 (오프라인 캐싱)
- [ ] Supabase 프로젝트 생성 & 환경변수 연결
- [ ] DB 테이블 전체 생성 (SQL 실행)
- [ ] RLS 정책 설정
- [ ] Supabase Auth 설정 (이메일/비밀번호)
- [ ] 로그인/회원가입 페이지
- [ ] 커플 스페이스 생성 & 초대 코드 연결

### Phase 2 — 핵심 기능 (Day 3~6)
- [ ] 홈 대시보드 (D-day 카운터 + 요약)
- [ ] 데이트 기록 CRUD (작성, 목록, 상세, 수정, 삭제)
- [ ] 사진 업로드 (Supabase Storage)
- [ ] 기념일 자동 생성 + 커스텀 등록
- [ ] 하단 네비게이션 바

### Phase 3 — 소통 기능 (Day 7~9)
- [ ] 펜팔 편지 쓰기 & 보내기
- [ ] 봉투 열기 애니메이션
- [ ] 편지함 (받은/보낸 탭)
- [ ] 공유 캘린더 (월간 뷰 + 일정 CRUD)

### Phase 4 — 재미 기능 (Day 10~12)
- [ ] 데이트 통장 (잔액 + 입금 + 목표 설정)
- [ ] 데이트 룰렛 (회전 애니메이션 + 히스토리)
- [ ] 목표 달성 축하 이펙트

### Phase 5 — 마감 & PWA (Day 13~14)
- [ ] 웹 푸시 알림 구현 (D-day, 기념일, 새 편지 알림)
- [ ] PWA 설치 유도 배너 (iOS Safari 가이드)
- [ ] UI 폴리싱 (애니메이션, 마이크로인터랙션)
- [ ] 모바일 반응형 최종 점검 (iPhone 기준)
- [ ] Vercel 배포
- [ ] 여자친구 계정 생성 & 테스트
- [ ] 둘 다 홈 화면에 앱 추가 & 푸시 알림 구독

---

## 6. PWA & 푸시 알림 상세 스펙

### 6-1. PWA 구성

**앱 형태:** Progressive Web App (홈 화면 추가 → 앱처럼 실행)
**타겟 OS:** iOS 16.4+ (둘 다 아이폰)
**비용:** 완전 무료 (Apple Developer 계정 불필요)

**PWA로 가능한 것:**
- 홈 화면 앱 아이콘 + 커스텀 스플래시
- 풀스크린 실행 (브라우저 바 없음)
- 오프라인 캐싱 (Service Worker)
- 웹 푸시 알림 (iOS 16.4+, 홈 화면 추가 필수)

**PWA로 불가능한 것:**
- 홈 화면 위젯 (네이티브만 가능)
- 앱 아이콘 뱃지 숫자 (iOS 미지원)

### 6-2. 푸시 알림 종류

| 알림 | 발송 시점 | 내용 예시 |
|------|----------|----------|
| 매일 D-day | 매일 오전 9시 | "💕 오늘은 D+365일이에요!" |
| 기념일 임박 | D-7, D-3, D-1, 당일 | "🎂 여자친구 생일이 3일 남았어요!" |
| 새 편지 도착 | 편지 발송 즉시 | "💌 새로운 편지가 도착했어요" |
| 목표 달성 | 통장 목표 달성 시 | "🎉 제주도 여행 자금 모으기 완료!" |

### 6-3. 푸시 알림 기술 구현

```
[알림 발송 흐름]
Supabase Edge Function (cron: 매일 09:00 KST)
  → couples 테이블에서 start_date 조회
  → D-day 계산
  → push_subscriptions 테이블에서 구독 정보 조회
  → Web Push 프로토콜로 알림 발송
```

**DB 테이블: `push_subscriptions`**
```sql
create table push_subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  couple_id uuid references couples(id) not null,
  endpoint text not null,                 -- 푸시 구독 endpoint URL
  p256dh text not null,                   -- 공개 키
  auth text not null,                     -- 인증 토큰
  created_at timestamptz default now()
);
```

### 6-4. iOS 푸시 알림 주의사항

- **반드시 홈 화면에 앱 추가 후에만 푸시 알림이 작동** (Safari 브라우저에서는 안 됨)
- 사용자가 "알림 허용"을 명시적으로 승인해야 함
- 알림 허용 요청은 버튼 클릭 등 사용자 인터랙션 중에만 가능 (페이지 로드 시 불가)
- 앱 설정 페이지에서 "알림 설정" 토글 UI 제공
- VAPID 키 쌍 생성 필요 (web-push 라이브러리로 한 번만 생성)
