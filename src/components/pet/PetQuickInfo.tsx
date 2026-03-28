"use client";

import type { Pet, PetHealth } from "@/types";
import { formatDate } from "@/lib/utils";

interface Props {
  pet: Pet;
  upcomingHealth: PetHealth[];
}

/**
 * 퀵 정보 카드 — 가로 스크롤 미니 카드 4종
 * 생일, 입양일, 몸무게, 다음 건강 일정
 */
export default function PetQuickInfo({ pet, upcomingHealth }: Props) {
  // 다음 건강 일정 (가장 가까운 것)
  const nextHealth = upcomingHealth[0] ?? null;

  /** 정보 카드 데이터 */
  const cards = [
    pet.birthday && {
      emoji: "🎂", label: "생일",
      value: formatDate(pet.birthday, "short"),
      color: "bg-pink-50 border-pink-100",
    },
    pet.adoption_date && {
      emoji: "🏠", label: "입양일",
      value: formatDate(pet.adoption_date, "short"),
      color: "bg-amber-50 border-amber-100",
    },
    pet.weight_kg && {
      emoji: "⚖️", label: "몸무게",
      value: `${pet.weight_kg}kg`,
      color: "bg-blue-50 border-blue-100",
    },
    nextHealth && {
      emoji: "💉", label: "다음 일정",
      value: `${formatDate(nextHealth.next_date!, "short")}`,
      sub: nextHealth.title,
      color: "bg-green-50 border-green-100",
    },
  ].filter(Boolean) as Array<{ emoji: string; label: string; value: string; sub?: string; color: string }>;

  if (cards.length === 0) return null;

  return (
    <section className="flex overflow-x-auto scrollbar-hide gap-3 -mx-6 px-6 pb-1">
      {cards.map((card) => (
        <div key={card.label}
          className={`flex-none w-32 rounded-2xl p-4 border ${card.color}`}>
          <span className="text-xl">{card.emoji}</span>
          <p className="text-[10px] text-txt-tertiary font-bold mt-2">{card.label}</p>
          <p className="text-sm font-bold text-txt-primary mt-0.5">{card.value}</p>
          {card.sub && (
            <p className="text-[10px] text-txt-secondary truncate mt-0.5">{card.sub}</p>
          )}
        </div>
      ))}
    </section>
  );
}
