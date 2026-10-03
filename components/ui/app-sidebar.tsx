"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Bot,
  CreditCard,
  LayoutDashboard,
  Receipt,
  Settings,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
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
];

const bottomNavigation = [
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname.startsWith(href);
  }

  return (
    <aside className="hidden w-[250px] shrink-0 border-r border-white/[0.06] bg-[#08110D] lg:flex lg:min-h-screen lg:flex-col">
      {/* Logo */}
      <div className="flex h-[82px] items-center border-b border-white/[0.06] px-6">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 font-bold text-lg text-[#07110D]">
            W
          </div>

          <div className="text-left">
            <p className="text-lg font-bold tracking-tight text-white">
              Wealthly
            </p>

            <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">
              Finance OS
            </p>
          </div>
        </button>
      </div>

      {/* Main Navigation */}
      <div className="flex flex-1 flex-col px-4 py-6">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/20">
          Workspace
        </p>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <button
                key={item.href}
                type="button"
                onClick={() => router.push(item.href)}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "text-white/40 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <Icon
                  size={19}
                  strokeWidth={active ? 2.2 : 1.8}
                  className={`transition ${
                    active
                      ? "text-emerald-400"
                      : "text-white/30 group-hover:text-white/70"
                  }`}
                />

                <span>{item.name}</span>

                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Navigation */}
        <div className="mt-auto">
          <div className="mb-4 h-px bg-white/[0.06]" />

          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/20">
            Account
          </p>

          <nav className="space-y-1">
            {bottomNavigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => router.push(item.href)}
                  className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "text-white/40 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <Icon
                    size={19}
                    strokeWidth={active ? 2.2 : 1.8}
                    className={`transition ${
                      active
                        ? "text-emerald-400"
                        : "text-white/30 group-hover:text-white/70"
                    }`}
                  />

                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Profile */}
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-sm font-semibold text-emerald-400">
              A
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white/80">
                Amarnath
              </p>

              <p className="truncate text-xs text-white/25">
                Personal Account
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}