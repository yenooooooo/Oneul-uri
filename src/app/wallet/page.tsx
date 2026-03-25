"use client";

import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import AirplaneTracker from "@/components/wallet/AirplaneTracker";
import PaceAnalysisCard from "@/components/wallet/PaceAnalysisCard";
import GoalCreateForm from "@/components/wallet/GoalCreateForm";
import GoalEditForm from "@/components/wallet/GoalEditForm";
import DepositForm from "@/components/wallet/DepositForm";
import TransactionList from "@/components/wallet/TransactionList";
import MilestonePopup from "@/components/wallet/MilestonePopup";
import { useWallet } from "@/hooks/useWallet";
import { useCouple } from "@/hooks/useCouple";
import { Plus, Loader2, PiggyBank, Pencil, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

/**
 * 데이트 통장 — stitch(6) Editorial Keepsake 스타일
 */
export default function WalletPage() {
  const {
    activeGoal, achievedGoals, transactions, loading,
    newMilestone, clearMilestone,
    createGoal, updateGoal, deleteGoal,
    addTransaction, updateTransaction, deleteTransaction, analyzePace,
  } = useWallet();
  const { couple } = useCouple();
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showGoalEdit, setShowGoalEdit] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const pace = activeGoal ? analyzePace(activeGoal) : null;
  const progress = activeGoal
    ? Math.min(Math.round((activeGoal.current_amount / activeGoal.target_amount) * 100), 100) : 0;
  const goalTx = activeGoal
    ? transactions.filter((tx) => tx.goal_id === activeGoal.id) : [];

  return (
    <AppLayout>
      <div className="px-6 pt-6 space-y-8 animate-page-in">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-coral-300" />
          </div>
        ) : activeGoal ? (
          <>
            {/* 상단 타이틀 + 달성률 뱃지 */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold text-txt-tertiary tracking-widest uppercase">
                  저축 목표
                </p>
                <h1 className="font-serif-ko text-3xl font-black text-txt-primary">
                  {activeGoal.title}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-coral-50 text-coral-500 text-xs font-bold px-3 py-1 rounded-full">
                  {progress}% 달성
                </span>
                <button onClick={() => setShowGoalEdit(true)} className="p-1.5 text-txt-tertiary">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => setShowDeleteConfirm(true)} className="p-1.5 text-txt-tertiary">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 잔액 카드 — 코랄 그라데이션 */}
            <div className="bg-gradient-to-br from-coral-100 to-coral-50 rounded-3xl p-8 relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-sm text-coral-600 font-medium mb-2">현재 모은 금액</p>
                <p className="font-serif-ko text-4xl font-black text-coral-600 mb-1">
                  ₩ {activeGoal.current_amount.toLocaleString("ko-KR")}
                </p>
                <p className="text-sm text-coral-400">
                  목표 {formatCurrency(activeGoal.target_amount)}
                </p>
              </div>
              {/* 배경 장식 */}
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-coral-200/30 rounded-full blur-2xl" />
            </div>

            {/* 프로그레스 트래커 */}
            <AirplaneTracker goal={activeGoal} />

            {/* 페이스 분석 */}
            {pace && (
              <section className="space-y-3">
                <h3 className="text-sm font-bold text-txt-tertiary">페이스 분석</h3>
                <PaceAnalysisCard goal={activeGoal} pace={pace} />
              </section>
            )}

            {/* 입금 버튼 — 큰 코랄 */}
            <button onClick={() => setShowDeposit(true)}
              className="w-full bg-coral-500 text-white rounded-2xl py-4 font-semibold text-lg flex items-center justify-center gap-2 active:scale-[0.97] transition-transform shadow-float">
              지금 저금하기!
            </button>

            {/* 최근 입금 내역 */}
            <section className="space-y-3">
              <h3 className="text-sm font-bold text-txt-tertiary">최근 입금 내역</h3>
              <div className="bg-surface-low rounded-3xl p-5">
                <TransactionList
                  transactions={goalTx} couple={couple}
                  onUpdate={updateTransaction} onDelete={deleteTransaction}
                />
              </div>
            </section>

            {/* 달성된 목표 */}
            {achievedGoals.length > 0 && (
              <section className="space-y-3">
                <h3 className="text-sm font-bold text-txt-tertiary">달성한 목표</h3>
                <div className="space-y-2">
                  {achievedGoals.map((g) => (
                    <div key={g.id} className="bg-surface-low rounded-2xl p-4 flex items-center justify-between">
                      <span className="font-medium text-txt-primary">{g.title}</span>
                      <span className="text-xs bg-green-soft/20 text-green-soft px-2 py-0.5 rounded-full font-bold">
                        달성!
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          /* 빈 상태 */
          <div className="text-center py-16">
            <PiggyBank className="w-16 h-16 text-coral-200 mx-auto mb-4" />
            <h2 className="font-serif-ko text-2xl font-bold text-txt-primary">저축 목표를 설정해보세요</h2>
            <p className="text-sm text-txt-tertiary mt-2">함께 목표를 향해 모아봐요</p>
            <button onClick={() => setShowGoalForm(true)}
              className="mt-6 bg-coral-500 text-white rounded-full px-8 py-3 font-medium active:scale-95 transition-transform">
              목표 설정하기
            </button>
          </div>
        )}
      </div>

      {/* FAB */}
      {activeGoal && (
        <button onClick={() => setShowGoalForm(true)}
          style={{ bottom: "calc(5.5rem + env(safe-area-inset-bottom, 0px))" }}
          className="fixed right-5 w-14 h-14 bg-coral-500 rounded-full shadow-float flex items-center justify-center text-white active:scale-95 transition-transform z-40">
          <Plus className="w-6 h-6" />
        </button>
      )}

      {/* 모달들 */}
      {showGoalForm && <GoalCreateForm onSubmit={createGoal} onClose={() => setShowGoalForm(false)} />}
      {showDeposit && activeGoal && (
        <DepositForm goalId={activeGoal.id}
          onSubmit={async (gId, amount, memo) => { await addTransaction({ goal_id: gId, amount, memo }); return null; }}
          onClose={() => setShowDeposit(false)} />
      )}
      {showGoalEdit && activeGoal && (
        <GoalEditForm goal={activeGoal}
          onSubmit={(updates) => updateGoal(activeGoal.id, updates)}
          onClose={() => setShowGoalEdit(false)} />
      )}
      {showDeleteConfirm && activeGoal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-6">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs text-center space-y-4">
            <p className="font-semibold text-txt-primary">이 목표를 삭제할까요?</p>
            <p className="text-sm text-txt-secondary">입출금 내역도 함께 삭제돼요.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-full border border-coral-200 text-txt-secondary text-sm">취소</button>
              <button onClick={async () => { await deleteGoal(activeGoal.id); setShowDeleteConfirm(false); }}
                className="flex-1 py-2.5 rounded-full bg-error text-white text-sm">삭제</button>
            </div>
          </div>
        </div>
      )}
      {newMilestone && <MilestonePopup percent={newMilestone} onClose={clearMilestone} />}
    </AppLayout>
  );
}
