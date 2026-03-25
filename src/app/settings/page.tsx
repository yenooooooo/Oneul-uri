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
 * 설정 페이지 — Editorial Keepsake 스타일
 */
export default function SettingsPage() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const {
    myNickname, myBirthday, myEmoji, myStatus, myRole,
    inviteCode, isPartnerConnected, updateBirthday, updateProfile,
  } = useCouple();
  const { upsertBirthday } = useAnniversary();

  const [birthday, setBirthday] = useState("");
  const [emoji, setEmoji] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (myBirthday) setBirthday(myBirthday);
    if (myEmoji) setEmoji(myEmoji);
    if (myStatus) setStatus(myStatus);
  }, [myBirthday, myEmoji, myStatus]);

  const handleSaveBirthday = async () => {
    if (!birthday || !myNickname) return;
    setSaving(true);
    const success = await updateBirthday(birthday);
    if (success) {
      await upsertBirthday(myNickname, birthday);
      toast.success("생일이 저장되었어요!");
    } else {
      toast.error("생일 저장에 실패했어요.");
    }
    setSaving(false);
  };

  const handleCopy = async () => {
    if (!inviteCode) return;
    await navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    toast.success("초대 코드가 복사되었어요!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <AppLayout>
      <div className="px-6 pt-6 pb-8 space-y-8 animate-page-in">
        {/* 상단 */}
        <div>
          <button onClick={() => router.back()} className="p-1 mb-2">
            <ArrowLeft className="w-5 h-5 text-txt-primary" />
          </button>
          <h1 className="font-serif-ko text-3xl font-black text-txt-primary">설정</h1>
        </div>

        {/* 프로필 */}
        <section className="bg-surface-low rounded-3xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-txt-tertiary">내 프로필</h2>
          <div className="flex gap-3">
            <div className="space-y-1.5 w-20">
              <Label htmlFor="emoji">이모지</Label>
              <Input id="emoji" value={emoji} maxLength={2}
                onChange={(e) => setEmoji(e.target.value)}
                className="rounded-xl text-center text-2xl bg-white" />
            </div>
            <div className="space-y-1.5 flex-1">
              <Label htmlFor="status">오늘의 한마디</Label>
              <Input id="status" placeholder="상태 메시지를 입력해보세요"
                value={status} maxLength={30}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-xl bg-white" />
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
            className="w-full rounded-full bg-coral-500 hover:bg-coral-600 text-white">
            {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : "프로필 저장"}
          </Button>
        </section>

        {/* 생일 */}
        <section className="bg-surface-low rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-txt-tertiary flex items-center gap-2">
              <Cake className="w-4 h-4 text-coral-500" />
              내 생일
            </h2>
            {myBirthday && (
              <span className="text-xs bg-coral-50 text-coral-500 px-2.5 py-1 rounded-full font-bold">
                🎂 {new Date(myBirthday).getMonth() + 1}월 {new Date(myBirthday).getDate()}일
              </span>
            )}
          </div>
          <Input id="birthday" type="date" value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className="rounded-xl bg-white" />
          <Button onClick={handleSaveBirthday}
            disabled={saving || !birthday || birthday === myBirthday}
            className="w-full rounded-full bg-coral-500 hover:bg-coral-600 text-white">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : myBirthday ? "수정" : "저장"}
          </Button>
        </section>

        {/* 알림 */}
        <section className="bg-surface-low rounded-3xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-txt-tertiary">알림</h2>
          <NotificationToggle />
          {myRole === "user1" && (
            <button
              onClick={async () => {
                try {
                  const res = await fetch("/api/notifications", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ type: "test", user_id: user?.id }),
                  });
                  const data = await res.json();
                  toast.success(`테스트 알림 발송! (${data.sent ?? 0}건)`);
                } catch {
                  toast.error("테스트 알림 발송에 실패했어요.");
                }
              }}
              className="w-full py-2.5 text-sm text-coral-500 border border-coral-200 rounded-full">
              테스트 알림 보내기
            </button>
          )}
        </section>

        {/* 초대 코드 */}
        {inviteCode && (
          <section className="bg-surface-low rounded-3xl p-6 space-y-3">
            <h2 className="text-sm font-bold text-txt-tertiary">초대 코드</h2>
            <button onClick={handleCopy}
              className="flex items-center gap-3 bg-white rounded-2xl px-5 py-4 w-full active:scale-[0.98] transition-transform">
              <span className="text-2xl font-bold tracking-widest text-coral-500 font-serif-ko flex-1 text-left">
                {inviteCode}
              </span>
              {copied ? (
                <Check className="w-5 h-5 text-green-soft" />
              ) : (
                <Copy className="w-5 h-5 text-coral-300" />
              )}
            </button>
            <p className="text-xs text-txt-tertiary">
              {isPartnerConnected ? "상대방이 연결되어 있어요 ✓" : "상대방에게 이 코드를 공유해주세요"}
            </p>
          </section>
        )}

        {/* 로그아웃 */}
        <button onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-txt-tertiary w-full justify-center py-4 rounded-2xl bg-surface-low active:bg-surface-high transition-colors">
          <LogOut className="w-4 h-4" />
          로그아웃
        </button>
      </div>
    </AppLayout>
  );
}
