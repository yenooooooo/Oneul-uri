# 오늘우리 (Oneul-uri) — App Structure Brief

## Overview
A couple-only date recording & communication PWA app (Korean).
Target: iOS PWA (iPhone), 2 users (couple).
Built with: Next.js 14 + Supabase + Tailwind CSS + shadcn/ui.

---

## Design System (Current)

### Colors
- **Primary:** Coral Pink `#FF6B6B` (main accent)
- **Background:** Warm Cream `#FFF8F0`
- **Card:** White `#FFFFFF`
- **Text Primary:** `#2D2D2D`
- **Text Secondary:** `#6B6B6B`
- **Text Tertiary:** `#9B9B9B`
- **Sub colors:** Blue Soft `#7EB8E0`, Pink Soft `#F5A0B8`, Yellow Warm `#FFD66B`, Green Soft `#7EC8A0`

### Typography
- **Body:** Pretendard Variable (Korean sans-serif)
- **Emotional titles:** Noto Serif KR (Korean serif, for D-day, anniversary, quotes)
- **Handwriting:** Nanum Pen Script (letter writing only)

### Shape & Style
- Border radius: `rounded-2xl` to `rounded-3xl`
- Cards: White background with soft shadow
- Glassmorphism: Bottom nav uses `bg-white/80 backdrop-blur-xl`
- Gradients: D-day card (coral→pink), Profile card (coral-50→white→pink), Letter cards
- Page transitions: 0.35s fade+slide animation

---

## Pages & Layout (19 pages)

### Bottom Navigation (5 tabs)
```
🏠 Home | 📖 Records | 📅 Calendar | 💌 Letters | 💰 Wallet
```

### 1. Home Dashboard (`/`)
- **Couple Profile Card** — Two emoji avatars + nicknames + status messages, gradient background
- **D-day Counter** — Large serif number "D + 365", coral→pink gradient, seasonal message + emoji
- **Upcoming Date Planner** — Next planned date link
- **Upcoming Anniversaries** — Next 3 anniversaries with D-day badges
- **Recent Records** — Horizontal scroll photo thumbnails with gradient overlay
- **Wallet Summary + Roulette** — 2-column grid shortcuts
- **Quick Links** — Places, Memos, Stats

### 2. Date Records (`/records`)
- **Summary Card** — Total records count + days together + recording rate progress bar
- **Monthly Grouped Timeline** — Records grouped by "2026년 3월"
  - Photo records: Large 4:3 card with gradient overlay, title on photo, serif quote memo
  - Text-only records: Mini single-line cards grouped together
- **Infinite Scroll** — Load 20 at a time
- **FAB** — Floating action button to create new record

### 3. Record Detail (`/records/[id]`)
- Photo gallery (horizontal scroll)
- Mood emoji + title (serif font)
- Date + time + location + bookmark button
- Memo text
- **Comment Section** — Instagram-style: author emoji + nickname (blue/pink), relative time, edit/delete menu

### 4. Calendar (`/calendar`)
- **Month Grid** — 7-column calendar with markers: 📋 planner, 💝 anniversary, ● event
- **"Today" button** — Quick jump to current date
- **Date Planner Link** — Create or view planner for selected date
- **Anniversary Cards** — Birthday 🎂, auto 💝, custom 🎉
- **Event List** — Author color coded (blue=me, pink=partner), edit/delete
- **FAB** — Add new event

### 5. Date Planner (`/calendar/plan/[id]`)
- Timeline view with vertical dotted line
- Each item: time + category tag (🍽️🏃☕🎬🛍️🎮📌) + title + memo + link
- Bottom bar: "Add item" + "Complete date 🎉"
- Complete → Convert to date record (auto-generate memo from timeline)

### 6. Letters / Penpal (`/penpal`)
- **Custom Tab Selector** — Received / Sent tabs (segmented control style)
- **Unread Section** — Pinned at top with count badge
- **Monthly Grouped** — Read letters grouped by month
- **Letter Card** — Gradient background (unread=coral, read=cream), serif italic quote preview, time, read status (✓ 읽음)
- **Envelope Opening Animation** — Tap → envelope scale animation → tap → letter slide up with stationery background + handwriting font
- **Reply button** in envelope viewer
- **FAB** — Write new letter

### 7. Letter Writing (`/penpal/write`)
- **Stationery Picker** — 5 types: Default, Flower, Star, Lined, Craft (circular color previews)
- Full-screen writing area with stationery background
- Handwriting font (Nanum Pen Script)
- Photo attachment
- Character counter (max 2000)
- Reply preview (if replying)

### 8. Wallet (`/wallet`)
- **Airplane Tracker** — 🏠→✈️→🏝️ progress bar with milestone checkpoints (25/50/75%)
- **Goal Card** — Amount + target + edit/delete
- **Pace Analysis** — Time% vs Amount% comparison bars, pace indicator (🟢fast/🔵on-track/🟠slow)
- **Estimated Date** — "At this pace, achieve by September 2026 🎯"
- **Deposit Button** — Large coral button
- **Transaction List** — Each item with ⋮ menu (edit/delete), depositor nickname
- **Milestone Popup** — 10/25/50/75/100% celebration with confetti at 100%

### 9. Roulette (`/roulette`)
- **Category Tabs** — 🍽️ Food, 📍 Place, 🎮 Activity
- **Wheel** — conic-gradient pie chart with spin animation (3s)
- **Result Card** — "Today's pick!" + "Add to calendar" button
- **Item Management** — Add/delete items per category
- **History** — Recent 10 results with time

### 10. Memos (`/memos`)
- **Category Filter** — 🛍️ Wishlist, 📍 Places, ⭐ Bucket, 🛒 Grocery, 📝 Free
- **2-Column Grid** — Color-coded cards with author emoji + pin indicator
- **Memo Detail** (`/memos/[id]`) — Checklist with check/uncheck, strikethrough completed items, color background

### 11. Anniversary (`/anniversary`)
- Auto-generated: 100~1000 days (every 100), 1~5 years
- Custom + Birthday (recurring, serif font titles)
- D-day calculation: recurring uses next upcoming date
- Sections: Upcoming (with D-day badges) + Past

### 12. Places (`/places`)
- Bookmarked places sorted by visit count
- Auto-bookmark when creating records with location
- Category tags: 🍽️ Food, ☕ Cafe, 🎬 Culture, 🌿 Nature, 📌 Other

### 13. Stats (`/stats`)
- Total records + days together summary
- Monthly date count bar chart (6 months)
- Top 5 places ranking
- Mood analysis with percentage bars

### 14. Settings (`/settings`)
- **Profile** — Emoji picker + status message ("오늘의 한마디")
- **Birthday** — Date input with 🎂 badge
- **Push Notifications** — Toggle with SW subscription
- **Test Notification** — Admin only (user1)
- **Invite Code** — Copy button
- **Logout**

### 15. Auth (`/auth/login`, `/auth/signup`)
- Email + password
- Heart logo + "오늘우리" branding
- PWA install banner on login page

### 16. Couple Space (`/couple`)
- **Create tab** — Set start date + nickname → Get 6-digit invite code
- **Join tab** — Enter invite code + nickname → Connect

---

## Special Features
- **PWA** — manifest.json, Service Worker, iOS home screen add
- **Push Notifications** — Daily D-day, anniversary reminders (D-7/3/1/0), calendar events, planner reminders, new letter alerts
- **Pull-to-Refresh** — Custom touch-based (direction detection to avoid conflict with horizontal swipe)
- **Skeleton Loading** — Home, Records, Calendar pages
- **Memory Cache** — Stale-while-revalidate pattern, 5min TTL
- **User2 Independent** — App works with single user, penpal activates after partner joins

---

## What We Want from Stitch
We're looking for UI/UX improvement suggestions for:
1. **Overall visual polish** — More premium, emotional feel (reference: "Emotional Minimalism" / "Digital Keepsake" aesthetic)
2. **Home dashboard layout** — Better hierarchy and breathing room
3. **Record cards** — More magazine/editorial style
4. **Letter experience** — More intimate, tactile feeling
5. **Calendar** — Cleaner, more visual date markers
6. **Wallet dashboard** — More engaging progress visualization
7. **Color palette refinement** — Warmer, more sophisticated tones
8. **Typography pairing** — Better serif + sans balance
9. **Micro-interactions** — Subtle animations for delight
10. **Dark mode** — Evening/night usage consideration
