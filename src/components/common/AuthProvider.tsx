"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

/** Auth 컨텍스트 타입 */
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => null,
  signUp: async () => null,
  signOut: async () => {},
});

/**
 * 인증 상태 Provider — 앱 전체에서 단 한 번만 Supabase 세션을 관리
 * 모든 하위 컴포넌트에서 useAuth()로 접근 가능
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null); // 현재 로그인된 유저
  const [loading, setLoading] = useState(true); // 초기 로딩 상태
  const supabase = createClient();

  /** 마운트 시 현재 세션 확인 + 인증 상태 변화 구독 */
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error("[AuthProvider/getUser] 유저 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // 인증 상태 변화 리스너 (로그인/로그아웃 감지)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  /** 이메일/비밀번호로 로그인 */
  const signIn = async (email: string, password: string): Promise<string | null> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error("[AuthProvider/signIn] 로그인 실패:", error.message);
        return error.message;
      }
      return null;
    } catch (error) {
      console.error("[AuthProvider/signIn] 예외 발생:", error);
      return "로그인 중 오류가 발생했어요.";
    }
  };

  /** 이메일/비밀번호로 회원가입 */
  const signUp = async (email: string, password: string): Promise<string | null> => {
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        console.error("[AuthProvider/signUp] 회원가입 실패:", error.message);
        return error.message;
      }
      return null;
    } catch (error) {
      console.error("[AuthProvider/signUp] 예외 발생:", error);
      return "회원가입 중 오류가 발생했어요.";
    }
  };

  /** 로그아웃 */
  const signOut = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("[AuthProvider/signOut] 로그아웃 실패:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * 인증 상태를 사용하는 커스텀 훅
 * AuthProvider 하위에서만 사용 가능
 */
export function useAuth() {
  return useContext(AuthContext);
}
