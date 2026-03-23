"use client";

import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import RouletteWheel from "@/components/roulette/RouletteWheel";
import RouletteResult from "@/components/roulette/RouletteResult";
import { useRoulette } from "@/hooks/useRoulette";
import { useCalendar } from "@/hooks/useCalendar";
import { ROULETTE_CATEGORIES } from "@/lib/constants";
import { Plus, X, Loader2, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/**
 * 데이트 룰렛 페이지 — /roulette
 * 카테고리 탭 + 룰렛 휠 + 결과 + 히스토리
 */
export default function RoulettePage() {
  const {
    loading, history,
    getItemsByCategory, addItem, deleteItem, saveResult,
  } = useRoulette();
  const { addEvent } = useCalendar();

  const [category, setCategory] = useState("food"); // 현재 카테고리
  const [result, setResult] = useState<string | null>(null); // 룰렛 결과
  const [newItemLabel, setNewItemLabel] = useState(""); // 새 항목 입력값
  const [showItems, setShowItems] = useState(false); // 항목 관리 표시

  // 현재 카테고리의 항목
  const categoryItems = getItemsByCategory(category);

  /** 룰렛 결과 처리 */
  const handleResult = (label: string) => {
    setResult(label);
    saveResult(category, label);
  };

  const [addingToCalendar, setAddingToCalendar] = useState(false); // 캘린더 추가 중복 방지

  /** 캘린더에 결과 추가 — 중복 클릭 방지 */
  const handleAddToCalendar = async () => {
    if (!result || addingToCalendar) return;
    setAddingToCalendar(true);
    const today = new Date().toISOString().split("T")[0];
    await addEvent(result, today, "date");
  };

  /** 새 항목 추가 */
  const handleAddItem = async () => {
    if (!newItemLabel.trim()) return;
    const success = await addItem(category, newItemLabel.trim());
    if (success) setNewItemLabel("");
  };

  return (
    <AppLayout>
      <div className="px-4 pt-6 space-y-5">
        {/* 페이지 헤더 */}
        <h1 className="text-2xl font-bold text-txt-primary">데이트 룰렛</h1>

        {/* 카테고리 탭 */}
        <div className="flex gap-2">
          {ROULETTE_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => { setCategory(cat.value); setResult(null); }}
              className={cn(
                "flex-1 py-2.5 rounded-full text-sm font-medium transition-colors",
                category === cat.value
                  ? "bg-coral-400 text-white shadow-card"
                  : "bg-white text-txt-secondary shadow-soft"
              )}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-coral-400" />
          </div>
        ) : (
          <>
            {/* 룰렛 결과 카드 (결과가 있을 때) */}
            {result && (
              <RouletteResult
                result={result}
                onRetry={() => { setResult(null); setAddingToCalendar(false); }}
                onAddToCalendar={handleAddToCalendar}
                calendarAdded={addingToCalendar}
              />
            )}

            {/* 룰렛 휠 (결과가 없을 때) */}
            {!result && (
              <RouletteWheel items={categoryItems} onResult={handleResult} />
            )}

            {/* 항목 관리 토글 */}
            <button
              onClick={() => setShowItems(!showItems)}
              className="text-sm text-txt-secondary underline mx-auto block"
            >
              {showItems ? "항목 관리 닫기" : "항목 관리"}
            </button>

            {/* 항목 목록 + 추가/삭제 */}
            {showItems && (
              <div className="bg-white rounded-2xl p-4 shadow-soft space-y-3">
                {/* 새 항목 추가 */}
                <div className="flex gap-2">
                  <Input
                    placeholder="새 항목 입력"
                    value={newItemLabel}
                    onChange={(e) => setNewItemLabel(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
                    className="rounded-xl flex-1"
                  />
                  <button
                    onClick={handleAddItem}
                    className="w-10 h-10 bg-coral-400 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* 현재 항목 리스트 */}
                <div className="flex flex-wrap gap-2">
                  {categoryItems.map((item) => (
                    <span
                      key={item.id}
                      className="inline-flex items-center gap-1 bg-cream-dark rounded-full px-3 py-1 text-sm"
                    >
                      {item.label}
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="text-txt-tertiary hover:text-error"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 히스토리 */}
            {history.length > 0 && (
              <section className="bg-white rounded-3xl p-5 shadow-soft">
                <h2 className="text-base font-semibold text-txt-primary mb-3 flex items-center gap-1">
                  <Clock className="w-4 h-4 text-coral-400" />
                  최근 결과
                </h2>
                <div className="space-y-2">
                  {history.slice(0, 10).map((h) => (
                    <div key={h.id} className="flex items-center justify-between text-sm">
                      <span className="text-txt-primary">{h.result}</span>
                      <span className="text-xs text-txt-tertiary">
                        {formatDate(h.created_at.split("T")[0], "short")}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
