# 🫶 오늘우리 (Oneul-uri) — Claude CLI 개발 지침서

---

## 프로젝트 개요

- **프로젝트명:** 오늘우리 (Oneul-uri)
- **설명:** 커플 전용 데이트 기록 & 소통 앱 (비트윈 스타일)
- **사용자:** 2명 (연호 + 여자친구) — 추후 퍼블릭 배포 고려
- **기술 스택:** Next.js 14 (App Router) + Supabase + Tailwind CSS + shadcn/ui
- **배포:** Vercel (무료)
- **앱 형태:** PWA (홈 화면 추가 → 앱처럼 실행) — 추후 네이티브 전환 고려
- **타겟 OS:** iOS (둘 다 아이폰) — iOS 16.4+ 웹 푸시 알림 활용
- **참고 디자인:** 비트윈 앱 (따뜻하고 둥근 커플앱 느낌)

---

## 🚨 절대 준수 사항 (코딩 규칙)

### 1. 파일 관리 — 한 파일 최대 150줄

- **모든 파일은 150줄 이하를 유지한다.**
- 150줄이 넘어가면 반드시 컴포넌트 분리 또는 유틸 함수 추출한다.
- 페이지 파일(`page.tsx`)에는 레이아웃과 데이터 페칭만 두고, UI는 컴포넌트로 분리한다.
- 예시:
  ```
  ❌ page.tsx (300줄, 모든 로직 + UI 포함)
  ✅ page.tsx (50줄) + components/DateCard.tsx (80줄) + hooks/useDateRecords.ts (40줄)
  ```

### 2. 주석 — 모든 코드에 상세 주석 필수

- **모든 함수** 위에 `/** */` JSDoc 주석으로 역할, 파라미터, 리턴값 설명
- **모든 상태(state)** 선언 옆에 `//` 한 줄 주석으로 용도 설명
- **복잡한 로직** (조건문 3개 이상, 데이터 변환 등)에는 단계별 주석
- **API 호출** 전후로 무엇을 요청하고 무엇을 받는지 주석
- **Supabase 쿼리**는 어떤 테이블에서 무엇을 가져오는지 반드시 주석
- 예시:
  ```typescript
  /**
   * 데이트 기록 목록을 날짜 역순으로 조회한다.
   * @param coupleId - 커플 스페이스 고유 ID
   * @param limit - 가져올 기록 수 (기본값: 20)
   * @returns DateRecord[] - 데이트 기록 배열
   */
  async function fetchDateRecords(coupleId: string, limit: number = 20): Promise<DateRecord[]> {
    // Supabase 'date_records' 테이블에서 해당 커플의 기록을 최신순으로 조회
    const { data, error } = await supabase
      .from('date_records')
      .select('*')
      .eq('couple_id', coupleId)
      .order('date', { ascending: false })
      .limit(limit);

    // 에러 발생 시 빈 배열 반환하고 콘솔에 에러 로깅
    if (error) {
      console.error('[fetchDateRecords] 조회 실패:', error.message);
      return [];
    }

    return data as DateRecord[];
  }
  ```

### 3. 에러 핸들링 — 모든 비동기 작업에 try-catch

- **모든 API 호출**, **모든 Supabase 쿼리**에 try-catch 적용
- catch 블록에서 반드시:
  1. `console.error`로 에러 상세 로깅 (함수명 + 에러 메시지)
  2. 사용자에게 토스트 알림으로 안내 (기술적 메시지 X, 친절한 한글 메시지 O)
  3. 적절한 fallback 값 반환 (빈 배열, null 등)
- 에러 로깅 포맷 통일:
  ```typescript
  console.error(`[함수명] 에러 설명:`, error);
  ```
- loading, error, empty 3가지 상태를 UI에서 항상 처리한다.

### 4. 디버깅 용이성

- **컴포넌트명은 기능을 명확히 나타내는 이름**으로 작성 (예: `DateRecordCard`, `AnniversaryBadge`)
- **커스텀 훅은 `use` + 기능명** (예: `useDateRecords`, `useCoupleWallet`)
- **콘솔 로그 네이밍 규칙:** `[파일명/함수명]` 접두사 필수
- **환경변수**는 `lib/env.ts`에서 한 번에 관리하고 타입 체크

### 5. 폴더 구조

```
src/
├── app/                          # Next.js App Router 페이지
│   ├── layout.tsx                # 루트 레이아웃 (폰트, 테마, 전역 프로바이더)
│   ├── page.tsx                  # 메인 홈 (D-day 카운터 + 요약 대시보드)
│   ├── records/                  # 데이트 기록
│   │   ├── page.tsx              # 기록 목록 (타임라인 뷰)
│   │   └── [id]/page.tsx         # 기록 상세
│   ├── calendar/                 # 공유 캘린더
│   │   └── page.tsx
│   ├── anniversary/              # 기념일 관리
│   │   └── page.tsx
│   ├── penpal/                   # 펜팔 (편지)
│   │   ├── page.tsx              # 편지함 (받은/보낸)
│   │   └── write/page.tsx        # 편지 쓰기
│   ├── wallet/                   # 데이트 통장
│   │   └── page.tsx
│   ├── roulette/                 # 데이트 룰렛
│   │   └── page.tsx
│   ├── auth/                     # 인증
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   └── globals.css
│
├── components/                   # 재사용 컴포넌트
│   ├── ui/                       # shadcn/ui 기본 컴포넌트
│   ├── layout/                   # 레이아웃 (Header, BottomNav, Sidebar)
│   ├── records/                  # 데이트 기록 관련 컴포넌트
│   ├── penpal/                   # 펜팔 관련 컴포넌트
│   ├── wallet/                   # 데이트 통장 관련 컴포넌트
│   ├── calendar/                 # 캘린더 관련 컴포넌트
│   ├── roulette/                 # 룰렛 관련 컴포넌트
│   └── common/                   # 공통 (Toast, Modal, EmptyState 등)
│
├── hooks/                        # 커스텀 훅
│   ├── useAuth.ts                # 인증 상태 관리
│   ├── useCouple.ts              # 커플 스페이스 정보
│   ├── useDateRecords.ts         # 데이트 기록 CRUD
│   ├── useAnniversary.ts         # 기념일 관리
│   ├── usePenpal.ts              # 펜팔 편지 관리
│   ├── useWallet.ts              # 데이트 통장 관리
│   └── useRoulette.ts            # 룰렛 데이터 관리
│
├── lib/                          # 유틸리티 & 설정
│   ├── supabase/
│   │   ├── client.ts             # Supabase 브라우저 클라이언트
│   │   ├── server.ts             # Supabase 서버 클라이언트
│   │   └── types.ts              # DB 테이블 타입 정의
│   ├── utils.ts                  # 공통 유틸 (날짜 계산, 포맷팅 등)
│   ├── constants.ts              # 상수 (기념일 목록, 룰렛 기본값 등)
│   └── env.ts                    # 환경변수 검증 & 타입
│
└── types/                        # TypeScript 타입 정의
    ├── record.ts                 # 데이트 기록 관련 타입
    ├── penpal.ts                 # 편지 관련 타입
    ├── wallet.ts                 # 통장 관련 타입
    └── index.ts                  # 타입 re-export
```

### 6. 네이밍 규칙

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 파일 | PascalCase | `DateRecordCard.tsx` |
| 훅 파일 | camelCase (use 접두사) | `useDateRecords.ts` |
| 유틸 파일 | camelCase | `dateUtils.ts` |
| 타입/인터페이스 | PascalCase | `DateRecord`, `PenpalLetter` |
| DB 테이블 | snake_case | `date_records`, `penpal_letters` |
| CSS 클래스 | Tailwind 유틸리티 | `className="rounded-2xl bg-pink-50"` |
| 상수 | UPPER_SNAKE_CASE | `MAX_LETTER_LENGTH` |

### 7. Git 커밋 규칙

```
feat: 데이트 기록 작성 기능 추가
fix: 기념일 D-day 계산 오류 수정
style: 펜팔 봉투 열기 애니메이션 적용
refactor: 통장 컴포넌트 분리 (150줄 초과)
chore: Supabase 타입 재생성
```

---

## 🎨 디자인 원칙

- **비트윈 앱 레퍼런스** — 따뜻하고 둥근 UI, 커플 감성
- **컬러:** 코랄 핑크(#FF6B6B) 메인 + 웜 크림(#FFF8F0) 배경
- **모서리:** `rounded-2xl` 이상 (둥글둥글한 느낌)
- **폰트:** Pretendard (본문) + 손글씨 폰트 (펜팔 전용)
- **아이콘:** Lucide React (일관성)
- **모바일 퍼스트** — 둘 다 폰으로 사용할 것이므로 모바일 최적화 필수
- **하단 네비게이션** — 홈, 기록, 캘린더, 편지, 통장 (5탭)

---

## 🗄️ Supabase 설정 가이드

### 인증
- Supabase Auth (이메일/비밀번호) — 계정 2개만 생성
- 회원가입 시 커플 코드 입력으로 같은 스페이스에 연결

### 스토리지
- `record-photos` 버킷 — 데이트 사진 저장
- `penpal-attachments` 버킷 — 편지 첨부 이미지

### RLS (Row Level Security)
- 모든 테이블에 RLS 활성화
- `couple_id`를 기준으로 본인 커플 스페이스 데이터만 접근 가능

---

## ⚠️ 작업 전 체크리스트

매 기능 개발 시작 전 확인:
1. [ ] 해당 기능의 타입 정의가 `types/`에 있는가?
2. [ ] Supabase 테이블 & RLS 정책이 준비되었는가?
3. [ ] 커스텀 훅이 `hooks/`에 분리되어 있는가?
4. [ ] 에러/로딩/빈 상태 UI가 모두 고려되었는가?
5. [ ] 모바일 뷰에서 레이아웃이 깨지지 않는가?

---

## 📱 PWA 설정 가이드 (iOS 최적화)

### 필수 파일
1. **`public/manifest.json`** — 앱 이름, 아이콘, 테마 컬러, 디스플레이 모드
2. **`public/sw.js`** — Service Worker (캐싱 + 푸시 알림 수신)
3. **`src/lib/pwa/`** — PWA 관련 유틸 (설치 프롬프트, 푸시 구독 등)

### manifest.json 핵심 설정
```json
{
  "name": "오늘우리",
  "short_name": "오늘우리",
  "description": "우리 둘만의 데이트 기록 앱",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FFF8F0",
  "theme_color": "#FF6B6B",
  "orientation": "portrait",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### iOS 전용 메타 태그 (layout.tsx에 추가)
```html
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="apple-mobile-web-app-title" content="오늘우리" />
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
```

### 웹 푸시 알림 (iOS 16.4+)
- **조건:** 사용자가 홈 화면에 앱을 추가해야 푸시 알림 작동
- **구현:** Service Worker + Push API + Supabase Edge Function (발송)
- **사용처:** 매일 D-day 알림, 기념일 D-day 알림, 새 편지 도착 알림
- **무료 발송:** Supabase Edge Function + Web Push 프로토콜 (별도 서비스 불필요)

### PWA 설치 유도 배너
- 첫 방문 시 "홈 화면에 추가하면 앱처럼 사용할 수 있어요" 안내 배너
- iOS Safari 공유 버튼 → "홈 화면에 추가" 가이드 이미지 표시
- 한 번 닫으면 localStorage에 저장하고 다시 안 보여줌

### 추가 폴더 구조
```
public/
├── manifest.json             # PWA 매니페스트
├── sw.js                     # Service Worker
├── icons/
│   ├── icon-192.png          # 안드로이드 아이콘
│   ├── icon-512.png          # 큰 아이콘
│   └── apple-touch-icon.png  # iOS 홈화면 아이콘
│
src/lib/pwa/
├── register-sw.ts            # Service Worker 등록
├── push-subscription.ts      # 푸시 알림 구독/해제
└── install-prompt.ts         # PWA 설치 유도 배너 로직
```

---

## 📋 개발 순서 (권장)

1. **Phase 1 — 기반:** 프로젝트 초기화, Supabase 연결, 인증, 커플 스페이스, PWA 기본 설정
2. **Phase 2 — 핵심:** D-day 카운터, 데이트 기록 CRUD, 기념일 관리
3. **Phase 3 — 소통:** 펜팔 (봉투 열기 연출), 공유 캘린더
4. **Phase 4 — 재미:** 데이트 통장, 데이트 룰렛
5. **Phase 5 — 마감:** UI 폴리싱, 푸시 알림 구현, PWA 설치 배너, 배포
