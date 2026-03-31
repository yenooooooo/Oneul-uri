"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useDatePlans } from "@/hooks/useDatePlans";
import PlanTimeline from "@/components/planner/PlanTimeline";
import PlanItemModal from "@/components/planner/PlanItemModal";
import PlanCompleteModal from "@/components/planner/PlanCompleteModal";
import { ArrowLeft, Plus, Loader2, Trash2, PartyPopper } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { DatePlan, DatePlanItem, CreatePlanItem } from "@/types/planner";
import { toast } from "sonner";

/**
 * 플래너 상세 페이지 — /calendar/plan/[id]
 * DB에서 직접 조회하여 무한 루프 방지
 */
export default function PlanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const planId = params.id as string;
  const supabase = createClient();

  const { addItem, updateItem, deleteItem, deletePlan, completePlan } = useDatePlans();

  const [plan, setPlan] = useState<DatePlan | null>(null);
  const [items, setItems] = useState<DatePlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editItem, setEditItem] = useState<DatePlanItem | null>(null);
  const [showComplete, setShowComplete] = useState(false);

  /** DB에서 플래너 + 아이템 직접 조회 (한 번만 실행) */
  useEffect(() => {
    const load = async () => {
      try {
        const [planRes, itemsRes] = await Promise.all([
          supabase.from("date_plans").select("*").eq("id", planId).maybeSingle(),
          supabase.from("date_plan_items").select("*").eq("plan_id", planId)
            .order("sort_order", { ascending: true }),
        ]);
        setPlan(planRes.data as DatePlan | null);
        setItems((itemsRes.data as DatePlanItem[]) ?? []);
      } catch (error) {
        console.error("[PlanDetailPage] 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    if (planId) load();
  }, [planId]);

  /** 아이템 목록 새로고침 */
  const refreshItems = async () => {
    const { data } = await supabase.from("date_plan_items").select("*")
      .eq("plan_id", planId).order("sort_order", { ascending: true });
    setItems((data as DatePlanItem[]) ?? []);
  };

  /** 아이템 추가 */
  const handleAdd = async (input: CreatePlanItem): Promise<boolean> => {
    const ok = await addItem(planId, input, items.length);
    if (ok) await refreshItems();
    return ok;
  };

  /** 아이템 수정 */
  const handleUpdate = async (input: CreatePlanItem): Promise<boolean> => {
    if (!editItem) return false;
    const ok = await updateItem(editItem.id, input);
    if (ok) { await refreshItems(); setEditItem(null); }
    return ok;
  };

  /** 아이템 삭제 */
  const handleDelete = async (itemId: string) => {
    await deleteItem(itemId);
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  /** 데이트 완료 처리 */
  const handleComplete = async (convertToRecord: boolean) => {
    const recordId = await completePlan(planId, items, convertToRecord);
    setShowComplete(false);
    if (recordId) {
      toast.success("기록이 생성되었어요!");
      router.push(`/records/${recordId}`);
    } else {
      toast.success("데이트가 완료 처리되었어요!");
      router.push("/calendar");
    }
  };

  /** 플래너 삭제 */
  const handleDeletePlan = async () => {
    const ok = await deletePlan(planId);
    if (ok) router.push("/calendar");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Loader2 className="w-8 h-8 animate-spin text-coral-400" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <p className="text-txt-secondary">플래너를 찾을 수 없어요.</p>
      </div>
    );
  }

  const isCompleted = plan.status === "completed";

  return (
    <div className="min-h-screen bg-cream pb-32">
      {/* 상단 바 */}
      <div className="sticky top-0 z-10 bg-cream/80 backdrop-blur-lg px-4 py-3 flex items-center justify-between">
        <button onClick={() => router.back()} className="p-1">
          <ArrowLeft className="w-5 h-5 text-txt-primary" />
        </button>
        <button onClick={handleDeletePlan} className="p-2 text-error">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* 플래너 헤더 */}
      <div className="px-4 mb-4">
        <p className="text-sm text-coral-400 font-medium">{formatDate(plan.date, "long")}</p>
        <h1 className="text-2xl font-bold text-txt-primary">{plan.title}</h1>
        {isCompleted && (
          <span className="text-xs bg-green-soft/20 text-green-soft px-2 py-0.5 rounded-full">완료됨</span>
        )}
      </div>

      {/* 타임라인 */}
      <div className="px-4">
        <PlanTimeline items={items} onEdit={setEditItem} onDelete={handleDelete} />
      </div>

      {/* 하단 고정 버튼 */}
      {!isCompleted && (
        <div className="fixed left-0 right-0 z-50 bg-white border-t border-cream-dark px-4 py-3 flex gap-3 max-w-lg mx-auto"
          style={{ bottom: "calc(4rem + env(safe-area-inset-bottom, 8px))" }}>
          <button onClick={() => setShowAddModal(true)}
            className="flex-1 bg-white border border-coral-200 text-coral-400 rounded-full py-3 font-medium flex items-center justify-center gap-1">
            <Plus className="w-4 h-4" /> 일정 추가
          </button>
          <button onClick={() => setShowComplete(true)}
            className="flex-1 bg-coral-500 text-white rounded-full py-3 font-medium flex items-center justify-center gap-1">
            <PartyPopper className="w-4 h-4" /> 데이트 완료
          </button>
        </div>
      )}

      {showAddModal && <PlanItemModal onSubmit={handleAdd} onClose={() => setShowAddModal(false)} />}
      {editItem && <PlanItemModal initial={editItem} onSubmit={handleUpdate} onClose={() => setEditItem(null)} />}
      {showComplete && <PlanCompleteModal planTitle={plan.title} onComplete={handleComplete} onClose={() => setShowComplete(false)} />}
    </div>
  );
}
