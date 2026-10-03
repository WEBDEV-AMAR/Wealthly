"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Clock3,
  Coins,
  FileText,
  IndianRupee,
  PieChart,
  ShieldCheck,
  Star,
  TrendingUp,
} from "lucide-react";

import AppSidebar from "@/components/ui/app-sidebar";
import MobileNav from "@/components/ui/mobile-nav";

const fund = {
  name: "Nifty 50 Index Fund",
  shortName: "NIFTY 50",
  category: "Index Fund",
  type: "Equity",
  risk: "High",
  riskLevel: 4,
  nav: 214.68,
  navDate: "Demo data",
  expenseRatio: 0.2,
  aum: "₹18,420 Cr",
  minSip: 500,
  minLumpsum: 500,
  exitLoad: "As per scheme",
  benchmark: "NIFTY 50 TRI",
  fundHouse: "Demo Asset Management",
};

const performance = [
  { period: "1M", return: 2.8 },
  { period: "6M", return: 8.6 },
  { period: "1Y", return: 14.2 },
  { period: "3Y", return: 12.8 },
  { period: "5Y", return: 13.6 },
];

const holdings = [
  { name: "Financial Services", percentage: 31.4 },
  { name: "Information Technology", percentage: 14.8 },
  { name: "Oil & Gas", percentage: 10.7 },
  { name: "Automobile", percentage: 8.9 },
  { name: "FMCG", percentage: 7.6 },
];

const topHoldings = [
  { name: "Company A", percentage: 7.9 },
  { name: "Company B", percentage: 7.1 },
  { name: "Company C", percentage: 6.4 },
  { name: "Company D", percentage: 5.8 },
  { name: "Company E", percentage: 4.9 },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

function calculateSip(monthlyAmount: number, years: number, annualRate: number) {
  const months = years * 12;
  const monthlyRate = annualRate / 100 / 12;

  if (monthlyRate === 0) {
    return monthlyAmount * months;
  }

  return (
    monthlyAmount *
    (((1 + monthlyRate) ** months - 1) / monthlyRate)
  );
}

export default function FundDetailsPage() {
  const router = useRouter();

  const [sipAmount, setSipAmount] = useState("5000");
  const [sipYears, setSipYears] = useState(5);
  const [activePeriod, setActivePeriod] = useState("1Y");

  const monthlyInvestment = Number(sipAmount) || 0;

  const projectedValue = useMemo(
    () => calculateSip(monthlyInvestment, sipYears, 12),
    [monthlyInvestment, sipYears]
  );

  const totalInvested = monthlyInvestment * sipYears * 12;
  const projectedGain = projectedValue - totalInvested;

  return (
    <div className="min-h-screen bg-[#07110D] text-white">
      <div className="flex min-h-screen">
        <AppSidebar />

        <main className="min-w-0 flex-1 pb-24 lg:pb-0">
          {/* Header */}
          <header className="flex h-[82px] items-center justify-between border-b border-white/[0.06] px-5 sm:px-8 lg:px-10">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => router.push("/investment-discovery")}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] text-white/40 transition hover:bg-white/[0.04] hover:text-white"
              >
                <ArrowLeft size={18} />
              </button>

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/25">
                  Investment
                </p>

                <h1 className="mt-1 text-xl font-semibold sm:text-2xl">
                  Fund Details
                </h1>
              </div>
            </div>

            <button
              type="button"
              className="hidden items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-2.5 text-sm text-white/50 transition hover:bg-white/[0.05] hover:text-white sm:flex"
            >
              <Star size={16} />
              Watchlist
            </button>
          </header>

          <div className="mx-auto w-full max-w-[1500px] px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
            {/* Fund Hero */}
            <section className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-7">
              <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                    <TrendingUp size={25} />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-bold sm:text-2xl">
                        {fund.name}
                      </h2>

                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                        {fund.category}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-white/30">
                      {fund.fundHouse} · {fund.benchmark}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="rounded-lg border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 text-xs text-white/40">
                        {fund.type}
                      </span>

                      <span className="rounded-lg border border-red-400/10 bg-red-400/[0.05] px-3 py-1.5 text-xs text-red-300/70">
                        {fund.risk} Risk
                      </span>

                      <span className="rounded-lg border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 text-xs text-white/40">
                        {fund.shortName}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="xl:min-w-[240px] xl:text-right">
                  <p className="text-xs text-white/25">
                    NAV
                  </p>

                  <p className="mt-1 text-3xl font-bold">
                    ₹{fund.nav.toFixed(2)}
                  </p>

                  <p className="mt-1 text-xs text-white/20">
                    {fund.navDate}
                  </p>
                </div>
              </div>
            </section>

            {/* Key Stats */}
            <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <div className="flex items-center gap-2 text-white/25">
                  <Coins size={16} />
                  <span className="text-xs">Expense Ratio</span>
                </div>

                <p className="mt-3 text-xl font-semibold">
                  {fund.expenseRatio}%
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <div className="flex items-center gap-2 text-white/25">
                  <IndianRupee size={16} />
                  <span className="text-xs">AUM</span>
                </div>

                <p className="mt-3 text-xl font-semibold">
                  {fund.aum}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <div className="flex items-center gap-2 text-white/25">
                  <CalendarDays size={16} />
                  <span className="text-xs">Minimum SIP</span>
                </div>

                <p className="mt-3 text-xl font-semibold">
                  ₹{fund.minSip}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <div className="flex items-center gap-2 text-white/25">
                  <ShieldCheck size={16} />
                  <span className="text-xs">Risk Level</span>
                </div>

                <div className="mt-3 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span
                      key={index}
                      className={`h-2 w-6 rounded-full ${
                        index < fund.riskLevel
                          ? "bg-red-400/70"
                          : "bg-white/[0.08]"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Main Content */}
            <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
              {/* Left */}
              <div className="space-y-6">
                {/* Performance */}
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-7">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="font-semibold">
                        Historical Performance
                      </h2>

                      <p className="mt-1 text-xs text-white/25">
                        Sample performance data for interface demonstration.
                      </p>
                    </div>

                    <div className="flex rounded-xl border border-white/[0.06] bg-white/[0.02] p-1">
                      {performance.map((item) => (
                        <button
                          key={item.period}
                          type="button"
                          onClick={() =>
                            setActivePeriod(item.period)
                          }
                          className={`rounded-lg px-3 py-1.5 text-xs transition ${
                            activePeriod === item.period
                              ? "bg-emerald-500 text-[#07110D]"
                              : "text-white/30 hover:text-white"
                          }`}
                        >
                          {item.period}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-3xl font-bold">
                        +
                        {
                          performance.find(
                            (item) =>
                              item.period === activePeriod
                          )?.return
                        }
                        %
                      </p>

                      <div className="mt-2 flex items-center gap-2 text-xs text-emerald-400">
                        <ArrowUpRight size={14} />
                        <span>
                          Illustrative historical figure
                        </span>
                      </div>
                    </div>

                    <BarChart3
                      size={42}
                      strokeWidth={1.3}
                      className="text-emerald-400/40"
                    />
                  </div>

                  <div className="mt-8 flex h-40 items-end gap-2 border-b border-white/[0.06] px-2">
                    {[32, 42, 38, 51, 47, 62, 57, 70, 65, 78, 73, 88].map(
                      (height, index) => (
                        <div
                          key={index}
                          className="group flex flex-1 items-end"
                        >
                          <div
                            className="w-full rounded-t-md bg-emerald-500/20 transition group-hover:bg-emerald-500/40"
                            style={{ height: `${height}%` }}
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Portfolio */}
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
                    <div className="flex items-center gap-2">
                      <PieChart
                        size={18}
                        className="text-emerald-400"
                      />

                      <h2 className="font-semibold">
                        Sector Allocation
                      </h2>
                    </div>

                    <div className="mt-6 space-y-4">
                      {holdings.map((holding) => (
                        <div key={holding.name}>
                          <div className="flex justify-between text-xs">
                            <span className="text-white/45">
                              {holding.name}
                            </span>

                            <span className="text-white/65">
                              {holding.percentage}%
                            </span>
                          </div>

                          <div className="mt-2 h-1.5 rounded-full bg-white/[0.06]">
                            <div
                              className="h-full rounded-full bg-emerald-500"
                              style={{
                                width: `${holding.percentage * 2.2}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
                    <div className="flex items-center gap-2">
                      <TrendingUp
                        size={18}
                        className="text-emerald-400"
                      />

                      <h2 className="font-semibold">
                        Top Holdings
                      </h2>
                    </div>

                    <div className="mt-6 space-y-4">
                      {topHoldings.map((holding, index) => (
                        <div
                          key={holding.name}
                          className="flex items-center gap-3"
                        >
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.04] text-[11px] text-white/25">
                            {index + 1}
                          </span>

                          <span className="flex-1 text-sm text-white/50">
                            {holding.name}
                          </span>

                          <span className="text-sm font-medium text-white/65">
                            {holding.percentage}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Fund Information */}
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-7">
                  <div className="flex items-center gap-2">
                    <FileText
                      size={18}
                      className="text-emerald-400"
                    />

                    <h2 className="font-semibold">
                      Fund Information
                    </h2>
                  </div>

                  <div className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-white/25">
                        Fund Type
                      </p>

                      <p className="mt-1 text-sm text-white/65">
                        {fund.category}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-white/25">
                        Benchmark
                      </p>

                      <p className="mt-1 text-sm text-white/65">
                        {fund.benchmark}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-white/25">
                        Minimum Lumpsum
                      </p>

                      <p className="mt-1 text-sm text-white/65">
                        ₹{fund.minLumpsum}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-white/25">
                        Exit Load
                      </p>

                      <p className="mt-1 text-sm text-white/65">
                        {fund.exitLoad}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right */}
              <aside className="space-y-6">
                {/* SIP Calculator */}
                <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.035] p-5 sm:p-6">
                  <div className="flex items-center gap-2">
                    <TrendingUp
                      size={18}
                      className="text-emerald-400"
                    />

                    <h2 className="font-semibold">
                      SIP Projection
                    </h2>
                  </div>

                  <p className="mt-2 text-xs leading-5 text-white/25">
                    Illustrative calculation using a 12% assumed annual
                    return.
                  </p>

                  <div className="mt-6">
                    <label className="text-xs text-white/35">
                      Monthly SIP
                    </label>

                    <div className="mt-2 flex items-center rounded-xl border border-white/[0.08] bg-black/10 px-3">
                      <span className="text-white/30">₹</span>

                      <input
                        type="number"
                        min="0"
                        value={sipAmount}
                        onChange={(e) =>
                          setSipAmount(e.target.value)
                        }
                        className="h-12 w-full bg-transparent px-2 text-sm font-semibold outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-5">
                    <label className="text-xs text-white/35">
                      Duration
                    </label>

                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {[3, 5, 10].map((year) => (
                        <button
                          key={year}
                          type="button"
                          onClick={() => setSipYears(year)}
                          className={`rounded-xl border py-2.5 text-xs transition ${
                            sipYears === year
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                              : "border-white/[0.07] text-white/30 hover:text-white"
                          }`}
                        >
                          {year} Years
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 border-t border-white/[0.06] pt-5">
                    <p className="text-xs text-white/25">
                      Projected value
                    </p>

                    <p className="mt-1 text-2xl font-bold">
                      {formatCurrency(projectedValue)}
                    </p>

                    <div className="mt-4 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-white/25">
                          Total invested
                        </span>

                        <span className="text-white/55">
                          {formatCurrency(totalInvested)}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-white/25">
                          Illustrative gain
                        </span>

                        <span className="text-emerald-400">
                          +{formatCurrency(projectedGain)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => router.push("/calculator")}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-[#07110D] transition hover:bg-emerald-400"
                  >
                    Open Full Calculator
                    <ArrowUpRight size={16} />
                  </button>
                </div>

                {/* Important Info */}
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
                  <div className="flex items-center gap-2">
                    <Clock3
                      size={17}
                      className="text-white/30"
                    />

                    <h2 className="font-semibold">
                      Things to Know
                    </h2>
                  </div>

                  <div className="mt-5 space-y-4">
                    <div className="flex gap-3">
                      <CheckCircle2
                        size={17}
                        className="mt-0.5 shrink-0 text-emerald-400/70"
                      />

                      <p className="text-xs leading-5 text-white/30">
                        Index funds generally aim to track their chosen
                        benchmark index.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <CheckCircle2
                        size={17}
                        className="mt-0.5 shrink-0 text-emerald-400/70"
                      />

                      <p className="text-xs leading-5 text-white/30">
                        Market-linked investments can fluctuate in value.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <CheckCircle2
                        size={17}
                        className="mt-0.5 shrink-0 text-emerald-400/70"
                      />

                      <p className="text-xs leading-5 text-white/30">
                        Past performance does not guarantee future
                        returns.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Data Notice */}
                <div className="flex gap-3 rounded-2xl border border-white/[0.05] bg-white/[0.015] p-4">
                  <CircleHelp
                    size={17}
                    className="mt-0.5 shrink-0 text-white/20"
                  />

                  <p className="text-[11px] leading-5 text-white/20">
                    The fund information currently shown is demonstration
                    data for the Wealthly interface. Live NAV, AUM,
                    expense ratio, holdings and performance data will be
                    connected to verified data sources in the investment
                    data layer.
                  </p>
                </div>
              </aside>
            </section>
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}