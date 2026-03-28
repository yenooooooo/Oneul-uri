"use client";

import type { Pet } from "@/types";
import { calculateDday } from "@/lib/utils";
import { PET_GENDER_OPTIONS } from "@/lib/constants";
import { Pencil } from "lucide-react";
import FadeImage from "@/components/common/FadeImage";

interface Props {
  pet: Pet;
  onEdit: () => void;
}

/**
 * 반려견 히어로 프로필 — 큰 사진 + 이름/품종/D-day
 * 그라데이션 배경 + 라운드 카드
 */
export default function PetHeroProfile({ pet, onEdit }: Props) {
  // 입양 D-day 계산 (입양일이 있을 때만)
  const adoptionDday = pet.adoption_date ? calculateDday(pet.adoption_date) : null;

  // 나이 계산 (생일이 있을 때만)
  const age = pet.birthday ? Math.floor(
    (Date.now() - new Date(pet.birthday).getTime()) / (365.25 * 86400000)
  ) : null;

  // 성별 이모지
  const genderInfo = PET_GENDER_OPTIONS.find((g) => g.value === pet.gender);

  return (
    <section className="relative bg-gradient-to-br from-amber-50 via-coral-50/40 to-green-50/30 rounded-3xl overflow-hidden">
      {/* 수정 버튼 */}
      <button onClick={onEdit}
        className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center">
        <Pencil className="w-4 h-4 text-txt-secondary" />
      </button>

      <div className="flex flex-col items-center pt-8 pb-6 px-6">
        {/* 프로필 사진 */}
        <div className="w-28 h-28 rounded-full overflow-hidden bg-white shadow-card border-4 border-white">
          {pet.photo_url ? (
            <FadeImage src={pet.photo_url} alt={pet.name}
              className="w-full h-full rounded-full" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl bg-amber-50">
              🐶
            </div>
          )}
        </div>

        {/* 이름 + 품종 */}
        <h2 className="mt-4 text-2xl font-bold font-serif-ko text-txt-primary">{pet.name}</h2>
        <div className="flex items-center gap-2 mt-1">
          {pet.breed && (
            <span className="text-sm text-txt-secondary bg-white/60 px-3 py-0.5 rounded-full">
              {pet.breed}
            </span>
          )}
          {genderInfo && (
            <span className="text-sm">{genderInfo.emoji}</span>
          )}
          {age !== null && (
            <span className="text-sm text-txt-tertiary">{age}살</span>
          )}
          {pet.weight_kg && (
            <span className="text-sm text-txt-tertiary">{pet.weight_kg}kg</span>
          )}
        </div>

        {/* 입양 D-day */}
        {adoptionDday !== null && (
          <div className="mt-4 bg-white/70 backdrop-blur px-5 py-2 rounded-full">
            <span className="text-coral-500 font-bold text-sm">
              🏠 함께한 지 {Math.abs(adoptionDday) + 1}일
            </span>
          </div>
        )}

        {/* 성격 한마디 */}
        {pet.personality && (
          <p className="mt-3 text-sm text-txt-secondary italic text-center">
            &ldquo;{pet.personality}&rdquo;
          </p>
        )}
      </div>
    </section>
  );
}
