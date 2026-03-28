"use client";

import type { PetHealth } from "@/types";
import { PET_HEALTH_TYPES } from "@/types/pet";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  records: PetHealth[];
  upcoming: PetHealth[];
  onAdd: () => void;
  onDelete: (id: string) => void;
}

/**
 * 건강 기록 섹션 — 다가오는 일정 + 지난 기록
 */
export default function PetHealthList({ records, upcoming, onAdd, onDelete }: Props) {
  // 지난 기록 (다가오는 일정 제외)
  const upcomingIds = new Set(upcoming.map((h) => h.id));
  const pastRecords = records.filter((h) => !upcomingIds.has(h.id));

  return (
    <section className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-serif-ko font-bold text-txt-primary">건강 수첩</h3>
        <button onClick={onAdd}
          className="w-8 h-8 bg-coral-500 rounded-full flex items-center justify-center text-white">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* 다가오는 일정 */}
      {upcoming.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold text-amber-600">📅 다가오는 일정</p>
          {upcoming.map((h) => (
            <HealthCard key={h.id} record={h} onDelete={onDelete} highlight />
          ))}
        </div>
      )}

      {/* 지난 기록 */}
      {pastRecords.length > 0 ? (
        <div className="space-y-2">
          {upcoming.length > 0 && (
            <p className="text-xs font-bold text-txt-tertiary mt-2">지난 기록</p>
          )}
          {pastRecords.slice(0, 10).map((h) => (
            <HealthCard key={h.id} record={h} onDelete={onDelete} />
          ))}
        </div>
      ) : upcoming.length === 0 && (
        <div className="text-center py-8">
          <p className="text-3xl mb-2">🩺</p>
          <p className="text-sm text-txt-tertiary">건강 기록을 추가해보세요</p>
        </div>
      )}
    </section>
  );
}

/** 건강 기록 카드 (내부 컴포넌트) */
function HealthCard({ record, onDelete, highlight }: {
  record: PetHealth; onDelete: (id: string) => void; highlight?: boolean;
}) {
  const type = PET_HEALTH_TYPES[record.type];
  return (
    <div className={`flex items-center gap-3 rounded-2xl p-3 ${highlight ? "bg-amber-50/70 border border-amber-100" : "bg-white shadow-soft"}`}>
      <div className="w-10 h-10 rounded-full bg-surface-low flex items-center justify-center text-lg flex-shrink-0">
        {type.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs text-txt-tertiary">{type.label}</span>
          <span className="text-xs text-txt-tertiary">{formatDate(highlight && record.next_date ? record.next_date : record.date, "short")}</span>
        </div>
        <p className="text-sm font-bold text-txt-primary truncate">{record.title}</p>
        {record.hospital && <p className="text-xs text-txt-secondary truncate">{record.hospital}</p>}
      </div>
      {record.cost && (
        <span className="text-xs font-bold text-txt-secondary flex-shrink-0">{formatCurrency(record.cost)}</span>
      )}
      <button onClick={() => onDelete(record.id)} className="p-1 text-txt-tertiary flex-shrink-0">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
