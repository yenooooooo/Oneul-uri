"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useCouple } from "@/hooks/useCouple";
import { useAuth } from "@/hooks/useAuth";
import { useAnniversary } from "@/hooks/useAnniversary";
import { useCalendar } from "@/hooks/useCalendar";
import type { Pet, CreatePet, UpdatePet, PetDiary, CreatePetDiary, PetHealth, CreatePetHealth } from "@/types";
import { toast } from "sonner";

/**
 * 반려견 관리 커스텀 훅
 * 프로필 CRUD, 성장 일기, 건강 기록, 기념일/캘린더 연동
 */
export function usePet() {
  const { user } = useAuth();
  const { couple } = useCouple();
  const { addAnniversary } = useAnniversary();
  const { addEvent } = useCalendar();
  const [pet, setPet] = useState<Pet | null>(null); // 반려견 프로필
  const [diaries, setDiaries] = useState<PetDiary[]>([]); // 성장 일기
  const [healthRecords, setHealthRecords] = useState<PetHealth[]>([]); // 건강 기록
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const coupleId = couple?.id;

  /** 반려견 프로필 조회 — 커플당 1마리 */
  const fetchPet = useCallback(async () => {
    if (!coupleId) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("pets").select("*")
        .eq("couple_id", coupleId).maybeSingle();
      if (error) console.error("[usePet/fetchPet]:", error.message);
      setPet(data as Pet | null);
    } catch (e) {
      console.error("[usePet/fetchPet] 예외:", e);
    } finally {
      setLoading(false);
    }
  }, [coupleId]);

  /** 성장 일기 조회 — 최신순 */
  const fetchDiaries = useCallback(async (petId: string) => {
    try {
      const { data, error } = await supabase
        .from("pet_diaries").select("*")
        .eq("pet_id", petId).order("date", { ascending: false });
      if (error) console.error("[usePet/fetchDiaries]:", error.message);
      setDiaries((data as PetDiary[]) ?? []);
    } catch (e) {
      console.error("[usePet/fetchDiaries] 예외:", e);
    }
  }, []);

  /** 건강 기록 조회 — 최신순 */
  const fetchHealth = useCallback(async (petId: string) => {
    try {
      const { data, error } = await supabase
        .from("pet_health").select("*")
        .eq("pet_id", petId).order("date", { ascending: false });
      if (error) console.error("[usePet/fetchHealth]:", error.message);
      setHealthRecords((data as PetHealth[]) ?? []);
    } catch (e) {
      console.error("[usePet/fetchHealth] 예외:", e);
    }
  }, []);

  // 커플 변경 시 프로필 조회, 프로필 로드 시 일기+건강 조회
  useEffect(() => { if (coupleId) fetchPet(); }, [coupleId, fetchPet]);
  useEffect(() => {
    if (pet?.id) { fetchDiaries(pet.id); fetchHealth(pet.id); }
  }, [pet?.id, fetchDiaries, fetchHealth]);

  /** 반려견 등록 — 기념일 자동 연동 */
  const createPet = async (data: CreatePet): Promise<string | null> => {
    if (!coupleId) return null;
    try {
      const { data: row, error } = await supabase.from("pets")
        .insert({ couple_id: coupleId, ...data, likes: data.likes ?? [], dislikes: data.dislikes ?? [] })
        .select().single();
      if (error) { toast.error("등록에 실패했어요."); return null; }
      toast.success(`${data.name}이(가) 등록되었어요!`);
      // 기념일 자동 등록 — 입양일, 생일
      if (data.adoption_date) addAnniversary(`${data.name} 입양일`, data.adoption_date, true);
      if (data.birthday) addAnniversary(`${data.name} 생일`, data.birthday, true);
      await fetchPet();
      return (row as Pet).id;
    } catch (e) {
      console.error("[usePet/createPet] 예외:", e);
      return null;
    }
  };

  /** 프로필 수정 */
  const updatePet = async (updates: UpdatePet): Promise<boolean> => {
    if (!pet) return false;
    try {
      const { error } = await supabase.from("pets")
        .update({ ...updates, updated_at: new Date().toISOString() }).eq("id", pet.id);
      if (error) { toast.error("수정에 실패했어요."); return false; }
      toast.success("프로필이 수정되었어요!");
      await fetchPet();
      return true;
    } catch (e) {
      console.error("[usePet/updatePet] 예외:", e);
      return false;
    }
  };

  /** 성장 일기 추가 */
  const addDiary = async (data: CreatePetDiary): Promise<boolean> => {
    if (!pet || !user) return false;
    try {
      const insertData = {
        pet_id: pet.id, couple_id: coupleId, author_id: user.id,
        date: data.date, title: data.title, category: data.category,
        content: data.content || null, photos: data.photos ?? [],
      };
      console.log("[usePet/addDiary] 저장 데이터:", insertData);
      const { error } = await supabase.from("pet_diaries").insert(insertData);
      if (error) { console.error("[usePet/addDiary] 실패:", error); toast.error("일기 저장에 실패했어요."); return false; }
      toast.success("일기가 저장되었어요!");
      await fetchDiaries(pet.id);
      return true;
    } catch (e) {
      console.error("[usePet/addDiary] 예외:", e);
      return false;
    }
  };

  /** 일기 수정 */
  const updateDiary = async (id: string, data: CreatePetDiary): Promise<boolean> => {
    if (!pet) return false;
    try {
      const updateData = {
        date: data.date, title: data.title, category: data.category,
        content: data.content || null, photos: data.photos ?? [],
      };
      console.log("[usePet/updateDiary] 수정 데이터:", updateData);
      const { error } = await supabase.from("pet_diaries").update(updateData).eq("id", id);
      if (error) { console.error("[usePet/updateDiary] 실패:", error); toast.error("수정에 실패했어요."); return false; }
      toast.success("일기가 수정되었어요!");
      await fetchDiaries(pet.id);
      return true;
    } catch (e) {
      console.error("[usePet/updateDiary] 예외:", e);
      return false;
    }
  };

  /** 일기 삭제 */
  const deleteDiary = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from("pet_diaries").delete().eq("id", id);
      if (error) { toast.error("삭제에 실패했어요."); return false; }
      setDiaries((prev) => prev.filter((d) => d.id !== id));
      return true;
    } catch (e) {
      console.error("[usePet/deleteDiary] 예외:", e);
      return false;
    }
  };

  /** 건강 기록 추가 — next_date가 있으면 캘린더 자동 등록 */
  const addHealth = async (data: CreatePetHealth): Promise<boolean> => {
    if (!pet) return false;
    try {
      const { error } = await supabase.from("pet_health").insert({
        pet_id: pet.id, couple_id: coupleId, ...data,
      });
      if (error) { toast.error("기록 저장에 실패했어요."); return false; }
      toast.success("건강 기록이 저장되었어요!");
      // 다음 예정일이 있으면 캘린더에 자동 추가
      if (data.next_date) addEvent(`${pet.name} ${data.title}`, data.next_date, "personal");
      await fetchHealth(pet.id);
      return true;
    } catch (e) {
      console.error("[usePet/addHealth] 예외:", e);
      return false;
    }
  };

  /** 건강 기록 수정 */
  const updateHealth = async (id: string, data: CreatePetHealth): Promise<boolean> => {
    if (!pet) return false;
    try {
      const { error } = await supabase.from("pet_health").update(data).eq("id", id);
      if (error) { toast.error("수정에 실패했어요."); return false; }
      toast.success("기록이 수정되었어요!");
      await fetchHealth(pet.id);
      return true;
    } catch (e) {
      console.error("[usePet/updateHealth] 예외:", e);
      return false;
    }
  };

  /** 건강 기록 삭제 */
  const deleteHealth = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from("pet_health").delete().eq("id", id);
      if (error) { toast.error("삭제에 실패했어요."); return false; }
      setHealthRecords((prev) => prev.filter((h) => h.id !== id));
      return true;
    } catch (e) {
      console.error("[usePet/deleteHealth] 예외:", e);
      return false;
    }
  };

  /** 다가오는 건강 일정 — next_date가 미래인 기록 */
  const upcomingHealth = healthRecords
    .filter((h) => h.next_date && new Date(h.next_date) >= new Date(new Date().toDateString()))
    .sort((a, b) => new Date(a.next_date!).getTime() - new Date(b.next_date!).getTime());

  return {
    pet, diaries, healthRecords, upcomingHealth, loading,
    createPet, updatePet,
    addDiary, updateDiary, deleteDiary,
    addHealth, updateHealth, deleteHealth,
  };
}
