"use client";

import { Button } from "@/components/ui/button";
import { Calendar, RotateCcw, Check } from "lucide-react";

/** RouletteResult 컴포넌트 props */
interface RouletteResultProps {
  result: string;
  onRetry: () => void;
  onAddToCalendar?: () => void;
  calendarAdded?: boolean; // 캘린더 추가 완료 여부
}

/**
 * 룰렛 결과 카드 — 선택된 결과 + 다시 돌리기/캘린더 추가 버튼
 * 캘린더 추가 완료 시 버튼이 "추가됨"으로 변경
 */
export default function RouletteResult({
  result,
  onRetry,
  onAddToCalendar,
  calendarAdded = false,
}: RouletteResultProps) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-card text-center animate-fade-up">
      <p className="text-sm text-txt-tertiary mb-2">오늘의 선택!</p>
      <p className="text-3xl font-bold text-coral-400 mb-4">{result}</p>

      <div className="flex gap-3 justify-center">
        <Button
          onClick={onRetry}
          variant="outline"
          className="rounded-full border-coral-200 text-coral-400"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          다시 돌리기
        </Button>
        {onAddToCalendar && !calendarAdded && (
          <Button
            onClick={onAddToCalendar}
            className="rounded-full bg-coral-500 hover:bg-coral-600 text-white"
          >
            <Calendar className="w-4 h-4 mr-1" />
            캘린더에 추가
          </Button>
        )}
        {calendarAdded && (
          <Button disabled className="rounded-full bg-green-soft text-white">
            <Check className="w-4 h-4 mr-1" />
            추가됨
          </Button>
        )}
      </div>
    </div>
  );
}
