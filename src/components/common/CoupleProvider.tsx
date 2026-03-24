"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Couple } from "@/types";

/** Couple 컨텍스트 타입 — useCouple 훅의 모든 반환값 */
interface CoupleContextType {
  couple: Couple | null;
  loading: boolean;
  setCouple: (c: Couple | null) => void;
  refetch: () => Promise<void>;
}

const CoupleContext = createContext<CoupleContextType>({
  couple: null,
  loading: true,
  setCouple: () => {},
  refetch: async () => {},
});

/**
 * 커플 정보 Provider — 앱 전체에서 단 한 번만 커플 조회
 * AuthProvider 하위에 배치하여 user.id가 확정된 후 실행
 */
export function CoupleProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [couple, setCouple] = useState<Couple | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const userId = user?.id;

  /** 커플 정보 조회 */
  const refetch = async () => {
    if (!userId) { setLoading(false); return; }
    try {
      const { data, error } = await supabase
        .from("couples").select("*")
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
        .maybeSingle();
      if (error) console.error("[CoupleProvider] 조회 실패:", error.message);
      setCouple(data as Couple | null);
    } catch (error) {
      console.error("[CoupleProvider] 예외:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refetch(); }, [userId]);

  return (
    <CoupleContext.Provider value={{ couple, loading, setCouple, refetch }}>
      {children}
    </CoupleContext.Provider>
  );
}

/** 커플 컨텍스트 접근 훅 — 내부용 */
export function useCoupleContext() {
  return useContext(CoupleContext);
}
