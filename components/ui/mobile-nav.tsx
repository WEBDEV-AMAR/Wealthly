"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  ChevronUp,
  LayoutDashboard,
  MoreHorizontal,
  Receipt,
  Target,
  TrendingUp,
  Wallet,
  Settings,
  CreditCard,
  Bot,
} from "lucide-react";
import { useState } from "react";

const mainNavigation = [
  {
    name: "Home",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Transactions",
    href: "/transactions",
    icon: Receipt,
  },
  {
    name: "Budget",
    href: "/budget",
    icon: Wallet,
  },
  {
    name: "Goals",
    href: "/goals",
    icon: Target,
  },
];

const moreNavigation = [
  {
    name: "Investments",
    href: "/investments",
    icon: TrendingUp,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    name: "Subscriptions",
    href: "/subscriptions",
    icon: CreditCard,
  },
  {
    name: "AI Assistant",
    href: "/ai-assistant",
    icon: Bot,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function MobileNav() {
  const router = useRouter();
  const pathname = usePathname();

  const [showMore, setShowMore] = useState(false);

  function isActive(href: string) {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname.startsWith(href);
  }

  const moreActive = moreNavigation.some((item) =>
    isActive(item.href)
  );

  function handleNavigation(href: string) {
    router.push(href);
    setShowMore(false);
  }

  return (
    <>
      {/* More Menu */}
      {showMore && (
        <div className="fixed bottom-[76px] right-3 z-[60] w-[210px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0B1712]/95 p-2 shadow-2xl backdrop-blur-xl lg:hidden">
          <div className="mb-1 px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/20">
              More
            </p>
          </div>

          {moreNavigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <button
                key={item.href}
                type="button"
                onClick={() => handleNavigation(item.href)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
                  active
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "text-white/45 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <Icon
                  size={18}
                  strokeWidth={active ? 2.2 : 1.8}
                />

                <span>{item.name}</span>

                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.07] bg-[#08110D]/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-around">
          {mainNavigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <button
                key={item.href}
                type="button"
                onClick={() => handleNavigation(item.href)}
                className={`relative flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-2 transition ${
                  active
                    ? "text-emerald-400"
                    : "text-white/30 hover:text-white/60"
                }`}
              >
                {active && (
                  <span className="absolute -top-2 h-0.5 w-8 rounded-full bg-emerald-400" />
                )}

                <Icon
                  size={20}
                  strokeWidth={active ? 2.3 : 1.8}
                />

                <span
                  className={`max-w-full truncate text-[10px] font-medium ${
                    active
                      ? "text-emerald-400"
                      : "text-white/35"
                  }`}
                >
                  {item.name}
                </span>
              </button>
            );
          })}

          {/* More */}
          <button
            type="button"
            onClick={() => setShowMore((prev) => !prev)}
            className={`relative flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-2 transition ${
              moreActive || showMore
                ? "text-emerald-400"
                : "text-white/30 hover:text-white/60"
            }`}
          >
            {(moreActive || showMore) && (
              <span className="absolute -top-2 h-0.5 w-8 rounded-full bg-emerald-400" />
            )}

            {showMore ? (
              <ChevronUp
                size={20}
                strokeWidth={2.2}
              />
            ) : (
              <MoreHorizontal
                size={20}
                strokeWidth={1.8}
              />
            )}

            <span
              className={`text-[10px] font-medium ${
                moreActive || showMore
                  ? "text-emerald-400"
                  : "text-white/35"
              }`}
            >
              More
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}