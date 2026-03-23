"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Calendar, Mail, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePenpal } from "@/hooks/usePenpal";

/** 하단 네비게이션 탭 정의 */
const TABS = [
  { href: "/", label: "홈", Icon: Home },
  { href: "/records", label: "기록", Icon: BookOpen },
  { href: "/calendar", label: "캘린더", Icon: Calendar },
  { href: "/penpal", label: "편지", Icon: Mail },
  { href: "/wallet", label: "통장", Icon: Wallet },
] as const;

/**
 * 하단 네비게이션 바 — iOS PWA 최적화 2단 구조
 * 상단: 실제 네비 터치 영역 (h-16)
 * 하단: safe area 채움 (홈 인디케이터 뒤 배경만)
 */
export default function BottomNav() {
  const pathname = usePathname();
  const { unreadCount } = usePenpal();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      {/* 상단: 실제 네비 터치 영역 */}
      <div className="flex items-center justify-around h-16 bg-white/80 backdrop-blur-xl border-t border-pink-soft/30 max-w-lg mx-auto">
        {TABS.map(({ href, label, Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          const showBadge = href === "/penpal" && unreadCount > 0;

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 py-2 px-5 transition-colors duration-200 active:scale-95",
                isActive ? "text-coral-400" : "text-gray-400"
              )}
            >
              {/* 활성 도트 인디케이터 (아이콘 위) */}
              {isActive ? (
                <span className="w-1 h-1 rounded-full bg-coral-400 mb-0.5" />
              ) : (
                <span className="w-1 h-1 mb-0.5" />
              )}

              <div className="relative">
                <Icon className="w-[22px] h-[22px]" />
                {/* 읽지 않은 편지 빨간 도트 */}
                {showBadge && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-coral-400 border border-white" />
                )}
              </div>

              <span className="text-[11px] font-medium leading-none mt-0.5">
                {label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* 하단: safe area 채움 (홈 인디케이터 뒤 배경만) */}
      <div
        className="bg-white/80 backdrop-blur-xl"
        style={{ height: "env(safe-area-inset-bottom, 0px)" }}
      />
    </nav>
  );
}
