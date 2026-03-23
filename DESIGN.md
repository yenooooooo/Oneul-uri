# 🎨 오늘우리 (Oneul-uri) — 디자인 가이드 (DESIGN.md)

---

## 1. 디자인 컨셉

### 핵심 키워드
**"따뜻한 우리만의 공간"**

비트윈 앱처럼 둥글고 부드러운 UI에 커플 감성을 담는다.
차갑고 날카로운 비즈니스 앱이 아닌, 열어볼 때마다 기분 좋아지는 느낌.

### 무드
- 포근한 카페에서 편지를 읽는 느낌
- 다이어리에 스티커를 붙이는 느낌
- 분홍빛 노을이 지는 따뜻한 저녁

---

## 2. 컬러 시스템

### Primary Palette
```css
:root {
  /* 메인 — 코랄 핑크 (포인트 컬러) */
  --primary-50: #FFF0F0;
  --primary-100: #FFD4D4;
  --primary-200: #FFB0B0;
  --primary-300: #FF8A8A;
  --primary-400: #FF6B6B;    /* ← 메인 포인트 */
  --primary-500: #E85555;
  --primary-600: #CC4444;

  /* 배경 — 웜 크림 */
  --bg-primary: #FFF8F0;     /* 메인 배경 */
  --bg-secondary: #FFFFFF;   /* 카드 배경 */
  --bg-tertiary: #FFF0E8;    /* 강조 배경 */

  /* 텍스트 */
  --text-primary: #2D2D2D;   /* 본문 */
  --text-secondary: #6B6B6B; /* 보조 텍스트 */
  --text-tertiary: #9B9B9B;  /* 비활성 텍스트 */
  --text-inverse: #FFFFFF;   /* 반전 (버튼 위 텍스트) */

  /* 서브 컬러 */
  --blue-soft: #7EB8E0;      /* 연호 식별 컬러 */
  --pink-soft: #F5A0B8;      /* 여자친구 식별 컬러 */
  --yellow-warm: #FFD66B;    /* 알림, 뱃지 */
  --green-soft: #7EC8A0;     /* 성공, 달성 */

  /* 기능 컬러 */
  --success: #4CAF50;
  --warning: #FF9800;
  --error: #F44336;

  /* 그림자 */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.1);
}
```

### 컬러 사용 규칙
- **배경:** 웜 크림(`--bg-primary`) — 전체 페이지 배경
- **카드:** 화이트(`--bg-secondary`) + `--shadow-sm` — 콘텐츠 카드
- **버튼:** 코랄 핑크(`--primary-400`) — CTA 버튼
- **연호 vs 여자친구:** 파랑(`--blue-soft`) vs 핑크(`--pink-soft`) — 캘린더 도트, 편지 구분
- **달성/성공:** 그린(`--green-soft`) — 목표 달성, 체크 완료

---

## 3. 타이포그래피

### 폰트 선정
```css
/* 본문 — Pretendard (깔끔하고 가독성 높음) */
--font-body: 'Pretendard', -apple-system, sans-serif;

/* 편지 전용 — 손글씨 느낌 (Nanum Pen Script 또는 Cafe24Ssurround) */
--font-handwriting: 'Nanum Pen Script', cursive;

/* 숫자 강조 — D-day 카운터, 금액 표시 */
--font-number: 'Pretendard', sans-serif;  /* font-weight: 800 */
```

### 폰트 사이즈 스케일 (모바일 기준)
```
--text-xs: 0.75rem;    (12px) — 캡션, 타임스탬프
--text-sm: 0.875rem;   (14px) — 보조 텍스트
--text-base: 1rem;     (16px) — 본문 기본
--text-lg: 1.125rem;   (18px) — 카드 제목
--text-xl: 1.25rem;    (20px) — 섹션 제목
--text-2xl: 1.5rem;    (24px) — 페이지 제목
--text-3xl: 2rem;      (32px) — D-day 숫자
--text-5xl: 3rem;      (48px) — 메인 D-day 카운터
```

---

## 4. 컴포넌트 디자인

### 4-1. 카드 (기본 컨테이너)
```
- 배경: white
- 모서리: rounded-2xl (16px)
- 패딩: p-4 ~ p-6
- 그림자: shadow-sm
- 호버: shadow-md 트랜지션 (0.2s)
```

### 4-2. 버튼
```
Primary:
  - 배경: --primary-400 (코랄 핑크)
  - 텍스트: white
  - 모서리: rounded-full
  - 패딩: px-6 py-3
  - 호버: --primary-500 + scale(1.02)

Secondary:
  - 배경: --bg-tertiary
  - 텍스트: --primary-400
  - 보더: 1px solid --primary-200
  - 모서리: rounded-full

Ghost:
  - 배경: transparent
  - 텍스트: --text-secondary
  - 호버: --bg-tertiary
```

### 4-3. 하단 네비게이션
```
- 고정: fixed bottom-0
- 높이: h-16 (64px) + safe area padding
- 배경: white + blur(10px) 백드롭
- 아이콘 5개: 🏠 홈 | 📝 기록 | 📅 캘린더 | 💌 편지 | 💰 통장
- 활성 탭: --primary-400 컬러 + 도트 인디케이터
- 비활성: --text-tertiary
- 편지 탭에 읽지 않은 편지 뱃지 표시 (빨간 도트)
```

### 4-4. FAB (Floating Action Button)
```
- 위치: 하단 네비 위 오른쪽 (bottom-20 right-4)
- 크기: w-14 h-14
- 배경: --primary-400
- 아이콘: + (plus)
- 그림자: shadow-lg
- 터치 시: scale(0.95) + haptic 느낌
```

### 4-5. 빈 상태 (Empty State)
```
- 중앙 정렬 일러스트 (이모지 또는 간단한 SVG)
- 안내 텍스트: "아직 기록이 없어요" 스타일
- CTA 버튼: "첫 번째 기록 남기기"
- 톤: 귀엽고 격려하는 느낌
```

---

## 5. 페이지별 디자인 상세

### 5-1. 홈 페이지 `/`
```
[상단]
┌─────────────────────────┐
│  우리의 💕 오늘          │  ← 인사 (닉네임 표시)
│                         │
│       D + 365           │  ← 큰 숫자 (text-5xl, bold)
│   2024.03.15 ~ 오늘     │  ← 사귄 날짜 범위
└─────────────────────────┘

[다가오는 기념일]
┌─────────────────────────┐
│ 🎂 여자친구 생일    D-12 │
│ 💝 500일           D-34 │
└─────────────────────────┘

[최근 데이트]
┌──────┐ ┌──────┐ ┌──────┐
│ 사진 │ │ 사진 │ │ 사진 │   ← 가로 스크롤 카드
│ 3/20 │ │ 3/15 │ │ 3/10 │
└──────┘ └──────┘ └──────┘

[데이트 통장 요약]
┌─────────────────────────┐
│ 🏝️ 제주도 여행          │
│ ████████░░  320,000원   │  ← 프로그레스 바
│           / 500,000원   │
└─────────────────────────┘
```

### 5-2. 펜팔 — 봉투 열기 연출
```
[편지함 — 받은 편지 리스트]
┌─────────────────────────┐
│ 💌 연호가 보낸 편지      │  ← 봉투 아이콘이 살짝 흔들림
│    3월 20일              │     (unread 상태)
│    NEW ●                │
└─────────────────────────┘

[봉투 열기 — 전체화면 연출]
Step 1: 봉투가 화면 중앙에 등장 (scale 0 → 1)
Step 2: 탭하면 봉투 뚜껑이 위로 열림 (rotateX)
Step 3: 편지지가 봉투에서 위로 슬라이드 (translateY)
Step 4: 편지 내용이 손글씨 폰트로 표시
Step 5: 닫기 버튼으로 편지함 복귀

[편지 쓰기]
- 편지지 배경 선택 (5종: 기본, 꽃무늬, 별무늬, 줄노트, 크래프트)
- 손글씨 폰트로 입력
- 하단에 "보내기" 버튼 (봉투 날아가는 애니메이션)
```

### 5-3. 데이트 룰렛
```
[카테고리 선택 탭]
  🍽️ 음식  |  📍 장소  |  🎮 활동

[룰렛 휠]
┌─────────────────────────┐
│                         │
│    ╭───────────╮        │
│    │  🍕 🍣 🍜 │        │  ← 원형 룰렛 (CSS 회전)
│    │  🍝 🍖 🥘 │        │
│    ╰───────────╯        │
│                         │
│    [ 🎰 돌리기! ]       │  ← 큰 버튼
│                         │
└─────────────────────────┘

[결과]
┌─────────────────────────┐
│   🎉 오늘의 선택!        │
│   🍣 초밥                │
│                         │
│   [📅 캘린더에 추가]     │  ← 바로 일정 등록
└─────────────────────────┘
```

---

## 6. 애니메이션 가이드

### 기본 원칙
- 부드럽고 자연스러운 이징: `ease-out` 또는 `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- 200~400ms 사이 (너무 빠르지도, 느리지도 않게)
- 의미 있는 곳에만 — 모든 곳에 애니메이션 남발 금지

### 주요 애니메이션
```css
/* 페이지 진입 — 부드러운 페이드 업 */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 카드 리스트 — 순차 등장 (stagger) */
.card-item:nth-child(1) { animation-delay: 0ms; }
.card-item:nth-child(2) { animation-delay: 60ms; }
.card-item:nth-child(3) { animation-delay: 120ms; }

/* 봉투 열기 — 뚜껑 회전 */
@keyframes envelopeOpen {
  from { transform: rotateX(0deg); }
  to { transform: rotateX(-180deg); }
}

/* 편지 슬라이드 업 */
@keyframes letterSlideUp {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* 룰렛 회전 */
@keyframes rouletteSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(var(--spin-degree)); }
}

/* 달성 축하 — confetti 이펙트 */
/* canvas-confetti 라이브러리 사용 권장 */

/* D-day 숫자 카운트업 */
/* 페이지 진입 시 0 → 실제 숫자로 카운트업 (1.2초) */
```

---

## 7. 아이콘 & 일러스트

### 아이콘
- **라이브러리:** Lucide React (일관된 선 두께, 둥근 느낌)
- **크기:** 20px (네비), 24px (카드 내), 32px (빈 상태)
- **색상:** 기본 `--text-secondary`, 활성 `--primary-400`

### 이모지 활용
- D-day: 💕
- 기념일: 🎂🎁💝🎉
- 편지: 💌✉️📮
- 통장: 💰🏝️✈️
- 룰렛: 🎰🍕🍜📍
- 빈 상태: 적절한 이모지 + 부드러운 안내 문구

---

## 8. 반응형 기준

### 모바일 퍼스트 (우선 지원)
```
모바일: ~430px   ← 메인 타겟 (iPhone 크기 기준)
태블릿: 431px ~ 768px
데스크톱: 769px~  ← 보조 지원 (나중에)
```

### 모바일 최적화 규칙
- 터치 타겟 최소 44x44px
- 하단 네비 고정 (safe area 대응: `pb-[env(safe-area-inset-bottom)]`)
- 스크롤 시 상단 헤더 숨기기 (선택)
- 이미지 lazy loading
- 키보드 올라올 때 레이아웃 깨지지 않게 처리

---

## 9. 금지 사항 (디자인)

- ❌ 날카로운 모서리 (rounded-none, rounded-sm) — 항상 rounded-xl 이상
- ❌ 회색 무채색 위주 디자인 — 따뜻한 컬러 유지
- ❌ 작은 글씨 (12px 미만) — 가독성 확보
- ❌ 복잡한 그라디언트 — 단색 또는 부드러운 2색 그라디언트만
- ❌ 과도한 애니메이션 — 의미 있는 곳에만 적용
- ❌ 기본 시스템 폰트 — 반드시 Pretendard 사용
- ❌ AI 생성물 티 나는 보라색 그라디언트, 뻔한 카드 레이아웃
