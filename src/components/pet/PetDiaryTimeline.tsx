"use client";

import { useState } from "react";
import type { PetDiary, PetDiaryCategory } from "@/types";
import { PET_DIARY_CATEGORIES } from "@/types/pet";
import { formatDate } from "@/lib/utils";
import { Plus, Trash2, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import FadeImage from "@/components/common/FadeImage";

interface Props {
  diaries: PetDiary[];
  onAdd: () => void;
  onEdit: (diary: PetDiary) => void;
  onDelete: (id: string) => void;
}

/**
 * 성장 일기 타임라인 — 카테고리 필터 + 세로 타임라인
 */
export default function PetDiaryTimeline({ diaries, onAdd, onEdit, onDelete }: Props) {
  const [filter, setFilter] = useState<PetDiaryCategory | "all">("all"); // 카테고리 필터
  const [expanded, setExpanded] = useState<string | null>(null); // 펼친 일기 ID

  // 필터 적용
  const filtered = filter === "all"
    ? diaries
    : diaries.filter((d) => d.category === filter);

  return (
    <section className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-serif-ko font-bold text-txt-primary">성장 다이어리</h3>
        <button onClick={onAdd}
          className="w-8 h-8 bg-coral-500 rounded-full flex items-center justify-center text-white">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        <button onClick={() => setFilter("all")}
          className={cn("px-3 py-1.5 rounded-full text-xs font-medium flex-shrink-0 transition-colors",
            filter === "all" ? "bg-coral-500 text-white" : "bg-surface-low text-txt-secondary"
          )}>전체</button>
        {(Object.entries(PET_DIARY_CATEGORIES) as [PetDiaryCategory, { emoji: string; label: string }][]).map(([key, cat]) => (
          <button key={key} onClick={() => setFilter(key)}
            className={cn("px-3 py-1.5 rounded-full text-xs font-medium flex-shrink-0 transition-colors",
              filter === key ? "bg-coral-500 text-white" : "bg-surface-low text-txt-secondary"
            )}>{cat.emoji} {cat.label}</button>
        ))}
      </div>

      {/* 타임라인 */}
      {filtered.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-4xl mb-3">🐾</p>
          <p className="text-sm text-txt-tertiary">첫 다이어리를 작성해보세요</p>
        </div>
      ) : (
        <div className="relative pl-6">
          {/* 타임라인 세로선 */}
          <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-coral-100" />

          <div className="space-y-4">
            {filtered.map((diary) => {
              const cat = PET_DIARY_CATEGORIES[diary.category];
              return (
                <div key={diary.id} className="relative">
                  {/* 타임라인 도트 */}
                  <div className="absolute -left-6 top-3 w-4 h-4 rounded-full bg-coral-400 border-2 border-white" />

                  <div className="bg-white rounded-2xl p-4 shadow-soft active:bg-gray-50 transition-colors"
                    onClick={() => setExpanded(expanded === diary.id ? null : diary.id)}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs bg-coral-50 px-2 py-0.5 rounded-full">{cat.emoji} {cat.label}</span>
                          <span className="text-xs text-txt-tertiary">{formatDate(diary.date, "short")}</span>
                        </div>
                        <h4 className="font-bold text-sm text-txt-primary">{diary.title}</h4>
                        {diary.content && (
                          <p className={cn("text-xs text-txt-secondary mt-1", expanded === diary.id ? "" : "line-clamp-2")}>{diary.content}</p>
                        )}
                      </div>
                      {/* 수정/삭제 — 펼쳤을 때만 표시 */}
                      {expanded === diary.id && (
                        <div className="flex gap-1 ml-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => onEdit(diary)}
                            className="p-1.5 text-txt-tertiary">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => onDelete(diary.id)}
                            className="p-1.5 text-txt-tertiary">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                    {/* 사진 미리보기 — 1장이면 크게, 여러 장이면 그리드 */}
                    {diary.photos?.length === 1 && (
                      <FadeImage src={diary.photos[0]} alt=""
                        className="w-full h-40 rounded-xl mt-3" />
                    )}
                    {diary.photos?.length > 1 && (
                      <div className="grid grid-cols-3 gap-1.5 mt-3">
                        {diary.photos.slice(0, 3).map((url, i) => (
                          <FadeImage key={`${diary.id}-${i}`} src={url} alt=""
                            className="w-full rounded-xl" aspect="1/1" />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
