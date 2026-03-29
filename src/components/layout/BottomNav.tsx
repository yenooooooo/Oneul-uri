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
 * 하단 네비게이션 — 플로팅 아일랜드 스타일
 * 가장자리에서 떨어진 둥근 섬 형태 + 글래스모피즘
 */
export default function BottomNav() {
  const pathname = usePathname();
  const { unreadCount } = usePenpal();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-5"
      style={{
        paddingBottom: "env(safe-area-inset-bottom, 8px)",
        transform: "translateZ(0)",       /* GPU 레이어 분리 — iOS fixed 안정화 */
        WebkitTransform: "translateZ(0)",
      }}>
      {/* 플로팅 아일랜드 */}
      <div className="flex items-center justify-around h-14 bg-white rounded-2xl max-w-lg mx-auto"
        style={{ boxShadow: "0 4px 24px rgba(174, 47, 52, 0.06)" }}>
        {TABS.map(({ href, label, Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          const showBadge = href === "/penpal" && unreadCount > 0;

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 py-2 px-4 transition-all duration-200 active:scale-95",
                isActive ? "text-coral-500" : "text-txt-tertiary"
              )}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {showBadge && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-coral-500" />
                )}
              </div>
              <span className={cn(
                "text-[10px] leading-none mt-0.5",
                isActive ? "font-semibold" : "font-medium"
              )}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
