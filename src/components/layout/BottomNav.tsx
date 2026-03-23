"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PenSquare, Calendar, Mail, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePenpal } from "@/hooks/usePenpal";

/** 하단 네비게이션 탭 정의 */
const TABS = [
  { href: "/", label: "홈", Icon: Home },
  { href: "/records", label: "기록", Icon: PenSquare },
  { href: "/calendar", label: "캘린더", Icon: Calendar },
  { href: "/penpal", label: "편지", Icon: Mail },
  { href: "/wallet", label: "통장", Icon: Wallet },
] as const;

/**
 * 하단 네비게이션 바 — 5탭 (홈, 기록, 캘린더, 편지, 통장)
 * 현재 페이지에 해당하는 탭 활성화 표시
 * 편지 탭에 읽지 않은 편지 뱃지 표시
 * iOS safe area 대응 포함
 */
export default function BottomNav() {
  const pathname = usePathname(); // 현재 경로
  const { unreadCount } = usePenpal(); // 읽지 않은 편지 수

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-coral-100">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto pb-safe">
        {TABS.map(({ href, label, Icon }) => {
          // 현재 경로와 탭 경로 비교 (홈은 정확 매칭, 나머지는 시작 매칭)
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);

          // 편지 탭에 읽지 않은 편지 뱃지 표시
          const showBadge = href === "/penpal" && unreadCount > 0;

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 transition-colors relative",
                isActive ? "text-coral-400" : "text-txt-tertiary"
              )}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {/* 읽지 않은 편지 빨간 도트 */}
                {showBadge && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-coral-400" />
                )}
              </div>
              <span className="text-xs font-medium">{label}</span>
              {/* 활성 탭 도트 인디케이터 */}
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-coral-400" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
