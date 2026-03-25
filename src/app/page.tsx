"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useCouple } from "@/hooks/useCouple";
import { useAnniversary } from "@/hooks/useAnniversary";
import { useDateRecords } from "@/hooks/useDateRecords";
import { useWallet } from "@/hooks/useWallet";
import { useDatePlans } from "@/hooks/useDatePlans";
import AppLayout from "@/components/layout/AppLayout";
import DdayCard from "@/components/common/DdayCard";
import AnniversaryCard from "@/components/common/AnniversaryCard";
import InviteBanner from "@/components/common/InviteBanner";
import CoupleProfileCard from "@/components/common/CoupleProfileCard";
import HomeSkeleton from "@/components/common/HomeSkeleton";
import { Loader2, ChevronRight, Settings, ClipboardList, MapPin, StickyNote, BarChart3, Heart } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";

/**
 * 홈 — stitch(2) Editorial Keepsake 레이아웃
 */
export default function HomePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const {
    couple, loading: coupleLoading,
    myNickname, partnerNickname,
    myEmoji, partnerEmoji, myStatus, partnerStatus,
    isPartnerConnected, inviteCode,
  } = useCouple();
  const { upcoming, generateAutoAnniversaries } = useAnniversary();
  const { records, loading: recordsLoading } = useDateRecords();
  const { activeGoal } = useWallet();
  const { upcomingPlan } = useDatePlans();

  useEffect(() => {
    if (!authLoading && !coupleLoading && user && !couple) router.push("/couple");
  }, [authLoading, coupleLoading, user, couple, router]);

  useEffect(() => { if (couple) generateAutoAnniversaries(); }, [couple]);

  if (authLoading || coupleLoading) {
    return <AppLayout><HomeSkeleton /></AppLayout>;
  }
  if (!couple) return null;

  const recentRecords = records.slice(0, 5);

  return (
    <AppLayout>
      {/* 상단 헤더 — fixed 글래스모피즘 */}
      <header className="fixed top-0 w-full z-40 bg-white/70 backdrop-blur-2xl flex justify-between items-center px-6 py-4 max-w-lg mx-auto left-0 right-0">
        <h1 className="text-2xl font-bold font-serif-ko text-coral-500">오늘우리</h1>
        <Link href="/settings" className="p-2 text-txt-tertiary">
          <Settings className="w-5 h-5" />
        </Link>
      </header>

      <div className="pt-20 px-6 space-y-12 animate-page-in">
        {/* 초대 배너 */}
        {!isPartnerConnected && inviteCode && <InviteBanner inviteCode={inviteCode} />}

        {/* D-day — 좌측 정렬 초대형 */}
        <DdayCard startDate={couple.start_date} />

        {/* 커플 프로필 — 이모지 겹침 + 그라데이션 */}
        <CoupleProfileCard
          myEmoji={myEmoji ?? "💙"} myNickname={myNickname ?? "나"}
          myStatus={myStatus ?? ""} partnerEmoji={partnerEmoji}
          partnerNickname={partnerNickname} partnerStatus={partnerStatus}
          isPartnerConnected={isPartnerConnected}
        />

        {/* 플래너 + 기념일 — 2열 그리드 */}
        <div className="grid grid-cols-2 gap-4">
          {/* 다음 데이트 */}
          <div className="bg-coral-50/30 p-6 rounded-3xl space-y-3">
            <h3 className="text-sm font-bold text-txt-tertiary flex items-center gap-1.5">
              <ClipboardList className="w-4 h-4 text-coral-500" />
              다음 데이트
            </h3>
            {upcomingPlan ? (
              <Link href={`/calendar/plan/${upcomingPlan.id}`}>
                <p className="font-serif-ko font-bold leading-tight">
                  {formatDate(upcomingPlan.date, "short")}<br />{upcomingPlan.title}
                </p>
                <p className="text-coral-500 font-bold text-sm mt-2 flex items-center">
                  자세히 보기 <ChevronRight className="w-4 h-4" />
                </p>
              </Link>
            ) : (
              <Link href="/calendar">
                <p className="text-sm text-txt-tertiary">아직 계획이 없어요</p>
                <p className="text-coral-500 font-bold text-sm mt-2">플래너 만들기</p>
              </Link>
            )}
          </div>

          {/* 다가오는 기념일 */}
          <div className="bg-surface-low p-6 rounded-3xl space-y-3 overflow-hidden">
            <h3 className="text-sm font-bold text-txt-tertiary flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-coral-500" />
              기념일
            </h3>
            <div className="space-y-2">
              {upcoming.length > 0 ? (
                upcoming.slice(0, 3).map((a) => (
                  <AnniversaryCard key={a.id} anniversary={a} compact />
                ))
              ) : (
                <p className="text-sm text-txt-tertiary">등록해보세요</p>
              )}
            </div>
          </div>
        </div>

        {/* 최근 기록 — 가로 스크롤 큰 카드 */}
        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <h3 className="text-lg font-serif-ko font-bold">최근의 기록</h3>
            <Link href="/records" className="text-xs text-txt-tertiary font-medium">
              모두 보기
            </Link>
          </div>

          {recordsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-coral-300" />
            </div>
          ) : recentRecords.length > 0 ? (
            <div className="flex overflow-x-auto scrollbar-hide gap-4 -mx-6 px-6 items-end">
              {recentRecords.map((record) => (
                record.photos?.[0] ? (
                  /* 사진 기록 — 큰 세로 카드 */
                  <Link key={record.id} href={`/records/${record.id}`}
                    className="flex-none w-64 h-80 relative rounded-2xl overflow-hidden active:scale-[0.97] transition-transform">
                    <img src={record.photos[0]} alt={record.title}
                      className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-5">
                      <span className="text-white/60 text-[10px] font-medium mb-1">
                        {formatDate(record.date, "dot")}
                      </span>
                      <h4 className="text-white font-bold leading-tight">{record.title}</h4>
                    </div>
                  </Link>
                ) : (
                  /* 글 기록 — 작은 메모지 카드 */
                  <Link key={record.id} href={`/records/${record.id}`}
                    className="flex-none w-48 h-44 bg-surface-low rounded-2xl p-5 flex flex-col justify-between active:scale-[0.97] transition-transform">
                    <p className="font-serif-ko text-sm text-txt-secondary italic leading-relaxed line-clamp-3">
                      {record.memo
                        ? `\u201C${record.memo}\u201D`
                        : record.title}
                    </p>
                    <div>
                      <p className="text-xs font-semibold text-txt-primary truncate">{record.title}</p>
                      <p className="text-[10px] text-txt-tertiary mt-0.5">
                        {formatDate(record.date, "dot")}
                      </p>
                    </div>
                  </Link>
                )
              ))}
            </div>
          ) : (
            <p className="text-sm text-txt-tertiary text-center py-8">
              첫 번째 데이트를 기록해보세요
            </p>
          )}
        </section>

        {/* 통장 + 룰렛 — 정사각형 그리드 */}
        <section className="grid grid-cols-2 gap-4">
          <Link href="/wallet"
            className="bg-surface-high p-6 rounded-3xl flex flex-col justify-between aspect-square active:scale-[0.97] transition-transform">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-lg">💰</span>
            </div>
            <div>
              <h4 className="text-xs text-txt-tertiary font-bold mb-1">커플 통장</h4>
              <p className="text-xl font-bold text-txt-primary">
                {activeGoal ? formatCurrency(activeGoal.current_amount) : "목표 설정"}
              </p>
            </div>
          </Link>

          <Link href="/roulette"
            className="bg-coral-500 p-6 rounded-3xl flex flex-col justify-between aspect-square text-white active:scale-[0.97] transition-transform">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-lg">🎲</span>
            </div>
            <div>
              <h4 className="text-xs text-white/70 font-bold mb-1">메뉴 결정</h4>
              <p className="text-xl font-bold">룰렛 돌리기</p>
            </div>
          </Link>
        </section>

        {/* 바로가기 — 원형 아이콘 가로 4개 */}
        <section className="flex justify-between items-center py-4">
          <Link href="/places" className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-full bg-surface-low flex items-center justify-center active:bg-surface-high transition-colors">
              <MapPin className="w-5 h-5 text-txt-tertiary" />
            </div>
            <span className="text-xs font-bold text-txt-tertiary">자주 가는 곳</span>
          </Link>
          <Link href="/memos" className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-full bg-surface-low flex items-center justify-center active:bg-surface-high transition-colors">
              <StickyNote className="w-5 h-5 text-txt-tertiary" />
            </div>
            <span className="text-xs font-bold text-txt-tertiary">메모장</span>
          </Link>
          <Link href="/stats" className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-full bg-surface-low flex items-center justify-center active:bg-surface-high transition-colors">
              <BarChart3 className="w-5 h-5 text-txt-tertiary" />
            </div>
            <span className="text-xs font-bold text-txt-tertiary">통계</span>
          </Link>
          <Link href="/anniversary" className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-full bg-surface-low flex items-center justify-center active:bg-surface-high transition-colors">
              <Heart className="w-5 h-5 text-txt-tertiary" />
            </div>
            <span className="text-xs font-bold text-txt-tertiary">기념일</span>
          </Link>
        </section>
      </div>
    </AppLayout>
  );
}
