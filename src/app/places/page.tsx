"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import { useBookmarks } from "@/hooks/useBookmarks";
import { PLACE_CATEGORIES } from "@/types/bookmark";
import type { PlaceCategory } from "@/types/bookmark";
import { ArrowLeft, Loader2, MapPin, Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

/**
 * 우리가 자주 가는 곳 — /places
 * 북마크된 장소 목록 (방문 횟수 역순) + 새 장소 추가
 */
export default function PlacesPage() {
  const router = useRouter();
  const { places, loading, bookmarkPlace, deletePlace } = useBookmarks();
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<PlaceCategory>("food");
  const [newMemo, setNewMemo] = useState("");

  /** 새 장소 추가 */
  const handleAdd = async () => {
    if (!newName.trim()) return;
    const ok = await bookmarkPlace({
      name: newName.trim(), category: newCategory,
      memo: newMemo.trim() || undefined,
    });
    if (ok) { setNewName(""); setNewMemo(""); setShowAdd(false); }
  };

  const categories = Object.entries(PLACE_CATEGORIES) as [PlaceCategory, { emoji: string; label: string }][];

  return (
    <AppLayout>
      <div className="px-4 pt-4 pb-6 space-y-4">
        {/* 상단 바 */}
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()} className="p-1">
            <ArrowLeft className="w-5 h-5 text-txt-primary" />
          </button>
          <h1 className="text-lg font-bold text-txt-primary">우리가 자주 가는 곳</h1>
          <button onClick={() => setShowAdd(!showAdd)} className="p-1 text-coral-400">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* 새 장소 추가 폼 */}
        {showAdd && (
          <div className="bg-white rounded-2xl p-4 shadow-soft space-y-3">
            <Input placeholder="장소 이름" value={newName}
              onChange={(e) => setNewName(e.target.value)} className="rounded-xl" />
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
              {categories.map(([key, cat]) => (
                <button key={key} type="button" onClick={() => setNewCategory(key)}
                  className={cn(
                    "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border",
                    newCategory === key ? "bg-coral-50 border-coral-300 text-coral-500" : "bg-white border-cream-dark text-txt-secondary"
                  )}>
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
            <Input placeholder="메모 (선택)" value={newMemo}
              onChange={(e) => setNewMemo(e.target.value)} className="rounded-xl" />
            <Button onClick={handleAdd} disabled={!newName.trim()}
              className="w-full rounded-full bg-coral-400 hover:bg-coral-500 text-white">
              저장하기
            </Button>
          </div>
        )}

        {/* 장소 목록 */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-coral-400" />
          </div>
        ) : places.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-coral-200 mx-auto mb-3" />
            <p className="text-txt-secondary font-medium">아직 저장한 장소가 없어요</p>
            <p className="text-sm text-txt-tertiary mt-1">데이트 기록에서 장소를 저장해보세요</p>
          </div>
        ) : (
          <div className="space-y-2">
            {places.map((place) => {
              const cat = PLACE_CATEGORIES[place.category] ?? PLACE_CATEGORIES.etc;
              return (
                <div key={place.id} className="bg-white rounded-2xl p-4 shadow-soft flex items-center gap-3">
                  <span className="text-2xl">{cat.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-txt-primary">{place.name}</p>
                    <div className="flex items-center gap-2 text-xs text-txt-tertiary mt-0.5">
                      <span>{place.visit_count}회 방문</span>
                      {place.last_visited && (
                        <span>· 마지막 {formatDate(place.last_visited, "short")}</span>
                      )}
                    </div>
                    {place.memo && (
                      <p className="text-xs text-txt-secondary mt-1">{place.memo}</p>
                    )}
                  </div>
                  <button onClick={() => deletePlace(place.id)}
                    className="p-1 text-txt-tertiary hover:text-error">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
