"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import AuthForm from "@/components/common/AuthForm";
import { toast } from "sonner";

/**
 * 회원가입 페이지 — /auth/signup
 * 이메일/비밀번호로 회원가입, 로그인 페이지로 전환 가능
 */
export default function SignupPage() {
  const router = useRouter();
  const { signUp } = useAuth();

  /** 회원가입 처리 — 성공 시 커플 스페이스 설정으로 이동 */
  const handleSignup = async (email: string, password: string) => {
    const error = await signUp(email, password);
    if (!error) {
      toast.success("회원가입 완료! 커플 스페이스를 설정해주세요.");
      router.push("/couple");
      router.refresh();
    }
    return error;
  };

  /** 로그인 페이지로 전환 */
  const handleToggle = () => {
    router.push("/auth/login");
  };

  return (
    <AuthForm mode="signup" onSubmit={handleSignup} onToggleMode={handleToggle} />
  );
}
