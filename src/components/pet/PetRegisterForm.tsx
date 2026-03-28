"use client";

import { useState } from "react";
import type { CreatePet, PetGender } from "@/types";
import { PET_GENDER_OPTIONS } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import FormInput from "@/components/common/FormInput";
import FormDatePicker from "@/components/common/FormDatePicker";

interface Props {
  onSubmit: (data: CreatePet) => Promise<string | null>;
  onClose: () => void;
  initialData?: Partial<CreatePet> & { likes?: string[]; dislikes?: string[] };
  isEdit?: boolean;
}

/**
 * 반려견 등록/수정 폼 — 전체 화면 모달
 */
export default function PetRegisterForm({ onSubmit, onClose, initialData, isEdit }: Props) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [breed, setBreed] = useState(initialData?.breed ?? "");
  const [birthday, setBirthday] = useState(initialData?.birthday ?? "");
  const [adoptionDate, setAdoptionDate] = useState(initialData?.adoption_date ?? "");
  const [gender, setGender] = useState<PetGender>(initialData?.gender ?? "unknown");
  const [weightKg, setWeightKg] = useState(initialData?.weight_kg?.toString() ?? "");
  const [personality, setPersonality] = useState(initialData?.personality ?? "");
  const [likes, setLikes] = useState<string[]>(initialData?.likes ?? []);
  const [dislikes, setDislikes] = useState<string[]>(initialData?.dislikes ?? []);
  const [likeInput, setLikeInput] = useState(""); // 좋아하는 것 입력
  const [dislikeInput, setDislikeInput] = useState(""); // 싫어하는 것 입력
  const [saving, setSaving] = useState(false);

  /** 태그 추가 핸들러 */
  const addTag = (type: "like" | "dislike") => {
    if (type === "like" && likeInput.trim()) {
      setLikes((prev) => [...prev, likeInput.trim()]);
      setLikeInput("");
    } else if (type === "dislike" && dislikeInput.trim()) {
      setDislikes((prev) => [...prev, dislikeInput.trim()]);
      setDislikeInput("");
    }
  };

  /** 폼 제출 */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSubmit({
      name, gender, breed: breed || undefined,
      birthday: birthday || undefined,
      adoption_date: adoptionDate || undefined,
      weight_kg: weightKg ? Number(weightKg) : undefined,
      personality: personality || undefined,
      likes, dislikes,
    });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-cream flex flex-col">
      <div className="flex-1 w-full max-w-lg mx-auto overflow-y-auto pb-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-coral-50">
          <h2 className="text-lg font-bold font-serif-ko">{isEdit ? "프로필 수정" : "반려견 등록"}</h2>
          <button onClick={onClose} className="p-1 text-txt-tertiary"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="px-4 py-6 space-y-4">
          {/* 이름 (필수) */}
          <FormInput id="pet-name" label="이름 *" placeholder="우리 아이 이름"
            value={name} onChange={(e) => setName(e.target.value)} required />

          {/* 성별 */}
          <div className="space-y-2">
            <span className="text-sm font-medium text-gray-700">성별</span>
            <div className="flex gap-2">
              {PET_GENDER_OPTIONS.map((g) => (
                <button key={g.value} type="button" onClick={() => setGender(g.value)}
                  className={cn("flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors",
                    gender === g.value ? "bg-coral-500 text-white" : "bg-surface-low text-txt-secondary"
                  )}>{g.emoji} {g.label}</button>
              ))}
            </div>
          </div>

          {/* 품종 + 몸무게 */}
          <div className="grid grid-cols-2 gap-3">
            <FormInput id="pet-breed" label="품종" placeholder="예: 포메라니안"
              value={breed} onChange={(e) => setBreed(e.target.value)} />
            <FormInput id="pet-weight" label="몸무게 (kg)" type="number" step="0.1"
              placeholder="kg" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
          </div>

          {/* 생일 + 입양일 */}
          <div className="grid grid-cols-2 gap-3">
            <FormDatePicker id="pet-bday" label="생일" value={birthday}
              onChange={(e) => setBirthday(e.target.value)} />
            <FormDatePicker id="pet-adopt" label="입양일" value={adoptionDate}
              onChange={(e) => setAdoptionDate(e.target.value)} />
          </div>

          {/* 성격 */}
          <FormInput id="pet-personality" label="성격 한마디"
            placeholder="예: 활발하고 애교 많은 아이" value={personality}
            onChange={(e) => setPersonality(e.target.value)} />

          {/* 좋아하는 것 태그 */}
          <TagInput label="좋아하는 것" tags={likes} input={likeInput}
            onInputChange={setLikeInput} onAdd={() => addTag("like")}
            onRemove={(t) => setLikes((p) => p.filter((x) => x !== t))}
            color="bg-green-50 text-green-700" />

          {/* 싫어하는 것 태그 */}
          <TagInput label="싫어하는 것" tags={dislikes} input={dislikeInput}
            onInputChange={setDislikeInput} onAdd={() => addTag("dislike")}
            onRemove={(t) => setDislikes((p) => p.filter((x) => x !== t))}
            color="bg-coral-50 text-coral-600" />

          <Button type="submit" disabled={saving || !name}
            className="w-full rounded-full bg-coral-500 hover:bg-coral-600 text-white py-3">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : isEdit ? "수정하기" : "등록하기"}
          </Button>
        </form>
      </div>
    </div>
  );
}

/** 태그 입력 내부 컴포넌트 */
function TagInput({ label, tags, input, onInputChange, onAdd, onRemove, color }: {
  label: string; tags: string[]; input: string;
  onInputChange: (v: string) => void; onAdd: () => void; onRemove: (t: string) => void;
  color: string;
}) {
  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="flex gap-2">
        <Input placeholder="입력 후 + 버튼" value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onAdd(); } }}
          className="flex-1" />
        <button type="button" onClick={onAdd}
          className="w-12 h-12 bg-coral-400 rounded-xl flex items-center justify-center text-white flex-shrink-0">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {tags.map((t) => (
            <span key={t} className={`${color} px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1`}>
              {t}
              <button type="button" onClick={() => onRemove(t)} className="ml-0.5">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
