"use client";

import { useState } from "react";
import type { CreatePetHealth, PetHealthType } from "@/types";
import { PET_HEALTH_TYPES } from "@/types/pet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  onSubmit: (data: CreatePetHealth) => Promise<boolean>;
  onClose: () => void;
}

/**
 * 건강 기록 추가 모달 — 종류, 날짜, 제목, 병원, 비용, 다음 예정일
 */
export default function PetHealthAddForm({ onSubmit, onClose }: Props) {
  const [type, setType] = useState<PetHealthType>("vaccination");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [title, setTitle] = useState("");
  const [hospital, setHospital] = useState("");
  const [cost, setCost] = useState("");
  const [nextDate, setNextDate] = useState("");
  const [memo, setMemo] = useState("");
  const [saving, setSaving] = useState(false);

  /** 폼 제출 */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const ok = await onSubmit({
      type, date, title,
      hospital: hospital || undefined,
      cost: cost ? Number(cost) : undefined,
      next_date: nextDate || undefined,
      memo: memo || undefined,
    });
    setSaving(false);
    if (ok) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-cream flex flex-col">
      <div className="flex-1 w-full max-w-lg mx-auto overflow-y-auto p-6 space-y-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold font-serif-ko">건강 기록</h3>
          <button onClick={onClose} className="p-1 text-txt-tertiary"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* 종류 선택 */}
          <div className="space-y-1">
            <Label>종류</Label>
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
              {(Object.entries(PET_HEALTH_TYPES) as [PetHealthType, { emoji: string; label: string }][]).map(([key, ht]) => (
                <button key={key} type="button" onClick={() => setType(key)}
                  className={cn("flex-shrink-0 px-3 py-2 rounded-xl text-xs font-medium transition-colors",
                    type === key ? "bg-coral-500 text-white" : "bg-surface-low text-txt-secondary"
                  )}>{ht.emoji} {ht.label}</button>
              ))}
            </div>
          </div>

          {/* 날짜 */}
          <div className="space-y-1">
            <Label htmlFor="health-date">날짜</Label>
            <Input id="health-date" type="date" value={date}
              onChange={(e) => setDate(e.target.value)} required className="rounded-xl" />
          </div>

          {/* 제목 */}
          <div className="space-y-1">
            <Label htmlFor="health-title">제목</Label>
            <Input id="health-title" placeholder="예: 광견병 예방접종" value={title}
              onChange={(e) => setTitle(e.target.value)} required className="rounded-xl" />
          </div>

          {/* 병원 */}
          <div className="space-y-1">
            <Label htmlFor="health-hospital">병원 (선택)</Label>
            <Input id="health-hospital" placeholder="병원명" value={hospital}
              onChange={(e) => setHospital(e.target.value)} className="rounded-xl" />
          </div>

          {/* 비용 + 다음 예정일 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="health-cost">비용 (선택)</Label>
              <Input id="health-cost" type="number" placeholder="원" value={cost}
                onChange={(e) => setCost(e.target.value)} className="rounded-xl" />
            </div>
            <div className="space-y-1 overflow-hidden">
              <Label htmlFor="health-next">다음 예정일</Label>
              <Input id="health-next" type="date" value={nextDate}
                onChange={(e) => setNextDate(e.target.value)} className="rounded-xl w-full" />
            </div>
          </div>

          {/* 메모 */}
          <div className="space-y-1">
            <Label htmlFor="health-memo">메모 (선택)</Label>
            <textarea id="health-memo" placeholder="특이사항"
              value={memo} onChange={(e) => setMemo(e.target.value)} rows={2}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>

          <Button type="submit" disabled={saving || !title}
            className="w-full rounded-full bg-coral-500 hover:bg-coral-600 text-white py-3">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "저장하기"}
          </Button>
        </form>
      </div>
    </div>
  );
}
