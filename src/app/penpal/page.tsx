"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import LetterList from "@/components/penpal/LetterList";
import EnvelopeOpener from "@/components/penpal/EnvelopeOpener";
import InviteBanner from "@/components/common/InviteBanner";
import { usePenpal } from "@/hooks/usePenpal";
import { useCouple } from "@/hooks/useCouple";
import { PenSquare, Loader2, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PenpalLetter } from "@/types";

/**
 * 편지함 — stitch(5) Editorial Keepsake 스타일
 */
export default function PenpalPage() {
  const router = useRouter();
  const {
    received, sent, loading, loadingMore, unreadCount,
    hasMoreReceived, hasMoreSent,
    markAsRead, loadMoreReceived, loadMoreSent,
  } = usePenpal();
  const { partnerNickname, isPartnerConnected, inviteCode } = useCouple();
  const [openLetter, setOpenLetter] = useState<PenpalLetter | null>(null);
  const [tab, setTab] = useState<"received" | "sent">("received");

  const handleLetterClick = (letter: PenpalLetter, isReceived: boolean) => {
    setOpenLetter(letter);
    if (isReceived && !letter.is_read) markAsRead(letter.id);
  };

  return (
    <AppLayout>
      <div className="px-6 pt-6 space-y-8 animate-page-in">
        {/* 상단 타이틀 — stitch 매거진 스타일 */}
        <div>
          <p className="text-[10px] font-bold text-txt-tertiary tracking-widest uppercase">
            THE KEEPSAKE 편지함
          </p>
          <h1 className="font-serif-ko text-3xl font-black text-txt-primary">
            마음을 담은<br />조각들
          </h1>
          <p className="text-sm text-txt-tertiary mt-2">
            시간이 흘러도, 변하지 않는 우리의 편지
          </p>
        </div>

        {/* user2 미연결 */}
        {!isPartnerConnected ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center text-center py-16">
              <UserPlus className="w-16 h-16 text-coral-200 mb-4" />
              <p className="font-medium text-txt-primary">
                상대방을 초대하면 편지를 주고받을 수 있어요
              </p>
              <p className="text-sm text-txt-tertiary mt-1">
                아래 초대 코드를 공유해주세요
              </p>
            </div>
            {inviteCode && <InviteBanner inviteCode={inviteCode} />}
          </div>
        ) : loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-coral-300" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* pill 탭 */}
            <div className="flex gap-2">
              <button onClick={() => setTab("received")}
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-medium transition-all",
                  tab === "received"
                    ? "bg-coral-500 text-white"
                    : "bg-surface-low text-txt-tertiary"
                )}>
                받은 편지 {unreadCount > 0 && `(${unreadCount})`}
              </button>
              <button onClick={() => setTab("sent")}
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-medium transition-all",
                  tab === "sent"
                    ? "bg-coral-500 text-white"
                    : "bg-surface-low text-txt-tertiary"
                )}>
                보낸 편지
              </button>
            </div>

            {/* 탭 콘텐츠 */}
            {tab === "received" && (
              <LetterList
                letters={received} senderName={partnerNickname ?? "상대방"}
                isReceived hasMore={hasMoreReceived} loadingMore={loadingMore}
                onLoadMore={loadMoreReceived}
                onLetterClick={(l) => handleLetterClick(l, true)}
              />
            )}
            {tab === "sent" && (
              <LetterList
                letters={sent} senderName={partnerNickname ?? "상대방"}
                isReceived={false} hasMore={hasMoreSent} loadingMore={loadingMore}
                onLoadMore={loadMoreSent}
                onLetterClick={(l) => handleLetterClick(l, false)}
              />
            )}
          </div>
        )}
      </div>

      {/* FAB */}
      {isPartnerConnected && (
        <button onClick={() => router.push("/penpal/write")}
          style={{ bottom: "calc(5.5rem + env(safe-area-inset-bottom, 0px))" }}
          className="fixed right-5 w-14 h-14 bg-coral-500 rounded-full shadow-float flex items-center justify-center text-white active:scale-95 transition-transform z-40">
          <PenSquare className="w-6 h-6" />
        </button>
      )}

      {/* 봉투 열기 */}
      {openLetter && (
        <EnvelopeOpener letter={openLetter}
          onClose={() => setOpenLetter(null)}
          onReply={(letter) => {
            setOpenLetter(null);
            const preview = encodeURIComponent(letter.content.slice(0, 50));
            router.push(`/penpal/write?replyTo=${letter.id}&replyPreview=${preview}`);
          }}
        />
      )}
    </AppLayout>
  );
}
