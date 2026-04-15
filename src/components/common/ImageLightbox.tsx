"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { useLockScroll } from "@/hooks/useLockScroll";

interface ImageLightboxProps {
  src: string; // 전체화면으로 볼 이미지 URL
  alt?: string; // 접근성용 대체 텍스트
  onClose: () => void; // 닫기 콜백
}

/**
 * 이미지 전체화면 뷰어 — 탭하면 닫히고, ESC 키도 지원
 * 배경 검정, 이미지는 object-contain으로 비율 유지하며 전체 표시
 */
export default function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
  useLockScroll(); // 뒷배경 스크롤 방지 + BottomNav 자동 숨김

  // ESC 키로 닫기
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center animate-fade-in"
    >
      {/* 닫기 버튼 (우상단) — 이미지 클릭 이벤트와 구분 */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute top-4 right-4 p-2 text-white/80 hover:text-white z-10"
        aria-label="닫기"
      >
        <X className="w-6 h-6" />
      </button>

      {/* 이미지 본체 — 탭해도 닫힘 (오버레이에 이벤트 위임) */}
      <img
        src={src}
        alt={alt ?? ""}
        className="max-w-full max-h-full object-contain select-none"
        draggable={false}
      />

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
