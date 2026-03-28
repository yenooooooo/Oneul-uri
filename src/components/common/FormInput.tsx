"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode; // 왼쪽 아이콘 (선택)
}

/**
 * 통일된 폼 텍스트 입력 — 라벨 + Input
 * h-12 px-4 rounded-xl bg-white border-gray-200 focus:coral
 */
export default function FormInput({ label, icon, className, id, ...props }: FormInputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      {icon ? (
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
          <Input id={id} className={cn("pl-10", className)} {...props} />
        </div>
      ) : (
        <Input id={id} className={className} {...props} />
      )}
    </div>
  );
}
