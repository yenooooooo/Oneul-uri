"use client";

import { useState } from "react";
import Link from "next/link";
import { usePet } from "@/hooks/usePet";
import AppLayout from "@/components/layout/AppLayout";
import PetHeroProfile from "@/components/pet/PetHeroProfile";
import PetQuickInfo from "@/components/pet/PetQuickInfo";
import PetDiaryTimeline from "@/components/pet/PetDiaryTimeline";
import PetDiaryAddForm from "@/components/pet/PetDiaryAddForm";
import PetHealthList from "@/components/pet/PetHealthList";
import PetHealthAddForm from "@/components/pet/PetHealthAddForm";
import PetTagSection from "@/components/pet/PetTagSection";
import PetRegisterForm from "@/components/pet/PetRegisterForm";
import { ArrowLeft, Loader2 } from "lucide-react";

/**
 * 반려견 페이지 — /pet
 * 히어로 프로필 + 퀵정보 + 일기 + 건강 + 태그
 */
export default function PetPage() {
  const {
    pet, diaries, healthRecords, upcomingHealth, loading,
    createPet, updatePet, addDiary, deleteDiary, addHealth, deleteHealth,
  } = usePet();

  const [showRegister, setShowRegister] = useState(false); // 등록/수정 폼
  const [showDiaryForm, setShowDiaryForm] = useState(false); // 일기 작성
  const [showHealthForm, setShowHealthForm] = useState(false); // 건강 기록 추가
  const [isEdit, setIsEdit] = useState(false); // 수정 모드 여부

  /** 수정 버튼 핸들러 */
  const handleEdit = () => { setIsEdit(true); setShowRegister(true); };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-6 h-6 animate-spin text-coral-400" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="px-6 pt-6 space-y-8 animate-page-in">
        {/* 상단 네비 */}
        <div className="flex items-center gap-3">
          <Link href="/" className="p-1 text-txt-tertiary"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-xl font-bold font-serif-ko text-txt-primary">우리 아이</h1>
        </div>

        {!pet ? (
          /* 미등록 상태 — 등록 유도 */
          <div className="flex flex-col items-center py-16 space-y-4">
            <div className="text-6xl animate-bounce">🐶</div>
            <h2 className="text-xl font-bold font-serif-ko text-txt-primary">반려견을 등록해보세요</h2>
            <p className="text-sm text-txt-secondary text-center">우리 아이의 성장을 함께 기록해요</p>
            <button onClick={() => { setIsEdit(false); setShowRegister(true); }}
              className="mt-4 px-8 py-3 bg-coral-500 text-white rounded-full font-bold active:scale-95 transition-transform">
              등록하기
            </button>
          </div>
        ) : (
          /* 등록된 상태 — 전체 섹션 */
          <>
            <PetHeroProfile pet={pet} onEdit={handleEdit} />
            <PetQuickInfo pet={pet} upcomingHealth={upcomingHealth} />
            <PetDiaryTimeline diaries={diaries} onAdd={() => setShowDiaryForm(true)} onDelete={deleteDiary} />
            <PetHealthList records={healthRecords} upcoming={upcomingHealth} onAdd={() => setShowHealthForm(true)} onDelete={deleteHealth} />
            <PetTagSection likes={pet.likes ?? []} dislikes={pet.dislikes ?? []} />
            {/* 하단 여백 */}
            <div className="h-8" />
          </>
        )}
      </div>

      {/* 모달: 등록/수정 */}
      {showRegister && (
        <PetRegisterForm
          isEdit={isEdit}
          initialData={isEdit && pet ? {
            name: pet.name, breed: pet.breed ?? undefined,
            birthday: pet.birthday ?? undefined, adoption_date: pet.adoption_date ?? undefined,
            gender: pet.gender, weight_kg: pet.weight_kg ?? undefined,
            personality: pet.personality ?? undefined,
            likes: pet.likes ?? [], dislikes: pet.dislikes ?? [],
          } : undefined}
          onSubmit={async (data) => {
            if (isEdit) { await updatePet(data); return pet?.id ?? null; }
            return await createPet(data);
          }}
          onClose={() => setShowRegister(false)}
        />
      )}

      {/* 모달: 일기 작성 */}
      {showDiaryForm && (
        <PetDiaryAddForm onSubmit={addDiary} onClose={() => setShowDiaryForm(false)} />
      )}

      {/* 모달: 건강 기록 */}
      {showHealthForm && (
        <PetHealthAddForm onSubmit={addHealth} onClose={() => setShowHealthForm(false)} />
      )}
    </AppLayout>
  );
}
