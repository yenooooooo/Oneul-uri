"use client";

import { useState } from "react";
import type { CreatePetHealth, PetHealthType } from "@/types";
import { PET_HEALTH_TYPES } from "@/types/pet";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import FormInput from "@/components/common/FormInput";
import FormTextarea from "@/components/common/FormTextarea";
import FormDatePicker from "@/components/common/FormDatePicker";
import FormCategorySelect from "@/components/common/FormCategorySelect";

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
      <div className="flex-1 w-full max-w-lg mx-auto overflow-y-auto px-4 py-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold font-serif-ko">건강 기록</h3>
          <button onClick={onClose} className="p-1 text-txt-tertiary"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 종류 선택 */}
          <FormCategorySelect label="종류" value={type}
            onChange={(v) => setType(v as PetHealthType)}
            options={Object.entries(PET_HEALTH_TYPES).map(([key, ht]) => ({
              value: key, label: ht.label, emoji: ht.emoji,
            }))} />

          {/* 날짜 */}
          <FormDatePicker id="health-date" label="날짜" value={date}
            onChange={(e) => setDate(e.target.value)} required />

          {/* 제목 */}
          <FormInput id="health-title" label="제목" placeholder="예: 광견병 예방접종"
            value={title} onChange={(e) => setTitle(e.target.value)} required />

          {/* 병원 */}
          <FormInput id="health-hospital" label="병원 (선택)" placeholder="병원명"
            value={hospital} onChange={(e) => setHospital(e.target.value)} />

          {/* 비용 + 다음 예정일 */}
          <div className="grid grid-cols-2 gap-3">
            <FormInput id="health-cost" label="비용 (선택)" type="number"
              placeholder="원" value={cost} onChange={(e) => setCost(e.target.value)} />
            <FormDatePicker id="health-next" label="다음 예정일"
              value={nextDate} onChange={(e) => setNextDate(e.target.value)} />
          </div>

          {/* 메모 */}
          <FormTextarea id="health-memo" label="메모 (선택)" placeholder="특이사항"
            value={memo} onChange={(e) => setMemo(e.target.value)} rows={2} />

          <Button type="submit" disabled={saving || !title}
            className="w-full rounded-full bg-coral-500 hover:bg-coral-600 text-white py-3">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "저장하기"}
          </Button>
        </form>
      </div>
    </div>
  );
}
