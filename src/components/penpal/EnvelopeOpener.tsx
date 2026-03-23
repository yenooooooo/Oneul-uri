"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { PenpalLetter } from "@/types";

/** EnvelopeOpener 컴포넌트 props */
interface EnvelopeOpenerProps {
  letter: PenpalLetter;
  onClose: () => void;
}

/** 편지지 배경 스타일 매핑 */
const STATIONERY_STYLES: Record<string, string> = {
  default: "bg-[#FFFDF7]",
  flower: "bg-[#FFF5F5]",
  star: "bg-[#F5F5FF]",
  lined: "bg-white",
  craft: "bg-[#F5EDE0]",
};

/**
 * 봉투 열기 연출 컴포넌트 — 전체화면 오버레이
 * Step 1: 봉투 등장 (scale 애니메이션)
 * Step 2: 탭하면 편지지 슬라이드업
 * Step 3: 편지 내용 표시 (손글씨 폰트)
 */
export default function EnvelopeOpener({ letter, onClose }: EnvelopeOpenerProps) {
  const [isOpened, setIsOpened] = useState(false); // 봉투 열림 상태

  // 편지지 배경 클래스
  const bgClass = STATIONERY_STYLES[letter.stationery] ?? STATIONERY_STYLES.default;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-6">
      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white/80 hover:text-white z-10"
      >
        <X className="w-6 h-6" />
      </button>

      {!isOpened ? (
        /* === 봉투 (열기 전) === */
        <button
          onClick={() => setIsOpened(true)}
          className="animate-envelope-appear cursor-pointer"
        >
          {/* 봉투 본체 */}
          <div className="w-72 h-44 bg-coral-100 rounded-2xl shadow-float relative overflow-hidden">
            {/* 봉투 뚜껑 */}
            <div className="absolute top-0 left-0 right-0 h-20 bg-coral-200 rounded-t-2xl"
              style={{
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              }}
            />
            {/* 하트 씰 */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-10 h-10 bg-coral-400 rounded-full flex items-center justify-center shadow-md z-10">
              <span className="text-white text-lg">💌</span>
            </div>
            {/* 안내 텍스트 */}
            <p className="absolute bottom-4 w-full text-center text-sm text-coral-500 font-medium">
              탭해서 열어보세요
            </p>
          </div>
        </button>
      ) : (
        /* === 편지 내용 (열린 후) === */
        <div className="animate-letter-slide-up w-full max-w-sm">
          <div className={`${bgClass} rounded-3xl p-6 shadow-float min-h-[400px] flex flex-col`}>
            {/* 편지지 상단 장식 */}
            <div className="text-center mb-4 pb-3 border-b border-coral-100/50">
              <p className="text-xs text-txt-tertiary">
                {formatDate(letter.created_at.split("T")[0], "long")}
              </p>
            </div>

            {/* 편지 내용 — 손글씨 폰트 */}
            <div className="flex-1">
              <p className="font-handwriting text-xl leading-relaxed text-txt-primary whitespace-pre-wrap">
                {letter.content}
              </p>
            </div>

            {/* 첨부 사진 */}
            {letter.photo_url && (
              <div className="mt-4 rounded-xl overflow-hidden">
                <img
                  src={letter.photo_url}
                  alt="첨부 사진"
                  className="w-full h-48 object-cover"
                />
              </div>
            )}

            {/* 닫기 */}
            <button
              onClick={onClose}
              className="mt-4 w-full py-2.5 bg-coral-400 text-white rounded-full text-sm font-medium active:scale-95 transition-transform"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 봉투 열기 + 편지 슬라이드업 CSS 애니메이션 */}
      <style jsx>{`
        @keyframes envelopeAppear {
          from { transform: scale(0.3); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes letterSlideUp {
          from { transform: translateY(60px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-envelope-appear {
          animation: envelopeAppear 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .animate-letter-slide-up {
          animation: letterSlideUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
      `}</style>
    </div>
  );
}
