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
import { Plus, Loader2, PiggyBank, ArrowDownCircle, Pencil, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

/**
 * 데이트 통장 페이지 — /wallet
 * 비행기 트래커 + 페이스 분석 + 마일스톤 + 입금 + 내역
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

  // 활성 목표의 페이스 분석
  const pace = activeGoal ? analyzePace(activeGoal) : null;

  // 활성 목표의 거래 내역만 필터링
  const goalTransactions = activeGoal
    ? transactions.filter((tx) => tx.goal_id === activeGoal.id)
    : [];

  return (
    <AppLayout>
      <div className="px-4 pt-6 space-y-4 animate-fade-up">
        <h1 className="text-2xl font-bold text-txt-primary">데이트 통장</h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-coral-400" />
          </div>
        ) : activeGoal ? (
          <>
            {/* 목표명 + 금액 */}
            <div className="bg-white rounded-3xl p-5 shadow-soft">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-base font-semibold text-txt-primary">
                  {activeGoal.title}
                </h2>
                <div className="flex gap-1">
                  <button onClick={() => setShowGoalEdit(true)} className="p-1.5 text-txt-tertiary">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setShowDeleteConfirm(true)} className="p-1.5 text-txt-tertiary hover:text-error">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <span className="text-2xl font-bold text-coral-400">
                  {formatCurrency(activeGoal.current_amount)}
                </span>
                <span className="text-sm text-txt-tertiary ml-1">
                  / {formatCurrency(activeGoal.target_amount)}
                </span>
              </div>

              {/* 비행기 트래커 프로그레스 바 */}
              <AirplaneTracker goal={activeGoal} />
            </div>

            {/* 페이스 분석 카드 */}
            {pace && <PaceAnalysisCard goal={activeGoal} pace={pace} />}

            {/* 입금 버튼 */}
            <button
              onClick={() => setShowDeposit(true)}
              className="w-full bg-coral-400 text-white rounded-2xl py-3.5 font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-card"
            >
              <ArrowDownCircle className="w-5 h-5" />
              입금하기
            </button>

            {/* 입출금 내역 */}
            <section className="bg-white rounded-3xl p-5 shadow-soft">
              <h2 className="text-base font-semibold text-txt-primary mb-3">
                입출금 내역
              </h2>
              <TransactionList
                transactions={goalTransactions}
                couple={couple}
                onUpdate={updateTransaction}
                onDelete={deleteTransaction}
              />
            </section>

            {/* 달성된 목표 */}
            {achievedGoals.length > 0 && (
              <section>
                <h2 className="text-base font-semibold text-txt-secondary mb-3">
                  달성한 목표
                </h2>
                <div className="space-y-3 opacity-80">
                  {achievedGoals.map((g) => (
                    <div key={g.id} className="bg-white rounded-2xl p-4 shadow-soft">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-txt-primary">{g.title}</span>
                        <span className="text-xs bg-green-soft/20 text-green-soft px-2 py-0.5 rounded-full">
                          달성!
                        </span>
                      </div>
                      <p className="text-sm text-txt-tertiary mt-1">
                        {formatCurrency(g.target_amount)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          /* 목표 없을 때 빈 상태 */
          <div className="text-center py-12">
            <PiggyBank className="w-16 h-16 text-coral-200 mx-auto mb-4" />
            <p className="font-medium text-txt-primary">저축 목표를 설정해보세요</p>
            <p className="text-sm text-txt-tertiary mt-1">함께 목표를 향해 모아봐요</p>
            <button
              onClick={() => setShowGoalForm(true)}
              className="mt-4 bg-coral-400 text-white rounded-full px-6 py-2.5 text-sm font-medium active:scale-95 transition-transform"
            >
              목표 설정하기
            </button>
          </div>
        )}
      </div>

      {/* FAB — 새 목표 추가 */}
      {activeGoal && (
        <button onClick={() => setShowGoalForm(true)}
          style={{ bottom: "calc(5rem + env(safe-area-inset-bottom, 0px))" }} className="fixed right-4 w-14 h-14 bg-coral-400 rounded-full shadow-float flex items-center justify-center text-white active:scale-95 transition-transform z-40">
          <Plus className="w-6 h-6" />
        </button>
      )}

      {/* 모달들 */}
      {showGoalForm && (
        <GoalCreateForm onSubmit={createGoal} onClose={() => setShowGoalForm(false)} />
      )}
      {showDeposit && activeGoal && (
        <DepositForm goalId={activeGoal.id}
          onSubmit={async (gId, amount, memo) => { await addTransaction({ goal_id: gId, amount, memo }); return null; }}
          onClose={() => setShowDeposit(false)} />
      )}
      {/* 목표 수정 모달 */}
      {showGoalEdit && activeGoal && (
        <GoalEditForm
          goal={activeGoal}
          onSubmit={(updates) => updateGoal(activeGoal.id, updates)}
          onClose={() => setShowGoalEdit(false)}
        />
      )}
      {/* 목표 삭제 확인 모달 */}
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
      {/* 마일스톤 축하 팝업 */}
      {newMilestone && (
        <MilestonePopup percent={newMilestone} onClose={clearMilestone} />
      )}
    </AppLayout>
  );
}
