"use client";

import Link from "next/link";
import type { Pet } from "@/types";
import { calculateDday } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface Props {
  pet: Pet;
}

/**
 * 홈 대시보드용 반려견 카드 — 그라데이션 배경 + 사진/이모지 + D-day
 */
export default function PetProfileCard({ pet }: Props) {
  // 입양 D-day 계산
  const adoptionDday = pet.adoption_date ? Math.abs(calculateDday(pet.adoption_date)) + 1 : null;

  return (
    <Link href="/pet"
      className="block bg-gradient-to-br from-amber-50 via-white to-green-50/50 rounded-3xl p-5 active:scale-[0.97] transition-transform">
      <div className="flex items-center gap-4">
        {/* 프로필 사진/이모지 */}
        <div className="w-16 h-16 rounded-full overflow-hidden bg-white shadow-soft border-2 border-white flex-shrink-0">
          {pet.photo_url ? (
            <img src={pet.photo_url} alt={pet.name}
              className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl bg-amber-50">
              🐶
            </div>
          )}
        </div>

        {/* 정보 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-txt-primary">{pet.name}</h4>
            {pet.breed && (
              <span className="text-xs text-txt-tertiary bg-surface-low px-2 py-0.5 rounded-full truncate">
                {pet.breed}
              </span>
            )}
          </div>
          {adoptionDday && (
            <p className="text-sm text-coral-500 font-bold mt-0.5">
              🏠 함께한 지 {adoptionDday}일
            </p>
          )}
          {pet.personality && (
            <p className="text-xs text-txt-secondary mt-0.5 truncate italic">
              &ldquo;{pet.personality}&rdquo;
            </p>
          )}
        </div>

        <ChevronRight className="w-5 h-5 text-txt-tertiary flex-shrink-0" />
      </div>
    </Link>
  );
}
