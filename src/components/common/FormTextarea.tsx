"use client";

import { cn } from "@/lib/utils";

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

/**
 * 통일된 폼 텍스트영역 — 라벨 + textarea
 * min-h-[120px] rounded-xl bg-white border-gray-200 focus:coral resize-none
 */
export default function FormTextarea({ label, className, id, ...props }: FormTextareaProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={cn(
          "w-full min-h-[120px] rounded-xl border border-gray-200 bg-white px-4 py-3 text-base",
          "transition-colors duration-200 outline-none resize-none",
          "placeholder:text-muted-foreground",
          "focus:border-coral-500 focus:ring-1 focus:ring-coral-500/20",
          className
        )}
        {...props}
      />
    </div>
  );
}
