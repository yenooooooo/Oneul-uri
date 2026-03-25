"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { STICKER_CATEGORIES } from "@/lib/stickers";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface StickerPickerModalProps {
  date: string; // 선택된 날짜 (YYYY-MM-DD)
  currentSticker: string | null; // 현재 붙어있는 스티커 ID
  onSelect: (stickerId: string) => Promise<boolean>;
  onRemove: () => Promise<boolean>;
  onClose: () => void;
}

/**
 * 스티커 선택 바텀시트 모달
 * 카테고리 탭 + 스티커 그리드 + 붙이기/제거 버튼
 */
export default function StickerPickerModal({
  date, currentSticker, onSelect, onRemove, onClose,
}: StickerPickerModalProps) {
  const [category, setCategory] = useState(STICKER_CATEGORIES[0].id);
  const [selected, setSelected] = useState<string | null>(currentSticker);

  const activeCategory = STICKER_CATEGORIES.find((c) => c.id === category);

  /** 붙이기 */
  const handleApply = async () => {
    if (!selected) return;
    const ok = await onSelect(selected);
    if (ok) onClose();
  };

  /** 제거 */
  const handleRemove = async () => {
    const ok = await onRemove();
    if (ok) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30"
      onClick={onClose}>
      <div className="bg-white w-full max-w-lg rounded-t-3xl max-h-[70vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-high">
          <div>
            <p className="text-xs text-txt-tertiary">{formatDate(date, "long")}</p>
            <h3 className="font-serif-ko text-lg font-bold text-txt-primary">스티커 붙이기</h3>
          </div>
          <button onClick={onClose} className="p-1 text-txt-tertiary">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 카테고리 탭 — 가로 스크롤 */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide px-6 py-3">
          {STICKER_CATEGORIES.map((cat) => (
            <button key={cat.id} onClick={() => setCategory(cat.id)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                category === cat.id
                  ? "bg-coral-500 text-white"
                  : "bg-surface-low text-txt-tertiary"
              )}>
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        {/* 스티커 그리드 */}
        <div className="flex-1 overflow-y-auto px-6 py-3">
          <div className="grid grid-cols-4 gap-3">
            {activeCategory?.stickers.map((sticker) => (
              <button key={sticker.id}
                onClick={() => setSelected(sticker.id)}
                className={cn(
                  "flex flex-col items-center gap-1 p-3 rounded-2xl transition-all",
                  selected === sticker.id
                    ? "bg-coral-50 ring-2 ring-coral-500 scale-105"
                    : "bg-surface-low active:scale-95"
                )}>
                <span className="text-3xl">{sticker.emoji}</span>
                <span className="text-[10px] text-txt-tertiary font-medium">{sticker.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex gap-3 px-6 py-4 border-t border-surface-high">
          {currentSticker && (
            <button onClick={handleRemove}
              className="flex-1 py-3 rounded-full border border-coral-200 text-coral-500 text-sm font-medium">
              제거
            </button>
          )}
          <button onClick={handleApply}
            disabled={!selected}
            className="flex-1 py-3 rounded-full bg-coral-500 text-white text-sm font-medium disabled:opacity-40">
            붙이기
          </button>
        </div>
      </div>
    </div>
  );
}
