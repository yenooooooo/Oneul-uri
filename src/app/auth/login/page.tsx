"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import AuthForm from "@/components/common/AuthForm";

/**
 * 로그인 페이지 — /auth/login
 * 이메일/비밀번호로 로그인, 회원가입 페이지로 전환 가능
 */
export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();

  /** 로그인 처리 — 성공 시 커플 스페이스 설정 페이지로 이동 */
  const handleLogin = async (email: string, password: string) => {
    const error = await signIn(email, password);
    if (!error) {
      router.push("/");
      router.refresh();
    }
    return error;
  };

  /** 회원가입 페이지로 전환 */
  const handleToggle = () => {
    router.push("/auth/signup");
  };

  return (
    <AuthForm mode="login" onSubmit={handleLogin} onToggleMode={handleToggle} />
  );
}
