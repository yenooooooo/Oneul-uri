"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LetterCard from "@/components/penpal/LetterCard";
import EnvelopeOpener from "@/components/penpal/EnvelopeOpener";
import InviteBanner from "@/components/common/InviteBanner";
import { usePenpal } from "@/hooks/usePenpal";
import { useCouple } from "@/hooks/useCouple";
import { PenSquare, Loader2, Mail, UserPlus } from "lucide-react";
import type { PenpalLetter } from "@/types";

/**
 * 편지함 페이지 — /penpal
 * 받은 편지 / 보낸 편지 탭 + 편지 쓰기 FAB 버튼
 * user2 미연결 시 초대 안내 표시, 편지 기능 비활성화
 */
export default function PenpalPage() {
  const router = useRouter();
  const { received, sent, loading, markAsRead } = usePenpal();
  const { partnerNickname, isPartnerConnected, inviteCode } = useCouple();
  const [openLetter, setOpenLetter] = useState<PenpalLetter | null>(null); // 열람 중인 편지

  /** 편지 클릭 — 받은 편지면 봉투 열기, 보낸 편지면 바로 내용 표시 */
  const handleLetterClick = (letter: PenpalLetter, isReceived: boolean) => {
    setOpenLetter(letter);
    // 받은 편지이고 읽지 않았으면 읽음 처리
    if (isReceived && !letter.is_read) {
      markAsRead(letter.id);
    }
  };

  return (
    <AppLayout>
      <div className="px-4 pt-6">
        {/* 페이지 헤더 */}
        <h1 className="text-2xl font-bold text-txt-primary mb-4">편지함</h1>

        {/* user2 미연결 시 — 초대 안내 화면 */}
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

            {/* 받은 편지 탭 */}
            <TabsContent value="received" className="space-y-2">
              {received.length > 0 ? (
                received.map((letter) => (
                  <LetterCard
                    key={letter.id}
                    letter={letter}
                    senderName={partnerNickname ?? "상대방"}
                    isReceived
                    onClick={() => handleLetterClick(letter, true)}
                  />
                ))
              ) : (
                <EmptyLetters message="아직 받은 편지가 없어요" />
              )}
            </TabsContent>

            {/* 보낸 편지 탭 */}
            <TabsContent value="sent" className="space-y-2">
              {sent.length > 0 ? (
                sent.map((letter) => (
                  <LetterCard
                    key={letter.id}
                    letter={letter}
                    senderName={partnerNickname ?? "상대방"}
                    isReceived={false}
                    onClick={() => handleLetterClick(letter, false)}
                  />
                ))
              ) : (
                <EmptyLetters message="아직 보낸 편지가 없어요" />
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* FAB — 편지 쓰기 버튼 (user2 연결 시에만 표시) */}
      {isPartnerConnected && (
        <button
          onClick={() => router.push("/penpal/write")}
          className="fixed bottom-20 right-4 w-14 h-14 bg-coral-400 rounded-full shadow-float flex items-center justify-center text-white active:scale-95 transition-transform z-40"
        >
          <PenSquare className="w-6 h-6" />
        </button>
      )}

      {/* 봉투 열기 / 편지 읽기 오버레이 */}
      {openLetter && (
        <EnvelopeOpener
          letter={openLetter}
          onClose={() => setOpenLetter(null)}
        />
      )}
    </AppLayout>
  );
}

/** 빈 편지함 표시 컴포넌트 */
function EmptyLetters({ message }: { message: string }) {
  return (
    <div className="text-center py-12">
      <Mail className="w-12 h-12 text-coral-200 mx-auto mb-3" />
      <p className="text-txt-secondary font-medium">{message}</p>
      <p className="text-sm text-txt-tertiary mt-1">
        소중한 마음을 편지로 전해보세요
      </p>
    </div>
  );
}
