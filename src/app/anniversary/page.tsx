"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import AnniversaryCard from "@/components/common/AnniversaryCard";
import AnniversaryAddForm from "@/components/common/AnniversaryAddForm";
import { useAnniversary } from "@/hooks/useAnniversary";
import { ArrowLeft, Plus, Loader2, Sparkles } from "lucide-react";

/**
 * 기념일 관리 페이지 — /anniversary
 * 다가오는 기념일 + 지난 기념일 섹션, 자동 생성 + 커스텀 추가
 */
export default function AnniversaryPage() {
  const router = useRouter();
  const {
    upcoming, past, loading,
    generateAutoAnniversaries, addAnniversary, deleteAnniversary,
  } = useAnniversary();
  const [showAdd, setShowAdd] = useState(false); // 추가 폼 표시
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null); // 삭제 확인 대상 ID

  // 삭제 확인 모달 열릴 때 스크롤 방지
  useEffect(() => {
    if (deleteTarget) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [deleteTarget]);

  // 페이지 진입 시 자동 기념일 생성 (없으면)
  useEffect(() => {
    generateAutoAnniversaries();
  }, []);

  return (
    <AppLayout>
      <div className="px-4 pt-4 pb-6 space-y-6">
        {/* 상단 바 */}
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()} className="p-1">
            <ArrowLeft className="w-5 h-5 text-txt-primary" />
          </button>
          <h1 className="text-lg font-bold text-txt-primary">기념일</h1>
          <button onClick={() => setShowAdd(true)} className="p-1 text-coral-400">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-coral-400" />
          </div>
        ) : (
          <>
            {/* 다가오는 기념일 */}
            <section>
              <h2 className="text-base font-semibold text-txt-primary mb-3 flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-coral-400" />
                다가오는 기념일
              </h2>
              {upcoming.length > 0 ? (
                <div className="space-y-2">
                  {upcoming.map((a) => (
                    <AnniversaryCard
                      key={a.id}
                      anniversary={a}
                      onDelete={setDeleteTarget}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-txt-tertiary text-center py-6">
                  다가오는 기념일이 없어요
                </p>
              )}
            </section>

            {/* 지난 기념일 */}
            {past.length > 0 && (
              <section>
                <h2 className="text-base font-semibold text-txt-secondary mb-3">
                  지난 기념일
                </h2>
                <div className="space-y-2 opacity-70">
                  {past.map((a) => (
                    <AnniversaryCard
                      key={a.id}
                      anniversary={a}
                      onDelete={setDeleteTarget}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      {/* 커스텀 기념일 추가 모달 */}
      {showAdd && (
        <AnniversaryAddForm
          onSubmit={addAnniversary}
          onClose={() => setShowAdd(false)}
        />
      )}

      {/* 삭제 확인 모달 */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center px-6">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs text-center space-y-4">
            <p className="font-semibold text-txt-primary">정말 삭제할까요?</p>
            <p className="text-sm text-txt-secondary">삭제하면 되돌릴 수 없어요</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-full bg-gray-100 text-txt-secondary font-medium">취소</button>
              <button onClick={() => { deleteAnniversary(deleteTarget); setDeleteTarget(null); }}
                className="flex-1 py-2.5 rounded-full bg-red-500 text-white font-medium">삭제</button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
