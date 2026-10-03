"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronRight,
  CircleDollarSign,
  Plus,
  TrendingUp,
  Search,
} from "lucide-react";

import AppSidebar from "@/components/ui/app-sidebar";
import MobileNav from "@/components/ui/mobile-nav";

type Investment = {
  id: number;
  name: string;
  category: string;
  invested: number;
  current: number;
};

const initialInvestments: Investment[] = [
  {
    id: 1,
    name: "Nifty 50 Index Fund",
    category: "Equity",
    invested: 25000,
    current: 27450,
  },
  {
    id: 2,
    name: "HDFC Balanced Advantage",
    category: "Hybrid",
    invested: 18000,
    current: 19260,
  },
  {
    id: 3,
    name: "Gold ETF",
    category: "Gold",
    invested: 10000,
    current: 11240,
  },
  {
    id: 4,
    name: "Liquid Fund",
    category: "Debt",
    invested: 7500,
    current: 7815,
  },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export default function InvestmentsPage() {
  const router = useRouter();

  const [investments, setInvestments] =
    useState<Investment[]>(initialInvestments);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("Equity");
  const [newInvested, setNewInvested] = useState("");
  const [newCurrent, setNewCurrent] = useState("");

  const totalInvested = investments.reduce(
    (sum, item) => sum + item.invested,
    0
  );

  const currentValue = investments.reduce(
    (sum, item) => sum + item.current,
    0
  );

  const totalReturns = currentValue - totalInvested;

  const returnPercentage =
    totalInvested > 0
      ? (totalReturns / totalInvested) * 100
      : 0;

  const monthlySip = 5000;

  function addInvestment() {
    if (!newName || !newInvested || !newCurrent) return;

    const investment: Investment = {
      id: Date.now(),
      name: newName,
      category: newCategory,
      invested: Number(newInvested),
      current: Number(newCurrent),
    };

    setInvestments((prev) => [...prev, investment]);

    setNewName("");
    setNewCategory("Equity");
    setNewInvested("");
    setNewCurrent("");
    setShowAddModal(false);
  }

  return (
    <div className="min-h-screen bg-[#07110D] text-white">
      <div className="flex min-h-screen">
        <AppSidebar />

        <main className="min-w-0 flex-1 pb-24 lg:pb-0">
          {/* Header */}
          <header className="flex min-h-[82px] items-center justify-between gap-4 border-b border-white/[0.06] px-5 sm:px-8 lg:px-10">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/25">
                Wealth
              </p>

              <h1 className="mt-1 text-xl font-semibold sm:text-2xl">
                Investments
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {/* NEW: Investment Discovery */}
              <button
                type="button"
                onClick={() =>
                  router.push("/investment-discovery")
                }
                className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.08] px-3 py-2.5 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500/[0.14] sm:px-4 sm:text-sm"
              >
                <Search size={16} />

                <span className="hidden sm:inline">
                  Explore Investments
                </span>

                <span className="sm:hidden">
                  Explore
                </span>
              </button>

              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 rounded-xl bg-emerald-500 px-3 py-2.5 text-xs font-semibold text-[#07110D] transition hover:bg-emerald-400 sm:px-4 sm:text-sm"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">
                  Add Investment
                </span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </header>

          <div className="mx-auto w-full max-w-[1500px] px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
            {/* Discovery Banner */}
            <section className="mb-6 rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.035] p-5 sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Search size={18} />
                  </div>

                  <div>
                    <h2 className="font-semibold">
                      Looking for your next investment?
                    </h2>

                    <p className="mt-1 max-w-xl text-xs leading-5 text-white/30 sm:text-sm">
                      Explore investment categories and create
                      illustrative scenarios based on your amount,
                      duration and risk preference.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    router.push("/investment-discovery")
                  }
                  className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-[#07110D] transition hover:bg-emerald-400"
                >
                  Explore Investments
                  <ChevronRight size={17} />
                </button>
              </div>
            </section>

            {/* Summary Cards */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    <CircleDollarSign size={18} />
                  </div>

                  <span className="text-xs text-white/20">
                    Portfolio
                  </span>
                </div>

                <p className="mt-5 text-xs text-white/25">
                  Current Value
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {formatCurrency(currentValue)}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] text-white/35">
                    <CircleDollarSign size={18} />
                  </div>

                  <span className="text-xs text-white/20">
                    Principal
                  </span>
                </div>

                <p className="mt-5 text-xs text-white/25">
                  Total Invested
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {formatCurrency(totalInvested)}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    <TrendingUp size={18} />
                  </div>

                  <span className="flex items-center gap-1 text-xs text-emerald-400">
                    <ArrowUpRight size={13} />
                    {returnPercentage.toFixed(1)}%
                  </span>
                </div>

                <p className="mt-5 text-xs text-white/25">
                  Total Returns
                </p>

                <p className="mt-1 text-2xl font-bold text-emerald-400">
                  +{formatCurrency(totalReturns)}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    <TrendingUp size={18} />
                  </div>

                  <span className="text-xs text-white/20">
                    Monthly
                  </span>
                </div>

                <p className="mt-5 text-xs text-white/25">
                  Active SIP
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {formatCurrency(monthlySip)}
                </p>
              </div>
            </section>

            {/* Main Grid */}
            <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
              {/* Investment List */}
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025]">
                <div className="flex items-center justify-between border-b border-white/[0.06] p-5 sm:p-6">
                  <div>
                    <h2 className="font-semibold">
                      Your Investments
                    </h2>

                    <p className="mt-1 text-xs text-white/25">
                      {investments.length} investments tracked
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      router.push("/investment-discovery")
                    }
                    className="flex items-center gap-1 text-xs font-medium text-emerald-400 transition hover:text-emerald-300"
                  >
                    Discover
                    <ChevronRight size={14} />
                  </button>
                </div>

                <div className="divide-y divide-white/[0.05]">
                  {investments.map((investment) => {
                    const gain =
                      investment.current - investment.invested;

                    const gainPercentage =
                      investment.invested > 0
                        ? (gain / investment.invested) * 100
                        : 0;

                    return (
                      <div
                        key={investment.id}
                        className="flex flex-col gap-4 p-5 transition hover:bg-white/[0.015] sm:flex-row sm:items-center sm:justify-between sm:p-6"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                            <TrendingUp size={19} />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-white/85">
                              {investment.name}
                            </p>

                            <div className="mt-1 flex items-center gap-2">
                              <span className="text-xs text-white/25">
                                {investment.category}
                              </span>

                              <span className="h-1 w-1 rounded-full bg-white/15" />

                              <span className="text-xs text-white/20">
                                Invested{" "}
                                {formatCurrency(
                                  investment.invested
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-6 sm:justify-end">
                          <div className="text-left sm:text-right">
                            <p className="text-sm font-semibold">
                              {formatCurrency(
                                investment.current
                              )}
                            </p>

                            <div className="mt-1 flex items-center gap-1 text-xs text-emerald-400 sm:justify-end">
                              <ArrowUpRight size={13} />
                              +{gainPercentage.toFixed(1)}%
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              router.push("/fund-details")
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] text-white/25 transition hover:bg-white/[0.04] hover:text-white"
                          >
                            <ChevronRight size={17} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Allocation */}
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
                  <h2 className="font-semibold">
                    Portfolio Allocation
                  </h2>

                  <p className="mt-1 text-xs text-white/25">
                    Based on current portfolio value.
                  </p>

                  <div className="mt-6 space-y-5">
                    {[
                      {
                        name: "Equity",
                        value: 47,
                        amount: 27450,
                      },
                      {
                        name: "Hybrid",
                        value: 26,
                        amount: 19260,
                      },
                      {
                        name: "Gold",
                        value: 15,
                        amount: 11240,
                      },
                      {
                        name: "Debt",
                        value: 12,
                        amount: 7815,
                      },
                    ].map((item) => (
                      <div key={item.name}>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white/45">
                            {item.name}
                          </span>

                          <span className="text-xs text-white/35">
                            {item.value}%
                          </span>
                        </div>

                        <div className="mt-2 h-1.5 rounded-full bg-white/[0.06]">
                          <div
                            className="h-full rounded-full bg-emerald-500"
                            style={{
                              width: `${item.value}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SIP Card */}
                <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.035] p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-emerald-400">
                        Monthly SIP
                      </p>

                      <p className="mt-2 text-3xl font-bold">
                        {formatCurrency(monthlySip)}
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                      <TrendingUp size={20} />
                    </div>
                  </div>

                  <p className="mt-4 text-xs leading-5 text-white/30">
                    Calculate how your monthly investment could grow
                    over different time horizons.
                  </p>

                  <button
                    type="button"
                    onClick={() => router.push("/calculator")}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 py-3 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-500/15"
                  >
                    Open SIP Calculator
                    <ArrowUpRight size={16} />
                  </button>
                </div>

                {/* Discovery Card */}
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] text-white/40">
                    <Search size={18} />
                  </div>

                  <h2 className="mt-4 font-semibold">
                    Discover Investments
                  </h2>

                  <p className="mt-2 text-xs leading-5 text-white/25">
                    Compare investment categories based on your
                    amount, time horizon and risk preference.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      router.push("/investment-discovery")
                    }
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-[#07110D] transition hover:bg-emerald-400"
                  >
                    Explore Investments
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </section>

            {/* Info */}
            <section className="mt-6 rounded-2xl border border-white/[0.05] bg-white/[0.015] p-4">
              <div className="flex gap-3">
                <CircleDollarSign
                  size={17}
                  className="mt-0.5 shrink-0 text-white/20"
                />

                <p className="text-[11px] leading-5 text-white/20">
                  The investment values shown here are demonstration
                  data for the Wealthly prototype. Live NAV,
                  performance, holdings and portfolio values will be
                  connected to verified investment data sources in the
                  backend.
                </p>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Add Investment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/[0.08] bg-[#0B1712] p-6 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  Add Investment
                </h2>

                <p className="mt-1 text-xs text-white/25">
                  Add an investment to your demo portfolio.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-xl text-white/25 transition hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-xs text-white/35">
                  Investment Name
                </label>

                <input
                  value={newName}
                  onChange={(e) =>
                    setNewName(e.target.value)
                  }
                  placeholder="e.g. Index Fund"
                  className="mt-2 h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 text-sm outline-none placeholder:text-white/15 focus:border-emerald-500/30"
                />
              </div>

              <div>
                <label className="text-xs text-white/35">
                  Category
                </label>

                <select
                  value={newCategory}
                  onChange={(e) =>
                    setNewCategory(e.target.value)
                  }
                  className="mt-2 h-11 w-full rounded-xl border border-white/[0.08] bg-[#0B1712] px-3 text-sm text-white outline-none"
                >
                  <option>Equity</option>
                  <option>Debt</option>
                  <option>Hybrid</option>
                  <option>Gold</option>
                  <option>Index</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white/35">
                    Invested
                  </label>

                  <input
                    type="number"
                    value={newInvested}
                    onChange={(e) =>
                      setNewInvested(e.target.value)
                    }
                    placeholder="₹"
                    className="mt-2 h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 text-sm outline-none placeholder:text-white/15 focus:border-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/35">
                    Current Value
                  </label>

                  <input
                    type="number"
                    value={newCurrent}
                    onChange={(e) =>
                      setNewCurrent(e.target.value)
                    }
                    placeholder="₹"
                    className="mt-2 h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 text-sm outline-none placeholder:text-white/15 focus:border-emerald-500/30"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.025] py-3 text-sm text-white/50 transition hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={addInvestment}
                className="flex-1 rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-[#07110D] transition hover:bg-emerald-400"
              >
                Add Investment
              </button>
            </div>
          </div>
        </div>
      )}

      <MobileNav />
    </div>
  );
}