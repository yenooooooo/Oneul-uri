"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import MemoCard from "@/components/common/MemoCard";
import { useMemos } from "@/hooks/useMemos";
import { useCouple } from "@/hooks/useCouple";
import { MEMO_CATEGORIES } from "@/types/memo";
import type { MemoCategory } from "@/types/memo";
import { ArrowLeft, Plus, Loader2, StickyNote } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CATEGORY_KEYS = Object.keys(MEMO_CATEGORIES) as MemoCategory[];

/**
 * 메모장 목록 페이지 — /memos
 * 카테고리 필터 + 메모 카드 그리드 + 새 메모 추가
 */
export default function MemosPage() {
  const router = useRouter();
  const { memos, loading, createMemo } = useMemos();
  const { couple } = useCouple();
  const [filter, setFilter] = useState<MemoCategory | "all">("all");
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<MemoCategory>("free");

  /** 새 메모 생성 */
  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    const id = await createMemo(newTitle.trim(), newCategory);
    if (id) {
      setNewTitle("");
      setShowAdd(false);
      router.push(`/memos/${id}`);
    }
  };

  // 필터링된 메모
  const filtered = filter === "all"
    ? memos
    : memos.filter((m) => m.category === filter);

  return (
    <AppLayout>
      <div className="px-4 pt-4 pb-6 space-y-4">
        {/* 상단 바 */}
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()} className="p-1">
            <ArrowLeft className="w-5 h-5 text-txt-primary" />
          </button>
          <h1 className="text-lg font-bold text-txt-primary">메모장</h1>
          <button onClick={() => setShowAdd(!showAdd)} className="p-1 text-coral-400">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* 새 메모 추가 폼 */}
        {showAdd && (
          <div className="bg-surface-low rounded-2xl space-y-3">
            <Input placeholder="메모 제목" value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              className="rounded-xl" />
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
              {CATEGORY_KEYS.map((key) => {
                const cat = MEMO_CATEGORIES[key];
                return (
                  <button key={key} type="button" onClick={() => setNewCategory(key)}
                    className={cn(
                      "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border",
                      newCategory === key
                        ? "bg-coral-50 border-coral-300 text-coral-500"
                        : "bg-white border-cream-dark text-txt-secondary"
                    )}>
                    {cat.emoji} {cat.label}
                  </button>
                );
              })}
            </div>
            <Button onClick={handleCreate} disabled={!newTitle.trim()}
              className="w-full rounded-full bg-coral-400 hover:bg-coral-500 text-white">
              만들기
            </Button>
          </div>
        )}

        {/* 카테고리 필터 */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
          <button onClick={() => setFilter("all")}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border",
              filter === "all" ? "bg-coral-400 text-white border-coral-400" : "bg-white border-cream-dark text-txt-secondary"
            )}>
            전체
          </button>
          {CATEGORY_KEYS.map((key) => {
            const cat = MEMO_CATEGORIES[key];
            return (
              <button key={key} onClick={() => setFilter(key)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border",
                  filter === key ? "bg-coral-400 text-white border-coral-400" : "bg-white border-cream-dark text-txt-secondary"
                )}>
                {cat.emoji} {cat.label}
              </button>
            );
          })}
        </div>

        {/* 메모 목록 */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-coral-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16">
            <StickyNote className="w-12 h-12 text-coral-200 mb-3" />
            <p className="text-txt-secondary font-medium">아직 메모가 없어요</p>
            <p className="text-sm text-txt-tertiary mt-1">
              + 버튼으로 첫 메모를 만들어보세요
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((memo) => (
              <MemoCard key={memo.id} memo={memo} couple={couple} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
