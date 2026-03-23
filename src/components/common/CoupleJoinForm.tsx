"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

/** CoupleJoinForm 컴포넌트 props */
interface CoupleJoinFormProps {
  onSubmit: (inviteCode: string, nickname: string) => Promise<string | null>;
  onSuccess: () => void;
}

/**
 * 커플 스페이스 참여 폼
 * 초대 코드 + 닉네임 입력 → 기존 스페이스에 참여
 */
export default function CoupleJoinForm({ onSubmit, onSuccess }: CoupleJoinFormProps) {
  const [inviteCode, setInviteCode] = useState(""); // 초대 코드
  const [nickname, setNickname] = useState(""); // 닉네임
  const [loading, setLoading] = useState(false); // 로딩 상태

  /** 커플 스페이스 참여 핸들러 */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const error = await onSubmit(inviteCode, nickname);

    if (error) {
      toast.error(error);
    } else {
      toast.success("커플 스페이스에 연결되었어요!");
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 닉네임 입력 */}
      <div className="space-y-2">
        <Label htmlFor="join-nickname">내 닉네임</Label>
        <Input
          id="join-nickname"
          placeholder="상대방에게 보여질 이름"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
          className="rounded-xl"
        />
      </div>

      {/* 초대 코드 입력 */}
      <div className="space-y-2">
        <Label htmlFor="invite-code">초대 코드</Label>
        <Input
          id="invite-code"
          placeholder="6자리 코드 입력"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
          required
          maxLength={6}
          className="rounded-xl text-center text-lg tracking-widest"
        />
      </div>

      <Button
        type="submit"
        disabled={loading || inviteCode.length < 6}
        className="w-full rounded-full bg-coral-400 hover:bg-coral-500 text-white"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "연결하기"}
      </Button>
    </form>
  );
}
