"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FormDatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

/**
 * 통일된 날짜 선택 필드 — 라벨 + date input
 * 브라우저 피커 아이콘 축소, 텍스트 왼쪽 정렬, 부모 overflow-hidden으로 넘침 방지
 */
export default function FormDatePicker({ label, className, id, ...props }: FormDatePickerProps) {
  return (
    <div className="space-y-2 overflow-hidden">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <Input
        id={id}
        type="date"
        className={cn(
          "w-full [&::-webkit-date-and-time-value]:text-left",
          "[&::-webkit-calendar-picker-indicator]:w-5 [&::-webkit-calendar-picker-indicator]:p-0 [&::-webkit-calendar-picker-indicator]:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  );
}
