"use client";

import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import { useDateRecords } from "@/hooks/useDateRecords";
import { useCouple } from "@/hooks/useCouple";
import { getMonthlyStats, getTopPlaces, getMoodStats } from "@/lib/stats";
import { calculateDday } from "@/lib/utils";
import { ArrowLeft, Loader2, BarChart3, MapPin, Heart } from "lucide-react";

/**
 * 기록 통계 대시보드 — /stats
 * 월별 횟수 차트 + 장소 TOP5 + 감정 분석 + 요약
 */
export default function StatsPage() {
  const router = useRouter();
  const { records, loading, totalCount } = useDateRecords();
  const { couple } = useCouple();

  const totalDays = couple ? calculateDday(couple.start_date) : 0;
  const monthly = getMonthlyStats(records);
  const topPlaces = getTopPlaces(records);
  const moods = getMoodStats(records);
  const maxMonthly = Math.max(...monthly.map((m) => m.count), 1);

  return (
    <AppLayout>
      <div className="px-4 pt-4 pb-6 space-y-5">
        {/* 상단 바 */}
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1">
            <ArrowLeft className="w-5 h-5 text-txt-primary" />
          </button>
          <h1 className="text-lg font-bold text-txt-primary">우리의 통계</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-coral-400" />
          </div>
        ) : (
          <>
            {/* 요약 카드 */}
            <div className="bg-white rounded-2xl p-5 shadow-soft text-center">
              <Heart className="w-6 h-6 text-coral-400 fill-coral-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-coral-400">{totalCount}</p>
              <p className="text-sm text-txt-secondary">번의 데이트를 기록했어요</p>
              <p className="text-xs text-txt-tertiary mt-1">
                {totalDays}일 동안 함께한 우리의 이야기
              </p>
            </div>

            {/* 월별 데이트 횟수 바 차트 */}
            <section className="bg-white rounded-2xl p-5 shadow-soft">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-coral-400" />
                <h2 className="font-semibold text-txt-primary">월별 데이트</h2>
              </div>
              <div className="flex items-end justify-between gap-2 h-32">
                {monthly.map((m) => (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                    {/* 바 */}
                    <div className="w-full flex justify-center">
                      <div
                        className="w-8 bg-coral-300 rounded-t-lg transition-all"
                        style={{
                          height: `${Math.max((m.count / maxMonthly) * 100, 4)}px`,
                        }}
                      />
                    </div>
                    {/* 횟수 */}
                    <span className="text-xs font-semibold text-coral-400">
                      {m.count}
                    </span>
                    {/* 월 라벨 */}
                    <span className="text-[10px] text-txt-tertiary">{m.label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 자주 가는 장소 TOP 5 */}
            {topPlaces.length > 0 && (
              <section className="bg-white rounded-2xl p-5 shadow-soft">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-coral-400" />
                  <h2 className="font-semibold text-txt-primary">자주 가는 곳 TOP {topPlaces.length}</h2>
                </div>
                <div className="space-y-2.5">
                  {topPlaces.map((place, i) => (
                    <div key={place.name} className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        i === 0 ? "bg-coral-400 text-white"
                          : i === 1 ? "bg-coral-200 text-coral-600"
                            : "bg-cream-dark text-txt-secondary"
                      }`}>
                        {i + 1}
                      </span>
                      <span className="flex-1 text-sm text-txt-primary">{place.name}</span>
                      <span className="text-xs text-txt-tertiary">{place.count}회</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 감정 분석 */}
            {moods.length > 0 && (
              <section className="bg-white rounded-2xl p-5 shadow-soft">
                <h2 className="font-semibold text-txt-primary mb-3">데이트 감정</h2>
                <div className="space-y-2">
                  {moods.map((m) => (
                    <div key={m.value} className="flex items-center gap-3">
                      <span className="text-xl">{m.emoji}</span>
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-0.5">
                          <span className="text-txt-secondary">{m.label}</span>
                          <span className="text-txt-tertiary">{m.count}회 ({m.percent}%)</span>
                        </div>
                        <div className="h-2 bg-cream-dark rounded-full overflow-hidden">
                          <div
                            className="h-full bg-coral-300 rounded-full"
                            style={{ width: `${m.percent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
