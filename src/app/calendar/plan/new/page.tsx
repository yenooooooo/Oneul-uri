"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDatePlans } from "@/hooks/useDatePlans";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

/** Suspense 래퍼 — useSearchParams는 Suspense 필요 */
export default function NewPlanPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream" />}>
      <NewPlanForm />
    </Suspense>
  );
}

/**
 * 새 플래너 생성 폼 — /calendar/plan/new?date=YYYY-MM-DD
 * 제목 + 날짜 입력 후 플래너 상세 페이지로 이동
 */
function NewPlanForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialDate = searchParams.get("date") ?? new Date().toISOString().split("T")[0];

  const { createPlan } = useDatePlans();
  const [title, setTitle] = useState(""); // 플래너 제목
  const [date, setDate] = useState(initialDate); // 날짜
  const [loading, setLoading] = useState(false); // 로딩

  /** 생성 후 상세 페이지로 이동 */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const planId = await createPlan({ title, date });
    if (planId) {
      router.replace(`/calendar/plan/${planId}`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* 상단 바 */}
      <div className="flex items-center gap-3 px-4 py-3">
        <button onClick={() => router.back()} className="p-1">
          <ArrowLeft className="w-5 h-5 text-txt-primary" />
        </button>
        <h1 className="text-lg font-bold text-txt-primary">새 데이트 플래너</h1>
      </div>

      <form onSubmit={handleSubmit} className="px-4 space-y-4">
        {/* 제목 */}
        <div className="space-y-1.5">
          <Label htmlFor="plan-title">데이트 제목</Label>
          <Input
            id="plan-title"
            placeholder="예: 홍대 데이트, 제주도 여행 Day1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="rounded-xl"
          />
        </div>

        {/* 날짜 */}
        <div className="space-y-1.5">
          <Label htmlFor="plan-date">날짜</Label>
          <Input
            id="plan-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="rounded-xl"
          />
        </div>

        <Button
          type="submit"
          disabled={loading || !title}
          className="w-full rounded-full bg-coral-500 hover:bg-coral-600 text-white"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "플래너 만들기"}
        </Button>
      </form>
    </div>
  );
}
