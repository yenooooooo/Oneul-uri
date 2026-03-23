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
 * 하단 네비게이션 바 — 5탭
 * iOS safe area: nav 자체에 padding-bottom 적용
 * 아이콘 영역은 h-14 고정, safe area는 그 아래 여백
 */
export default function BottomNav() {
  const pathname = usePathname();
  const { unreadCount } = usePenpal();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-coral-100"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {/* 아이콘 영역 — 고정 높이 56px, 세로 중앙 정렬 */}
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
        {TABS.map(({ href, label, Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          const showBadge = href === "/penpal" && unreadCount > 0;

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 w-14 h-12 transition-colors",
                isActive ? "text-coral-400" : "text-txt-tertiary"
              )}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {showBadge && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-coral-400" />
                )}
              </div>
              <span className="text-[10px] font-medium leading-none">{label}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-coral-400 mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
