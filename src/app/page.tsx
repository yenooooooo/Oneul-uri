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
import { Loader2, ChevronRight, PenSquare, Dices, Settings, ClipboardList, MapPin } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";

/**
 * 홈 페이지 — Editorial Keepsake 스타일
 * 넓은 여백 + 큰 섹션 + 감정의 온도 차이
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
    if (!authLoading && !coupleLoading && user && !couple) {
      router.push("/couple");
    }
  }, [authLoading, coupleLoading, user, couple, router]);

  useEffect(() => {
    if (couple) generateAutoAnniversaries();
  }, [couple]);

  if (authLoading || coupleLoading) {
    return <AppLayout><HomeSkeleton /></AppLayout>;
  }

  if (!couple) return null;

  const recentRecords = records.slice(0, 3);

  return (
    <AppLayout>
      <div className="px-6 pt-8 space-y-8 animate-page-in">
        {/* 상단 설정 */}
        <div className="flex justify-end -mb-4">
          <Link href="/settings" className="p-2 text-txt-tertiary">
            <Settings className="w-5 h-5" />
          </Link>
        </div>

        {/* 커플 프로필 */}
        <CoupleProfileCard
          myEmoji={myEmoji ?? "💙"} myNickname={myNickname ?? "나"}
          myStatus={myStatus ?? ""} partnerEmoji={partnerEmoji}
          partnerNickname={partnerNickname} partnerStatus={partnerStatus}
          isPartnerConnected={isPartnerConnected}
        />

        {/* 초대 배너 */}
        {!isPartnerConnected && inviteCode && (
          <InviteBanner inviteCode={inviteCode} />
        )}

        {/* D-day — 감정의 중심 */}
        <DdayCard startDate={couple.start_date} />

        {/* 다가오는 플래너 */}
        {upcomingPlan && (
          <Link href={`/calendar/plan/${upcomingPlan.id}`}
            className="block bg-surface-low rounded-3xl p-6 active:scale-[0.97] transition-transform">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-coral-100 rounded-2xl flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-coral-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-coral-500 font-medium">다가오는 데이트</p>
                <p className="font-serif-ko font-semibold text-txt-primary mt-0.5">
                  {formatDate(upcomingPlan.date, "short")} {upcomingPlan.title}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-txt-tertiary" />
            </div>
          </Link>
        )}

        {/* 다가오는 기념일 */}
        <section className="bg-surface-low rounded-3xl p-6">
          <Link href="/anniversary" className="flex items-center justify-between mb-4">
            <h2 className="font-serif-ko text-lg font-semibold text-txt-primary">
              다가오는 기념일
            </h2>
            <ChevronRight className="w-5 h-5 text-txt-tertiary" />
          </Link>
          {upcoming.length > 0 ? (
            <div className="space-y-2">
              {upcoming.slice(0, 3).map((a) => (
                <AnniversaryCard key={a.id} anniversary={a} compact />
              ))}
            </div>
          ) : (
            <p className="text-sm text-txt-tertiary text-center py-6">
              기념일을 등록해보세요
            </p>
          )}
        </section>

        {/* 최근 기록 — 큰 카드 */}
        <section className="bg-surface-low rounded-3xl p-6">
          <Link href="/records" className="flex items-center justify-between mb-4">
            <h2 className="font-serif-ko text-lg font-semibold text-txt-primary">
              최근 데이트
            </h2>
            <ChevronRight className="w-5 h-5 text-txt-tertiary" />
          </Link>
          {recordsLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="w-5 h-5 animate-spin text-coral-300" />
            </div>
          ) : recentRecords.length > 0 ? (
            <div className="space-y-3">
              {recentRecords.map((record) => (
                <Link key={record.id} href={`/records/${record.id}`}
                  className="block rounded-2xl overflow-hidden active:scale-[0.98] transition-transform">
                  {record.photos?.[0] ? (
                    <div className="aspect-[2/1] relative">
                      <img src={record.photos[0]} alt={record.title}
                        className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4">
                        <p className="font-serif-ko font-semibold text-white text-base">
                          {record.title}
                        </p>
                        <p className="text-xs text-white/70 mt-0.5">
                          {formatDate(record.date, "short")}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-surface-high rounded-2xl p-4 flex items-center gap-3">
                      <PenSquare className="w-5 h-5 text-coral-300" />
                      <div>
                        <p className="text-sm font-medium text-txt-primary">{record.title}</p>
                        <p className="text-xs text-txt-tertiary">{formatDate(record.date, "short")}</p>
                      </div>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-txt-tertiary text-center py-6">
              첫 번째 데이트를 기록해보세요
            </p>
          )}
        </section>

        {/* 통장 + 룰렛 — 큰 그리드 */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/wallet"
            className="bg-surface-low rounded-3xl p-6 active:scale-[0.97] transition-transform">
            <p className="text-xs text-txt-tertiary mb-2">데이트 통장</p>
            {activeGoal ? (
              <>
                <p className="font-serif-ko text-xl font-bold text-coral-500">
                  {formatCurrency(activeGoal.current_amount)}
                </p>
                <div className="w-full h-2 bg-surface-high rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-coral-500 rounded-full"
                    style={{ width: `${Math.min(Math.round((activeGoal.current_amount / activeGoal.target_amount) * 100), 100)}%` }} />
                </div>
                <p className="text-[11px] text-txt-tertiary mt-1.5">
                  {activeGoal.title}
                </p>
              </>
            ) : (
              <p className="text-sm text-txt-secondary mt-1">목표를 설정해보세요</p>
            )}
          </Link>

          <Link href="/roulette"
            className="bg-surface-low rounded-3xl p-6 flex flex-col items-center justify-center gap-3 active:scale-[0.97] transition-transform">
            <Dices className="w-10 h-10 text-coral-400" />
            <div className="text-center">
              <p className="font-semibold text-txt-primary">오늘 뭐 하지?</p>
              <p className="text-xs text-txt-tertiary mt-0.5">룰렛 돌리기</p>
            </div>
          </Link>
        </div>

        {/* 바로가기 — 넉넉한 간격 */}
        <div className="space-y-3">
          <Link href="/places" className="block bg-surface-low rounded-2xl p-5 active:scale-[0.97] transition-transform">
            <div className="flex items-center gap-4">
              <MapPin className="w-5 h-5 text-coral-400" />
              <p className="text-sm font-medium text-txt-primary flex-1">우리가 자주 가는 곳</p>
              <ChevronRight className="w-4 h-4 text-txt-tertiary" />
            </div>
          </Link>
          <Link href="/memos" className="block bg-surface-low rounded-2xl p-5 active:scale-[0.97] transition-transform">
            <div className="flex items-center gap-4">
              <span className="text-lg">📝</span>
              <p className="text-sm font-medium text-txt-primary flex-1">메모장</p>
              <ChevronRight className="w-4 h-4 text-txt-tertiary" />
            </div>
          </Link>
          <Link href="/stats" className="block bg-surface-low rounded-2xl p-5 active:scale-[0.97] transition-transform">
            <div className="flex items-center gap-4">
              <span className="text-lg">📊</span>
              <p className="text-sm font-medium text-txt-primary flex-1">우리의 통계</p>
              <ChevronRight className="w-4 h-4 text-txt-tertiary" />
            </div>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
