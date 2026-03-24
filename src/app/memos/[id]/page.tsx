"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useMemos } from "@/hooks/useMemos";
import { useCouple } from "@/hooks/useCouple";
import { MEMO_CATEGORIES, MEMO_COLORS } from "@/types/memo";
import type { CoupleMemo, MemoItem } from "@/types/memo";
import { ArrowLeft, Pin, Trash2, Plus, Check, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * 메모 상세 페이지 — /memos/[id]
 * 체크리스트 아이템 CRUD + 핀/삭제
 */
export default function MemoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const memoId = params.id as string;
  const supabase = createClient();
  const { couple } = useCouple();
  const { deleteMemo, togglePin, addItem, toggleItem, deleteItem } = useMemos();

  const [memo, setMemo] = useState<CoupleMemo | null>(null);
  const [items, setItems] = useState<MemoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItemText, setNewItemText] = useState("");

  /** 메모 + 아이템 로드 */
  useEffect(() => {
    const load = async () => {
      try {
        const [memoRes, itemsRes] = await Promise.all([
          supabase.from("couple_memos").select("*").eq("id", memoId).maybeSingle(),
          supabase.from("memo_items").select("*").eq("memo_id", memoId)
            .order("sort_order", { ascending: true }),
        ]);
        setMemo(memoRes.data as CoupleMemo | null);
        setItems((itemsRes.data as MemoItem[]) ?? []);
      } catch (error) {
        console.error("[MemoDetail] 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    if (memoId) load();
  }, [memoId]);

  /** 아이템 목록 새로고침 */
  const refreshItems = async () => {
    const { data } = await supabase.from("memo_items").select("*")
      .eq("memo_id", memoId).order("sort_order", { ascending: true });
    setItems((data as MemoItem[]) ?? []);
  };

  /** 아이템 추가 */
  const handleAddItem = async () => {
    if (!newItemText.trim()) return;
    const ok = await addItem(memoId, newItemText.trim(), items.length);
    if (ok) { setNewItemText(""); await refreshItems(); }
  };

  /** 체크 토글 */
  const handleToggle = async (itemId: string, current: boolean) => {
    await toggleItem(itemId, current);
    setItems((prev) =>
      prev.map((i) => i.id === itemId ? { ...i, is_checked: !current } : i)
    );
  };

  /** 아이템 삭제 */
  const handleDeleteItem = async (itemId: string) => {
    await deleteItem(itemId);
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Loader2 className="w-8 h-8 animate-spin text-coral-400" />
      </div>
    );
  }

  if (!memo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <p className="text-txt-secondary">메모를 찾을 수 없어요.</p>
      </div>
    );
  }

  const cat = MEMO_CATEGORIES[memo.category];
  const bgClass = MEMO_COLORS[memo.color] ?? MEMO_COLORS.default;
  const authorEmoji = couple
    ? memo.author_id === couple.user1_id ? couple.user1_emoji : couple.user2_emoji
    : "💬";

  // 체크 안 된 것 먼저, 체크된 것 아래로
  const unchecked = items.filter((i) => !i.is_checked);
  const checked = items.filter((i) => i.is_checked);

  return (
    <div className={`min-h-screen ${bgClass}`}>
      {/* 상단 바 */}
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={() => router.back()} className="p-1">
          <ArrowLeft className="w-5 h-5 text-txt-primary" />
        </button>
        <div className="flex gap-2">
          <button onClick={() => { togglePin(memo.id, memo.is_pinned); setMemo({ ...memo, is_pinned: !memo.is_pinned }); }}
            className={cn("p-2", memo.is_pinned ? "text-coral-400" : "text-txt-tertiary")}>
            <Pin className="w-4 h-4" />
          </button>
          <button onClick={async () => { await deleteMemo(memo.id); router.push("/memos"); }}
            className="p-2 text-txt-tertiary hover:text-error">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="px-4 pb-8 space-y-4">
        {/* 메모 헤더 */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{cat.emoji}</span>
            <span className="text-xs text-txt-tertiary">{cat.label}</span>
            <span className="text-sm ml-auto">{authorEmoji}</span>
          </div>
          <h1 className="text-xl font-bold text-txt-primary">{memo.title}</h1>
        </div>

        {/* 아이템 추가 입력 */}
        <div className="flex gap-2">
          <Input placeholder="항목 추가" value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
            className="rounded-xl flex-1 bg-white/70" />
          <button onClick={handleAddItem}
            className="w-10 h-10 bg-coral-400 rounded-xl flex items-center justify-center text-white flex-shrink-0">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* 체크리스트 — 미완료 */}
        <div className="space-y-1.5">
          {unchecked.map((item) => (
            <div key={item.id} className="flex items-center gap-3 bg-white/70 rounded-xl px-3 py-2.5">
              <button onClick={() => handleToggle(item.id, false)}
                className="w-5 h-5 rounded-full border-2 border-coral-300 flex-shrink-0" />
              <span className="flex-1 text-sm text-txt-primary">{item.content}</span>
              <button onClick={() => handleDeleteItem(item.id)} className="text-txt-tertiary">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* 체크리스트 — 완료 */}
        {checked.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs text-txt-tertiary">완료 {checked.length}</p>
            {checked.map((item) => (
              <div key={item.id} className="flex items-center gap-3 bg-white/40 rounded-xl px-3 py-2.5">
                <button onClick={() => handleToggle(item.id, true)}
                  className="w-5 h-5 rounded-full bg-coral-400 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </button>
                <span className="flex-1 text-sm text-txt-tertiary line-through">{item.content}</span>
                <button onClick={() => handleDeleteItem(item.id)} className="text-txt-tertiary">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
