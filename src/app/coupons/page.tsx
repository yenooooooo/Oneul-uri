"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import CouponCard from "@/components/coupon/CouponCard";
import CouponCreateModal from "@/components/coupon/CouponCreateModal";
import CouponGiveModal from "@/components/coupon/CouponGiveModal";
import { useCoupons } from "@/hooks/useCoupons";
import { useCouple } from "@/hooks/useCouple";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Plus, Trophy, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 쿠폰함 페이지 — /coupons
 * 내 쿠폰 / 준 쿠폰 / 사용 기록 탭 + 쿠폰 등록/지급
 */
export default function CouponsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { couple } = useCouple();
  const {
    types, myCoupons, givenCoupons, usedCoupons, loading,
    createType, giveCoupon, useCoupon: redeemCoupon, deleteCoupon, deleteType,
  } = useCoupons();

  const [tab, setTab] = useState<"mine" | "given" | "history">("mine");
  const [showCreate, setShowCreate] = useState(false);
  const [showGive, setShowGive] = useState(false);

  return (
    <AppLayout>
      <div className="px-6 pt-6 space-y-8 animate-page-in">
        {/* 상단 */}
        <div>
          <button onClick={() => router.back()} className="p-1 mb-2">
            <ArrowLeft className="w-5 h-5 text-txt-primary" />
          </button>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-txt-tertiary tracking-widest uppercase">
                COUPLE COUPONS
              </p>
              <h1 className="font-serif-ko text-3xl font-black text-txt-primary">
                쿠폰함
              </h1>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowCreate(true)}
                className="bg-surface-low p-2.5 rounded-2xl text-txt-tertiary active:scale-95">
                <Plus className="w-5 h-5" />
              </button>
              <button onClick={() => setShowGive(true)}
                className="bg-coral-500 p-2.5 rounded-2xl text-white active:scale-95">
                <Trophy className="w-5 h-5" />
              </button>
            </div>
          </div>
          <p className="text-sm text-txt-tertiary mt-2">
            내기에서 이기면 쿠폰을 획득해요
          </p>
        </div>

        {/* 내 쿠폰 개수 요약 */}
        <div className="flex gap-4">
          <div className="flex-1 bg-gradient-to-br from-coral-100 to-coral-50 rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold font-serif-ko text-coral-600">{myCoupons.length}</p>
            <p className="text-xs text-coral-400 font-medium mt-1">사용 가능</p>
          </div>
          <div className="flex-1 bg-surface-low rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold font-serif-ko text-txt-secondary">{givenCoupons.length}</p>
            <p className="text-xs text-txt-tertiary font-medium mt-1">상대방 보유</p>
          </div>
          <div className="flex-1 bg-surface-low rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold font-serif-ko text-txt-tertiary">{usedCoupons.length}</p>
            <p className="text-xs text-txt-tertiary font-medium mt-1">사용 완료</p>
          </div>
        </div>

        {/* 탭 */}
        <div className="flex gap-2">
          {[
            { key: "mine" as const, label: "내 쿠폰", count: myCoupons.length },
            { key: "given" as const, label: "준 쿠폰", count: givenCoupons.length },
            { key: "history" as const, label: "기록", count: usedCoupons.length },
          ].map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-medium transition-all",
                tab === t.key ? "bg-coral-500 text-white" : "bg-surface-low text-txt-tertiary"
              )}>
              {t.label} {t.count > 0 && `(${t.count})`}
            </button>
          ))}
        </div>

        {/* 쿠폰 리스트 */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-coral-300" />
          </div>
        ) : (
          <div className="space-y-3">
            {tab === "mine" && (myCoupons.length > 0 ? (
              myCoupons.map((c) => (
                <CouponCard key={c.id} coupon={c} couple={couple} isMine
                  onUse={() => redeemCoupon(c.id)}
                  onDelete={() => deleteCoupon(c.id)} />
              ))
            ) : (
              <EmptyState icon="🎟️" message="아직 쿠폰이 없어요" sub="내기에서 이겨서 쿠폰을 획득해보세요!" />
            ))}

            {tab === "given" && (givenCoupons.length > 0 ? (
              givenCoupons.map((c) => (
                <CouponCard key={c.id} coupon={c} couple={couple} isMine={false}
                  onDelete={() => deleteCoupon(c.id)} />
              ))
            ) : (
              <EmptyState icon="🎁" message="준 쿠폰이 없어요" sub="내기에서 지면 쿠폰을 줘야 해요!" />
            ))}

            {tab === "history" && (usedCoupons.length > 0 ? (
              usedCoupons.map((c) => (
                <CouponCard key={c.id} coupon={c} couple={couple}
                  isMine={c.winner_id === user?.id} />
              ))
            ) : (
              <EmptyState icon="📋" message="사용 기록이 없어요" sub="쿠폰을 사용하면 여기에 기록돼요" />
            ))}
          </div>
        )}
      </div>

      {/* 모달들 */}
      {showCreate && (
        <CouponCreateModal onSubmit={createType} onClose={() => setShowCreate(false)} />
      )}
      {showGive && couple && user && types.length > 0 && (
        <CouponGiveModal types={types} couple={couple} userId={user.id}
          onSubmit={giveCoupon} onDeleteType={deleteType}
          onClose={() => setShowGive(false)} />
      )}
    </AppLayout>
  );
}

/** 빈 상태 컴포넌트 */
function EmptyState({ icon, message, sub }: { icon: string; message: string; sub: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12">
      <span className="text-5xl mb-4">{icon}</span>
      <p className="font-medium text-txt-secondary">{message}</p>
      <p className="text-sm text-txt-tertiary mt-1">{sub}</p>
    </div>
  );
}
