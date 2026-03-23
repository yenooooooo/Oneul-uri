"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LetterList from "@/components/penpal/LetterList";
import EnvelopeOpener from "@/components/penpal/EnvelopeOpener";
import InviteBanner from "@/components/common/InviteBanner";
import { usePenpal } from "@/hooks/usePenpal";
import { useCouple } from "@/hooks/useCouple";
import { PenSquare, Loader2, UserPlus } from "lucide-react";
import type { PenpalLetter } from "@/types";

/**
 * 편지함 페이지 — /penpal
 * 읽지 않은 편지 상단 고정 + 월별 그룹핑 + 무한 스크롤
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

  /** 편지 클릭 — 봉투 열기 + 읽음 처리 */
  const handleLetterClick = (letter: PenpalLetter, isReceived: boolean) => {
    setOpenLetter(letter);
    if (isReceived && !letter.is_read) markAsRead(letter.id);
  };

  return (
    <AppLayout>
      <div className="px-4 pt-6">
        {/* 헤더 + 읽지 않은 편지 뱃지 */}
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-2xl font-bold text-txt-primary">편지함</h1>
          {unreadCount > 0 && (
            <span className="bg-coral-400 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>

        {/* user2 미연결 시 — 초대 안내 */}
        {!isPartnerConnected ? (
          <div className="space-y-6">
            <div className="text-center py-8">
              <UserPlus className="w-16 h-16 text-coral-200 mx-auto mb-4" />
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
            <Loader2 className="w-6 h-6 animate-spin text-coral-400" />
          </div>
        ) : (
          <Tabs defaultValue="received" className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-full bg-cream-dark mb-4">
              <TabsTrigger value="received" className="rounded-full">
                받은 편지
              </TabsTrigger>
              <TabsTrigger value="sent" className="rounded-full">
                보낸 편지
              </TabsTrigger>
            </TabsList>

            <TabsContent value="received">
              <LetterList
                letters={received}
                senderName={partnerNickname ?? "상대방"}
                isReceived
                hasMore={hasMoreReceived}
                loadingMore={loadingMore}
                onLoadMore={loadMoreReceived}
                onLetterClick={(l) => handleLetterClick(l, true)}
              />
            </TabsContent>

            <TabsContent value="sent">
              <LetterList
                letters={sent}
                senderName={partnerNickname ?? "상대방"}
                isReceived={false}
                hasMore={hasMoreSent}
                loadingMore={loadingMore}
                onLoadMore={loadMoreSent}
                onLetterClick={(l) => handleLetterClick(l, false)}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* FAB — 편지 쓰기 (user2 연결 시만) */}
      {isPartnerConnected && (
        <button
          onClick={() => router.push("/penpal/write")}
          style={{ bottom: "calc(5rem + env(safe-area-inset-bottom, 0px))" }}
          className="fixed right-4 w-14 h-14 bg-coral-400 rounded-full shadow-float flex items-center justify-center text-white active:scale-95 transition-transform z-40"
        >
          <PenSquare className="w-6 h-6" />
        </button>
      )}

      {/* 봉투 열기 오버레이 */}
      {openLetter && (
        <EnvelopeOpener
          letter={openLetter}
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
