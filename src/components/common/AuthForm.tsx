"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/common/FormInput";
import { Heart, Loader2 } from "lucide-react";
import PWAInstallBanner from "@/components/common/PWAInstallBanner";

/** 데모 계정 자동 로그인 비밀번호 */
const DEMO_PASSWORD = "demo1234";

/** AuthForm 컴포넌트의 props 타입 */
interface AuthFormProps {
  mode: "login" | "signup"; // 로그인 or 회원가입
  onSubmit: (email: string, password: string) => Promise<string | null>;
  onToggleMode: () => void; // 로그인/회원가입 전환
}

/**
 * 로그인/회원가입 공통 폼 컴포넌트
 * 이메일 + 비밀번호 입력 + 제출 버튼 + 모드 전환 링크 + 데모 체험 버튼
 */
export default function AuthForm({ mode, onSubmit, onToggleMode }: AuthFormProps) {
  const [email, setEmail] = useState(""); // 이메일 입력값
  const [password, setPassword] = useState(""); // 비밀번호 입력값
  const [error, setError] = useState<string | null>(null); // 에러 메시지
  const [loading, setLoading] = useState(false); // 제출 중 로딩

  /** 폼 제출 핸들러 */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const errorMessage = await onSubmit(email, password);
    if (errorMessage) setError(errorMessage);
    setLoading(false);
  };

  /** 데모 계정 원클릭 로그인 */
  const handleDemoLogin = async (demoEmail: string) => {
    setError(null);
    setLoading(true);
    const errorMessage = await onSubmit(demoEmail, DEMO_PASSWORD);
    if (errorMessage) setError(errorMessage);
    setLoading(false);
  };

  const isLogin = mode === "login";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream px-6">
      {/* 로고 & 제목 */}
      <div className="text-center mb-8 animate-fade-up">
        <div className="w-16 h-16 bg-coral-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-white fill-white" />
        </div>
        <h1 className="text-2xl font-bold text-txt-primary">오늘우리</h1>
        <p className="text-sm text-txt-secondary mt-1">우리 둘만의 데이트 기록 앱</p>
      </div>

      {/* 인증 폼 카드 */}
      <form onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-card space-y-4">
        <h2 className="text-lg font-semibold text-center text-txt-primary">
          {isLogin ? "로그인" : "회원가입"}
        </h2>
        <FormInput id="email" label="이메일" type="email" placeholder="example@email.com"
          value={email} onChange={(e) => setEmail(e.target.value)} required />
        <FormInput id="password" label="비밀번호" type="password" placeholder="6자 이상 입력해주세요"
          value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        {error && <p className="text-sm text-error text-center">{error}</p>}
        <Button type="submit" disabled={loading}
          className="w-full rounded-full bg-coral-500 hover:bg-coral-600 text-white py-3">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : isLogin ? "로그인" : "회원가입"}
        </Button>
        <p className="text-sm text-center text-txt-secondary">
          {isLogin ? "계정이 없으신가요?" : "이미 계정이 있으신가요?"}{" "}
          <button type="button" onClick={onToggleMode}
            className="text-coral-400 font-medium hover:underline">
            {isLogin ? "회원가입" : "로그인"}
          </button>
        </p>
      </form>

      {/* 데모 체험 버튼 — 로그인 모드에서만 표시 */}
      {isLogin && (
        <div className="w-full max-w-sm mt-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-txt-tertiary">데모 체험</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => handleDemoLogin("demo1@oneuluri.com")}
              disabled={loading}
              className="py-3 rounded-2xl bg-blue-50 text-blue-600 text-sm font-bold
                active:scale-95 transition-transform disabled:opacity-50">
              🐻 연호로 체험
            </button>
            <button type="button" onClick={() => handleDemoLogin("demo2@oneuluri.com")}
              disabled={loading}
              className="py-3 rounded-2xl bg-pink-50 text-pink-500 text-sm font-bold
                active:scale-95 transition-transform disabled:opacity-50">
              🐰 수민으로 체험
            </button>
          </div>
        </div>
      )}

      {/* PWA 설치 유도 배너 */}
      <PWAInstallBanner />
    </div>
  );
}
