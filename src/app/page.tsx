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
import { Loader2, ChevronRight, PenSquare, Dices, Settings, ClipboardList } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";

/**
 * 홈 페이지 — /
 * D-day 카운터 + 다가오는 기념일 + 최근 기록 요약
 * 커플 스페이스가 없으면 /couple로 리다이렉트
 * user2 미연결 시에도 정상 표시 + 초대 배너 노출
 */
export default function HomePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const {
    couple, loading: coupleLoading,
    myNickname, partnerNickname, isPartnerConnected, inviteCode,
  } = useCouple();
  const { upcoming, generateAutoAnniversaries } = useAnniversary();
  const { records, loading: recordsLoading } = useDateRecords();
  const { activeGoal } = useWallet();
  const { upcomingPlan } = useDatePlans();

  // 커플 스페이스가 없으면 설정 페이지로 이동
  useEffect(() => {
    if (!authLoading && !coupleLoading && user && !couple) {
      router.push("/couple");
    }
  }, [authLoading, coupleLoading, user, couple, router]);

  // 자동 기념일 생성
  useEffect(() => {
    if (couple) generateAutoAnniversaries();
  }, [couple]);

  // 로딩 중 표시
  if (authLoading || coupleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Loader2 className="w-8 h-8 animate-spin text-coral-400" />
      </div>
    );
  }

  if (!couple) return null;

  // 최근 데이트 기록 3개
  const recentRecords = records.slice(0, 3);

  // 상단 인사 텍스트 — user2 미연결 시 닉네임만 표시
  const greetingText = isPartnerConnected
    ? `${myNickname} & ${partnerNickname}`
    : `${myNickname}의 오늘우리`;

  return (
    <AppLayout>
      <div className="px-4 pt-6 space-y-4 animate-fade-up">
        {/* 상단 인사 + 로그아웃 */}
        <div className="flex items-center justify-between">
          <div className="w-8" />
          <p className="text-sm text-txt-secondary">{greetingText}</p>
          <Link href="/settings" className="p-2 text-txt-tertiary hover:text-coral-400">
            <Settings className="w-4 h-4" />
          </Link>
        </div>

        {/* user2 미연결 시 초대 배너 */}
        {!isPartnerConnected && inviteCode && (
          <InviteBanner inviteCode={inviteCode} />
        )}

        {/* D-day 카운터 카드 */}
        <DdayCard startDate={couple.start_date} />

        {/* 다가오는 데이트 플래너 */}
        {upcomingPlan && (
          <Link href={`/calendar/plan/${upcomingPlan.id}`}
            className="block bg-white rounded-2xl p-4 shadow-soft active:scale-[0.98] transition-transform">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-coral-100 rounded-full flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-coral-400" />
              </div>
              <div>
                <p className="text-xs text-coral-400 font-medium">다가오는 데이트</p>
                <p className="font-semibold text-txt-primary text-sm">
                  {formatDate(upcomingPlan.date, "short")} {upcomingPlan.title}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-txt-tertiary ml-auto" />
            </div>
          </Link>
        )}

        {/* 다가오는 기념일 */}
        <section className="bg-white rounded-3xl p-5 shadow-soft">
          <Link href="/anniversary" className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-txt-primary">
              다가오는 기념일
            </h2>
            <ChevronRight className="w-4 h-4 text-txt-tertiary" />
          </Link>

          {upcoming.length > 0 ? (
            <div className="divide-y divide-coral-50">
              {upcoming.slice(0, 3).map((a) => (
                <AnniversaryCard key={a.id} anniversary={a} compact />
              ))}
            </div>
          ) : (
            <p className="text-sm text-txt-tertiary text-center py-4">
              기념일을 등록해보세요
            </p>
          )}
        </section>

        {/* 최근 데이트 기록 */}
        <section className="bg-white rounded-3xl p-5 shadow-soft">
          <Link href="/records" className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-txt-primary">
              최근 데이트
            </h2>
            <ChevronRight className="w-4 h-4 text-txt-tertiary" />
          </Link>

          {recordsLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin text-coral-300" />
            </div>
          ) : recentRecords.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-1 px-1">
              {recentRecords.map((record) => (
                <Link
                  key={record.id}
                  href={`/records/${record.id}`}
                  className="flex-shrink-0 w-32"
                >
                  <div className="w-32 h-24 rounded-xl overflow-hidden bg-cream-dark mb-1.5">
                    {record.photos?.[0] ? (
                      <img
                        src={record.photos[0]}
                        alt={record.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <PenSquare className="w-6 h-6 text-coral-200" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-medium text-txt-primary truncate">
                    {record.title}
                  </p>
                  <p className="text-xs text-txt-tertiary">
                    {formatDate(record.date, "short")}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-txt-tertiary text-center py-4">
              첫 번째 데이트를 기록해보세요
            </p>
          )}
        </section>

        {/* 통장 요약 + 룰렛 바로가기 */}
        <div className="grid grid-cols-2 gap-3">
          {/* 데이트 통장 요약 */}
          <Link href="/wallet" className="bg-white rounded-2xl p-4 shadow-soft active:scale-[0.98] transition-transform">
            <p className="text-xs text-txt-tertiary mb-1">데이트 통장</p>
            {activeGoal ? (
              <>
                <p className="text-sm font-semibold text-txt-primary truncate">
                  {activeGoal.title}
                </p>
                <div className="w-full h-2 bg-cream-dark rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-coral-400 rounded-full"
                    style={{
                      width: `${Math.min(Math.round((activeGoal.current_amount / activeGoal.target_amount) * 100), 100)}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-coral-400 mt-1">
                  {formatCurrency(activeGoal.current_amount)}
                </p>
              </>
            ) : (
              <p className="text-sm text-txt-secondary">목표를 설정해보세요</p>
            )}
          </Link>

          {/* 데이트 룰렛 바로가기 */}
          <Link href="/roulette" className="bg-white rounded-2xl p-4 shadow-soft flex flex-col items-center justify-center gap-2 active:scale-[0.98] transition-transform">
            <Dices className="w-8 h-8 text-coral-400" />
            <p className="text-sm font-semibold text-txt-primary">오늘 뭐 하지?</p>
            <p className="text-xs text-txt-tertiary">룰렛 돌리기</p>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
