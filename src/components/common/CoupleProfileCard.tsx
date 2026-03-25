"use client";

/** CoupleProfileCard 컴포넌트 props */
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
 * 커플 프로필 카드 — Editorial Keepsake 스타일
 * Tonal layering + 넉넉한 패딩 + 세리프 닉네임
 */
export default function CoupleProfileCard({
  myEmoji, myNickname, myStatus,
  partnerEmoji, partnerNickname, partnerStatus,
  isPartnerConnected,
}: CoupleProfileCardProps) {
  return (
    <div className="bg-surface-low rounded-3xl p-6 flex items-center justify-center gap-8">
      {/* 내 프로필 */}
      <div className="flex flex-col items-center">
        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-2xl mb-2">
          {myEmoji}
        </div>
        <p className="text-sm font-serif-ko font-semibold text-txt-primary">{myNickname}</p>
        {myStatus && (
          <p className="text-[11px] text-txt-tertiary mt-0.5 max-w-[100px] truncate italic">
            {myStatus}
          </p>
        )}
      </div>

      {/* 하트 */}
      <span className="text-xl opacity-60">♥</span>

      {/* 상대방 프로필 */}
      {isPartnerConnected ? (
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-2xl mb-2">
            {partnerEmoji}
          </div>
          <p className="text-sm font-serif-ko font-semibold text-txt-primary">{partnerNickname}</p>
          {partnerStatus && (
            <p className="text-[11px] text-txt-tertiary mt-0.5 max-w-[100px] truncate italic">
              {partnerStatus}
            </p>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center opacity-30">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-2xl mb-2">
            ?
          </div>
          <p className="text-sm text-txt-tertiary">대기 중</p>
        </div>
      )}
    </div>
  );
}
