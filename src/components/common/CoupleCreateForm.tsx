"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/common/FormInput";
import FormDatePicker from "@/components/common/FormDatePicker";
import { Loader2, Copy, Check, ArrowRight } from "lucide-react";
import { toast } from "sonner";

/** CoupleCreateForm 컴포넌트 props */
interface CoupleCreateFormProps {
  onSubmit: (startDate: string, nickname: string) => Promise<{
    inviteCode: string | null;
    error: string | null;
  }>;
}

/**
 * 커플 스페이스 생성 폼
 * 사귄 날짜 + 닉네임 입력 → 초대 코드 발급
 */
export default function CoupleCreateForm({ onSubmit }: CoupleCreateFormProps) {
  const router = useRouter();
  const [startDate, setStartDate] = useState(""); // 사귄 날짜
  const [nickname, setNickname] = useState(""); // 닉네임
  const [inviteCode, setInviteCode] = useState<string | null>(null); // 발급된 초대 코드
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [copied, setCopied] = useState(false); // 복사 완료 상태

  /** 커플 스페이스 생성 핸들러 */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await onSubmit(startDate, nickname);

    if (result.error) {
      toast.error(result.error);
    } else if (result.inviteCode) {
      setInviteCode(result.inviteCode);
      toast.success("커플 스페이스가 생성되었어요!");
    }
    setLoading(false);
  };

  /** 초대 코드 클립보드 복사 */
  const handleCopy = async () => {
    if (!inviteCode) return;
    await navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    toast.success("초대 코드가 복사되었어요!");
    setTimeout(() => setCopied(false), 2000);
  };

  // 초대 코드가 발급된 경우 — 코드 표시 화면
  if (inviteCode) {
    return (
      <div className="space-y-6 text-center">
        <p className="text-txt-secondary">
          상대방에게 아래 초대 코드를 공유해주세요
        </p>
        <div className="bg-cream-dark rounded-2xl p-6">
          <p className="text-3xl font-bold tracking-widest text-coral-400">
            {inviteCode}
          </p>
        </div>
        <div className="flex gap-2 justify-center">
          <Button
            onClick={handleCopy}
            variant="outline"
            className="rounded-full border-coral-200 text-coral-400"
          >
            {copied ? (
              <><Check className="w-4 h-4 mr-2" /> 복사됨</>
            ) : (
              <><Copy className="w-4 h-4 mr-2" /> 코드 복사</>
            )}
          </Button>
          <Button
            onClick={() => { router.push("/"); router.refresh(); }}
            className="rounded-full bg-coral-500 hover:bg-coral-600 text-white"
          >
            시작하기 <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <p className="text-xs text-txt-tertiary">
          상대방은 나중에 초대해도 돼요
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 닉네임 입력 */}
      <FormInput
        id="nickname"
        label="내 닉네임"
        placeholder="상대방에게 보여질 이름"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        required
      />

      {/* 사귄 날짜 입력 */}
      <FormDatePicker
        id="startDate"
        label="사귄 날짜"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        required
      />

      <Button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-coral-500 hover:bg-coral-600 text-white"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "스페이스 만들기"}
      </Button>
    </form>
  );
}
