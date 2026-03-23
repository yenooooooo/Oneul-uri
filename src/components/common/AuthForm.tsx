"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Loader2 } from "lucide-react";
import PWAInstallBanner from "@/components/common/PWAInstallBanner";

/** AuthForm 컴포넌트의 props 타입 */
interface AuthFormProps {
  mode: "login" | "signup"; // 로그인 or 회원가입
  onSubmit: (email: string, password: string) => Promise<string | null>;
  onToggleMode: () => void; // 로그인/회원가입 전환
}

/**
 * 로그인/회원가입 공통 폼 컴포넌트
 * 이메일 + 비밀번호 입력 + 제출 버튼 + 모드 전환 링크
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

    // 부모 컴포넌트의 로그인/회원가입 함수 호출
    const errorMessage = await onSubmit(email, password);

    if (errorMessage) {
      setError(errorMessage);
    }
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
        <p className="text-sm text-txt-secondary mt-1">
          우리 둘만의 데이트 기록 앱
        </p>
      </div>

      {/* 인증 폼 카드 */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-card space-y-4"
      >
        <h2 className="text-lg font-semibold text-center text-txt-primary">
          {isLogin ? "로그인" : "회원가입"}
        </h2>

        {/* 이메일 입력 */}
        <div className="space-y-2">
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-xl"
          />
        </div>

        {/* 비밀번호 입력 */}
        <div className="space-y-2">
          <Label htmlFor="password">비밀번호</Label>
          <Input
            id="password"
            type="password"
            placeholder="6자 이상 입력해주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="rounded-xl"
          />
        </div>

        {/* 에러 메시지 표시 */}
        {error && (
          <p className="text-sm text-error text-center">{error}</p>
        )}

        {/* 제출 버튼 */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-coral-400 hover:bg-coral-500 text-white py-3"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isLogin ? (
            "로그인"
          ) : (
            "회원가입"
          )}
        </Button>

        {/* 모드 전환 */}
        <p className="text-sm text-center text-txt-secondary">
          {isLogin ? "계정이 없으신가요?" : "이미 계정이 있으신가요?"}{" "}
          <button
            type="button"
            onClick={onToggleMode}
            className="text-coral-400 font-medium hover:underline"
          >
            {isLogin ? "회원가입" : "로그인"}
          </button>
        </p>
      </form>

      {/* PWA 설치 유도 배너 */}
      <PWAInstallBanner />
    </div>
  );
}
