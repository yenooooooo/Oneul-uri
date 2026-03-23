"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import { useCouple } from "@/hooks/useCouple";
import { useAnniversary } from "@/hooks/useAnniversary";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Cake, Copy, Check, LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";
import NotificationToggle from "@/components/common/NotificationToggle";

/**
 * 설정 페이지 — /settings
 * 생일 입력, 초대 코드 확인, 로그아웃
 */
export default function SettingsPage() {
  const router = useRouter();
  const { signOut } = useAuth();
  const {
    myNickname, myBirthday,
    inviteCode, isPartnerConnected, updateBirthday,
  } = useCouple();
  const { upsertBirthday } = useAnniversary();

  const [birthday, setBirthday] = useState(myBirthday ?? ""); // 생일 입력값
  const [saving, setSaving] = useState(false); // 저장 중
  const [copied, setCopied] = useState(false); // 초대 코드 복사 상태

  /** 생일 저장 — couples 테이블 + anniversaries 테이블 동시 업데이트 */
  const handleSaveBirthday = async () => {
    if (!birthday || !myNickname) return;
    setSaving(true);

    // 1. couples 테이블에 생일 저장
    const success = await updateBirthday(birthday);
    if (success) {
      // 2. anniversaries 테이블에 생일 기념일 등록/수정
      await upsertBirthday(myNickname, birthday);
      toast.success("생일이 저장되었어요!");
    } else {
      toast.error("생일 저장에 실패했어요.");
    }

    setSaving(false);
  };

  /** 초대 코드 복사 */
  const handleCopy = async () => {
    if (!inviteCode) return;
    await navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    toast.success("초대 코드가 복사되었어요!");
    setTimeout(() => setCopied(false), 2000);
  };

  /** 로그아웃 */
  const handleLogout = async () => {
    await signOut();
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <AppLayout>
      <div className="px-4 pt-4 pb-6 space-y-6">
        {/* 상단 바 */}
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1">
            <ArrowLeft className="w-5 h-5 text-txt-primary" />
          </button>
          <h1 className="text-lg font-bold text-txt-primary">설정</h1>
        </div>

        {/* 생일 입력 */}
        <section className="bg-white rounded-2xl p-5 shadow-soft space-y-4">
          <div className="flex items-center gap-2">
            <Cake className="w-5 h-5 text-coral-400" />
            <h2 className="font-semibold text-txt-primary">내 생일</h2>
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthday">생일 날짜</Label>
            <Input
              id="birthday"
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <Button
            onClick={handleSaveBirthday}
            disabled={saving || !birthday}
            className="w-full rounded-full bg-coral-400 hover:bg-coral-500 text-white"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "저장"}
          </Button>
        </section>

        {/* 알림 설정 */}
        <section className="bg-white rounded-2xl p-5 shadow-soft">
          <NotificationToggle />
        </section>

        {/* 초대 코드 */}
        {inviteCode && (
          <section className="bg-white rounded-2xl p-5 shadow-soft space-y-3">
            <h2 className="font-semibold text-txt-primary">초대 코드</h2>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 bg-cream-dark rounded-xl px-4 py-2.5 w-full"
            >
              <span className="text-lg font-bold tracking-widest text-coral-400 flex-1 text-left">
                {inviteCode}
              </span>
              {copied ? (
                <Check className="w-4 h-4 text-green-soft" />
              ) : (
                <Copy className="w-4 h-4 text-coral-300" />
              )}
            </button>
            <p className="text-xs text-txt-tertiary">
              {isPartnerConnected
                ? "상대방이 연결되어 있어요"
                : "상대방에게 이 코드를 공유해주세요"}
            </p>
          </section>
        )}

        {/* 로그아웃 */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-txt-secondary w-full justify-center py-3"
        >
          <LogOut className="w-4 h-4" />
          로그아웃
        </button>
      </div>
    </AppLayout>
  );
}
