"use client";

import { useRef, useState, useEffect } from "react";
import FadeImage from "@/components/common/FadeImage";

interface Props {
  photos: string[];
}

/**
 * 사진 갤러리 — 가로 스크롤 + 도트 인디케이터
 * 스크롤 위치에 따라 현재 사진 인덱스를 계산하여 도트 활성화
 */
export default function PhotoGallery({ photos }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0); // 현재 보이는 사진 인덱스

  /** 스크롤 이벤트로 현재 인덱스 계산 */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const scrollLeft = el.scrollLeft;
      const itemWidth = 288 + 8; // w-72(288px) + gap-2(8px)
      const index = Math.round(scrollLeft / itemWidth);
      setActiveIndex(Math.min(index, photos.length - 1));
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [photos.length]);

  return (
    <div className="space-y-2">
      {/* 가로 스크롤 사진 */}
      <div ref={scrollRef}
        className="flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-hide snap-x snap-mandatory">
        {photos.map((url, i) => (
          <FadeImage key={url} src={url} alt={`사진 ${i + 1}`}
            className="w-72 h-48 rounded-2xl flex-shrink-0 snap-center" />
        ))}
      </div>

      {/* 도트 인디케이터 — 2장 이상일 때만 */}
      {photos.length > 1 && (
        <div className="flex justify-center gap-1.5">
          {photos.map((_, i) => (
            <div key={i}
              className={`rounded-full transition-all duration-200 ${
                i === activeIndex ? "w-4 h-1.5 bg-coral-500" : "w-1.5 h-1.5 bg-gray-200"
              }`} />
          ))}
        </div>
      )}
    </div>
  );
}
