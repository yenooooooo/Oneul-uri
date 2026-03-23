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
 * 커플 프로필 카드 — 홈 상단에 둘의 이모지 + 닉네임 + 상태 메시지
 * user2 미연결 시 나만 표시
 */
export default function CoupleProfileCard({
  myEmoji, myNickname, myStatus,
  partnerEmoji, partnerNickname, partnerStatus,
  isPartnerConnected,
}: CoupleProfileCardProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      {/* 내 프로필 */}
      <div className="flex flex-col items-center">
        <span className="text-3xl mb-1">{myEmoji}</span>
        <p className="text-sm font-medium text-txt-primary">{myNickname}</p>
        {myStatus && (
          <p className="text-xs text-txt-tertiary mt-0.5 max-w-[100px] truncate">
            {myStatus}
          </p>
        )}
      </div>

      {/* 하트 연결선 */}
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-lg">💕</span>
      </div>

      {/* 상대방 프로필 */}
      {isPartnerConnected ? (
        <div className="flex flex-col items-center">
          <span className="text-3xl mb-1">{partnerEmoji}</span>
          <p className="text-sm font-medium text-txt-primary">{partnerNickname}</p>
          {partnerStatus && (
            <p className="text-xs text-txt-tertiary mt-0.5 max-w-[100px] truncate">
              {partnerStatus}
            </p>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center opacity-40">
          <span className="text-3xl mb-1">❓</span>
          <p className="text-sm text-txt-tertiary">대기 중</p>
        </div>
      )}
    </div>
  );
}
