"use client";

import { cn } from "@/lib/utils";

interface CategoryOption {
  value: string;
  label: string;
  emoji?: string;
}

interface FormCategorySelectProps {
  label?: string;
  options: CategoryOption[];
  value: string;
  onChange: (value: string) => void;
}

/**
 * 통일된 카테고리/태그 선택 버튼 — 가로 스크롤
 * 선택: bg-coral-500 text-white / 비선택: bg-gray-100 text-gray-500
 */
export default function FormCategorySelect({
  label, options, value, onChange,
}: FormCategorySelectProps) {
  return (
    <div className="space-y-2">
      {label && (
        <span className="text-sm font-medium text-gray-700">{label}</span>
      )}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200",
              value === opt.value
                ? "bg-coral-500 text-white"
                : "bg-gray-100 text-gray-500"
            )}
          >
            {opt.emoji && <span className="mr-1">{opt.emoji}</span>}
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
