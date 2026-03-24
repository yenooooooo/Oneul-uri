"use client";

import { useEffect, useState } from "react";
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
    myNickname, myBirthday, myEmoji, myStatus,
    inviteCode, isPartnerConnected, updateBirthday, updateProfile,
  } = useCouple();
  const { upsertBirthday } = useAnniversary();

  const [birthday, setBirthday] = useState(""); // 생일 입력값
  const [emoji, setEmoji] = useState(""); // 이모지 입력값
  const [status, setStatus] = useState(""); // 상태 메시지 입력값
  const [saving, setSaving] = useState(false); // 저장 중
  const [savingProfile, setSavingProfile] = useState(false); // 프로필 저장 중
  const [copied, setCopied] = useState(false); // 초대 코드 복사 상태

  // 비동기 로드 후 입력값 반영
  useEffect(() => {
    if (myBirthday) setBirthday(myBirthday);
    if (myEmoji) setEmoji(myEmoji);
    if (myStatus) setStatus(myStatus);
  }, [myBirthday, myEmoji, myStatus]);

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

        {/* 프로필 — 이모지 + 상태 메시지 */}
        <section className="bg-white rounded-2xl p-5 shadow-soft space-y-4">
          <h2 className="font-semibold text-txt-primary">내 프로필</h2>
          <div className="flex gap-3">
            <div className="space-y-1.5 w-20">
              <Label htmlFor="emoji">이모지</Label>
              <Input id="emoji" value={emoji} maxLength={2}
                onChange={(e) => setEmoji(e.target.value)}
                className="rounded-xl text-center text-2xl" />
            </div>
            <div className="space-y-1.5 flex-1">
              <Label htmlFor="status">오늘의 한마디</Label>
              <Input id="status" placeholder="상태 메시지를 입력해보세요"
                value={status} maxLength={30}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-xl" />
            </div>
          </div>
          <Button
            onClick={async () => {
              setSavingProfile(true);
              const ok = await updateProfile(emoji || undefined, status);
              if (ok) toast.success("프로필이 저장되었어요!");
              else toast.error("프로필 저장에 실패했어요.");
              setSavingProfile(false);
            }}
            disabled={savingProfile}
            className="w-full rounded-full bg-coral-400 hover:bg-coral-500 text-white"
          >
            {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : "프로필 저장"}
          </Button>
        </section>

        {/* 생일 입력 */}
        <section className="bg-white rounded-2xl p-5 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cake className="w-5 h-5 text-coral-400" />
              <h2 className="font-semibold text-txt-primary">내 생일</h2>
            </div>
            {/* 저장된 생일 표시 */}
            {myBirthday && (
              <span className="text-xs bg-coral-50 text-coral-400 px-2.5 py-1 rounded-full font-medium">
                🎂 {new Date(myBirthday).getMonth() + 1}월 {new Date(myBirthday).getDate()}일
              </span>
            )}
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
            disabled={saving || !birthday || birthday === myBirthday}
            className="w-full rounded-full bg-coral-400 hover:bg-coral-500 text-white"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : myBirthday ? "수정" : "저장"}
          </Button>
        </section>

        {/* 알림 설정 */}
        <section className="bg-white rounded-2xl p-5 shadow-soft space-y-3">
          <NotificationToggle />
          {/* 테스트 알림 버튼 */}
          <button
            onClick={async () => {
              try {
                const res = await fetch("/api/notifications", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ type: "test" }),
                });
                const data = await res.json();
                toast.success(`테스트 알림 발송! (${data.sent ?? 0}건)`);
              } catch {
                toast.error("테스트 알림 발송에 실패했어요.");
              }
            }}
            className="w-full py-2.5 text-sm text-coral-400 border border-coral-200 rounded-full"
          >
            테스트 알림 보내기
          </button>
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
