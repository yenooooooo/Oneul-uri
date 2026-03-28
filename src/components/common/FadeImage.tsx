"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface FadeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** 고정 aspect ratio (예: "1/1", "4/3", "16/9") */
  aspect?: string;
}

/**
 * 이미지 페이드인 컴포넌트 — 로드 전 블러 플레이스홀더 + 로드 후 부드러운 전환
 * 레이아웃 시프트 방지: aspect-ratio 고정
 */
export default function FadeImage({ aspect, className, alt, ...props }: FadeImageProps) {
  const [loaded, setLoaded] = useState(false); // 이미지 로드 완료 여부

  return (
    <div
      className={cn("overflow-hidden bg-gray-100", className)}
      style={aspect ? { aspectRatio: aspect } : undefined}
    >
      <img
        alt={alt ?? ""}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={cn(
          "w-full h-full object-cover transition-all duration-500",
          loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
        )}
        {...props}
      />
    </div>
  );
}
