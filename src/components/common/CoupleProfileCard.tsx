"use client";

interface CoupleProfileCardProps {
  myEmoji: string;
  myNickname: string;
  myStatus: string;
  partnerEmoji: string | null;
  partnerNickname: string | null;
  partnerStatus: string | null;
  isPartnerConnected: boolean;
}

/**
 * 커플 프로필 카드 — stitch 스타일
 * 이모지 겹침 + 그라데이션 배경 + 인용구
 */
export default function CoupleProfileCard({
  myEmoji, myNickname, myStatus,
  partnerEmoji, partnerNickname, partnerStatus,
  isPartnerConnected,
}: CoupleProfileCardProps) {
  // 상태 메시지 중 하나를 인용구로 표시
  const quote = myStatus || partnerStatus || "";

  return (
    <div className="bg-gradient-to-br from-coral-50 via-white to-pink-soft/10 p-8 rounded-3xl flex flex-col items-center text-center space-y-5">
      {/* 이모지 겹침 */}
      <div className="flex items-center justify-center -space-x-4">
        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-4xl border-4 border-white"
          style={{ boxShadow: "0 4px 16px rgba(174,47,52,0.08)" }}>
          {myEmoji}
        </div>
        {isPartnerConnected ? (
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-4xl border-4 border-white"
            style={{ boxShadow: "0 4px 16px rgba(174,47,52,0.08)" }}>
            {partnerEmoji}
          </div>
        ) : (
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-4xl border-4 border-white opacity-30"
            style={{ boxShadow: "0 4px 16px rgba(174,47,52,0.08)" }}>
            ?
          </div>
        )}
      </div>

      {/* 닉네임 */}
      <div className="space-y-2">
        <div className="flex items-center justify-center gap-4 font-bold text-lg text-txt-primary">
          <span className="font-serif-ko">{myNickname}</span>
          <span className="text-coral-300">♥</span>
          <span className="font-serif-ko">{isPartnerConnected ? partnerNickname : "대기 중"}</span>
        </div>
        {/* 인용구 */}
        {quote && (
          <p className="text-txt-tertiary italic text-sm">
            &ldquo;{quote}&rdquo;
          </p>
        )}
      </div>
    </div>
  );
}
