"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  ChevronDown,
  CircleDollarSign,
  PieChart,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

import AppSidebar from "@/components/ui/app-sidebar";
import MobileNav from "@/components/ui/mobile-nav";

const monthlyData = [
  { month: "Apr", income: 25000, expense: 15200, savings: 9800 },
  { month: "May", income: 28000, expense: 16800, savings: 11200 },
  { month: "Jun", income: 25000, expense: 14200, savings: 10800 },
  { month: "Jul", income: 30000, expense: 18100, savings: 11900 },
  { month: "Aug", income: 25000, expense: 16400, savings: 8600 },
  { month: "Sep", income: 29500, expense: 18640, savings: 10860 },
];

const spendingCategories = [
  {
    name: "Food",
    amount: 5200,
    percentage: 28,
  },
  {
    name: "Bills",
    amount: 4100,
    percentage: 22,
  },
  {
    name: "Shopping",
    amount: 2400,
    percentage: 13,
  },
  {
    name: "Travel",
    amount: 2850,
    percentage: 15,
  },
  {
    name: "Entertainment",
    amount: 1450,
    percentage: 8,
  },
  {
    name: "Other",
    amount: 2640,
    percentage: 14,
  },
];

const insights = [
  {
    type: "positive",
    title: "Savings improved",
    description:
      "Your estimated savings this month are higher than your previous month.",
    icon: TrendingUp,
  },
  {
    type: "warning",
    title: "Food is your largest expense",
    description:
      "Food currently represents around 28% of your tracked monthly spending.",
    icon: TrendingDown,
  },
  {
    type: "positive",
    title: "Income is stable",
    description:
      "Your tracked income has remained relatively consistent over the selected period.",
    icon: CircleDollarSign,
  },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export default function AnalyticsPage() {
  const router = useRouter();

  const [selectedMonth, setSelectedMonth] = useState("September 2026");

  const currentMonth = monthlyData[monthlyData.length - 1];
  const previousMonth = monthlyData[monthlyData.length - 2];

  const savingsRate =
    currentMonth.income > 0
      ? (currentMonth.savings / currentMonth.income) * 100
      : 0;

  const expenseChange =
    previousMonth.expense > 0
      ? ((currentMonth.expense - previousMonth.expense) /
          previousMonth.expense) *
        100
      : 0;

  const incomeChange =
    previousMonth.income > 0
      ? ((currentMonth.income - previousMonth.income) /
          previousMonth.income) *
        100
      : 0;

  const maxValue = Math.max(
    ...monthlyData.flatMap((item) => [
      item.income,
      item.expense,
      item.savings,
    ])
  );

  return (
    <div className="min-h-screen bg-[#07110D] text-white">
      <div className="flex min-h-screen">
        <AppSidebar />

        <main className="min-w-0 flex-1 pb-24 lg:pb-0">
          {/* Header */}
          <header className="flex min-h-[82px] items-center justify-between gap-4 border-b border-white/[0.06] px-5 sm:px-8 lg:px-10">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/25">
                Insights
              </p>

              <h1 className="mt-1 text-xl font-semibold sm:text-2xl">
                Analytics
              </h1>
            </div>

            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="h-10 appearance-none rounded-xl border border-white/[0.08] bg-white/[0.025] pl-3 pr-9 text-xs text-white/60 outline-none transition hover:border-white/[0.12] focus:border-emerald-500/30 sm:text-sm"
              >
                <option>September 2026</option>
                <option>August 2026</option>
                <option>July 2026</option>
                <option>June 2026</option>
                <option>May 2026</option>
                <option>April 2026</option>
              </select>

              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/25"
              />
            </div>
          </header>

          <div className="mx-auto w-full max-w-[1500px] px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
            {/* Overview Cards */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {/* Income */}
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    <ArrowUpRight size={18} />
                  </div>

                  <span
                    className={`flex items-center gap-1 text-xs ${
                      incomeChange >= 0
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {incomeChange >= 0 ? (
                      <ArrowUpRight size={13} />
                    ) : (
                      <ArrowDownRight size={13} />
                    )}

                    {Math.abs(incomeChange).toFixed(1)}%
                  </span>
                </div>

                <p className="mt-5 text-xs text-white/25">
                  Monthly Income
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {formatCurrency(currentMonth.income)}
                </p>

                <p className="mt-2 text-[11px] text-white/20">
                  Compared with previous month
                </p>
              </div>

              {/* Expenses */}
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                    <ArrowDownRight size={18} />
                  </div>

                  <span
                    className={`flex items-center gap-1 text-xs ${
                      expenseChange <= 0
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {expenseChange <= 0 ? (
                      <ArrowDownRight size={13} />
                    ) : (
                      <ArrowUpRight size={13} />
                    )}

                    {Math.abs(expenseChange).toFixed(1)}%
                  </span>
                </div>

                <p className="mt-5 text-xs text-white/25">
                  Monthly Expenses
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {formatCurrency(currentMonth.expense)}
                </p>

                <p className="mt-2 text-[11px] text-white/20">
                  Compared with previous month
                </p>
              </div>

              {/* Savings */}
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Wallet size={18} />
                  </div>

                  <span className="text-xs text-emerald-400">
                    {savingsRate.toFixed(1)}%
                  </span>
                </div>

                <p className="mt-5 text-xs text-white/25">
                  Monthly Savings
                </p>

                <p className="mt-1 text-2xl font-bold text-emerald-400">
                  {formatCurrency(currentMonth.savings)}
                </p>

                <p className="mt-2 text-[11px] text-white/20">
                  Estimated savings rate
                </p>
              </div>

              {/* Net Worth */}
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] text-white/40">
                    <TrendingUp size={18} />
                  </div>

                  <span className="text-xs text-emerald-400">
                    Growing
                  </span>
                </div>

                <p className="mt-5 text-xs text-white/25">
                  Tracked Net Worth
                </p>

                <p className="mt-1 text-2xl font-bold">
                  ₹54,360
                </p>

                <p className="mt-2 text-[11px] text-white/20">
                  Across tracked accounts
                </p>
              </div>
            </section>

            {/* Main Charts */}
            <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.8fr)]">
              {/* Income Expense Chart */}
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-semibold">
                      Cash Flow
                    </h2>

                    <p className="mt-1 text-xs text-white/25">
                      Income, expenses and savings over the last
                      6 months.
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-[11px] text-white/30">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      Income
                    </span>

                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-white/30" />
                      Expense
                    </span>

                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-white/15" />
                      Savings
                    </span>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="flex h-[290px] gap-3">
                    {/* Y Axis */}
                    <div className="flex w-10 flex-col justify-between pb-7 text-right text-[10px] text-white/15">
                      <span>₹30k</span>
                      <span>₹20k</span>
                      <span>₹10k</span>
                      <span>₹0</span>
                    </div>

                    {/* Chart */}
                    <div className="relative flex flex-1 flex-col">
                      <div className="absolute inset-0 flex flex-col justify-between pb-7">
                        {[0, 1, 2, 3].map((line) => (
                          <div
                            key={line}
                            className="border-t border-white/[0.05]"
                          />
                        ))}
                      </div>

                      <div className="relative flex h-full items-end justify-between gap-2 pb-7 sm:gap-4">
                        {monthlyData.map((item) => {
                          const incomeHeight =
                            (item.income / maxValue) * 220;

                          const expenseHeight =
                            (item.expense / maxValue) * 220;

                          const savingsHeight =
                            (item.savings / maxValue) * 220;

                          return (
                            <div
                              key={item.month}
                              className="flex h-full flex-1 items-end justify-center gap-1"
                            >
                              <div
                                title={`Income: ${formatCurrency(
                                  item.income
                                )}`}
                                className="w-[28%] max-w-5 rounded-t-md bg-emerald-400/80 transition hover:bg-emerald-400"
                                style={{
                                  height: `${incomeHeight}px`,
                                }}
                              />

                              <div
                                title={`Expense: ${formatCurrency(
                                  item.expense
                                )}`}
                                className="w-[28%] max-w-5 rounded-t-md bg-white/25 transition hover:bg-white/35"
                                style={{
                                  height: `${expenseHeight}px`,
                                }}
                              />

                              <div
                                title={`Savings: ${formatCurrency(
                                  item.savings
                                )}`}
                                className="w-[28%] max-w-5 rounded-t-md bg-white/10 transition hover:bg-white/20"
                                style={{
                                  height: `${savingsHeight}px`,
                                }}
                              />

                              <span className="absolute bottom-0 translate-y-1 text-[10px] text-white/20">
                                {item.month}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Spending Breakdown */}
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
                <div>
                  <h2 className="font-semibold">
                    Spending Breakdown
                  </h2>

                  <p className="mt-1 text-xs text-white/25">
                    Where your money went this month.
                  </p>
                </div>

                {/* Donut */}
                <div className="mt-7 flex justify-center">
                  <div
                    className="relative flex h-44 w-44 items-center justify-center rounded-full"
                    style={{
                      background:
                        "conic-gradient(#34d399 0deg 100.8deg, rgba(255,255,255,0.28) 100.8deg 180deg, rgba(255,255,255,0.18) 180deg 226.8deg, rgba(255,255,255,0.12) 226.8deg 280.8deg, rgba(255,255,255,0.08) 280.8deg 309.6deg, rgba(255,255,255,0.05) 309.6deg 360deg)",
                    }}
                  >
                    <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-[#0A1510]">
                      <p className="text-xs text-white/25">
                        Total
                      </p>

                      <p className="mt-1 text-xl font-bold">
                        ₹18.6k
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-7 space-y-3">
                  {spendingCategories.map((category, index) => (
                    <div
                      key={category.name}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            index === 0
                              ? "bg-emerald-400"
                              : index === 1
                              ? "bg-white/30"
                              : index === 2
                              ? "bg-white/25"
                              : index === 3
                              ? "bg-white/20"
                              : index === 4
                              ? "bg-white/15"
                              : "bg-white/10"
                          }`}
                        />

                        <span className="text-xs text-white/45">
                          {category.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-white/55">
                          {formatCurrency(category.amount)}
                        </span>

                        <span className="w-8 text-right text-[10px] text-white/20">
                          {category.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Bottom Section */}
            <section className="mt-6 grid gap-6 lg:grid-cols-2">
              {/* Savings Rate */}
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-semibold">
                      Savings Rate
                    </h2>

                    <p className="mt-1 text-xs text-white/25">
                      Percentage of income left after expenses.
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Wallet size={18} />
                  </div>
                </div>

                <div className="mt-7 flex items-end justify-between">
                  <div>
                    <p className="text-4xl font-bold text-emerald-400">
                      {savingsRate.toFixed(1)}%
                    </p>

                    <p className="mt-2 text-xs text-white/20">
                      Current month
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-white/30">
                      Saved
                    </p>

                    <p className="mt-1 font-semibold">
                      {formatCurrency(currentMonth.savings)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 h-2 rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-emerald-400 transition-all"
                    style={{
                      width: `${Math.min(
                        savingsRate,
                        100
                      )}%`,
                    }}
                  />
                </div>

                <div className="mt-3 flex justify-between text-[10px] text-white/15">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Investment Performance */}
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-semibold">
                      Investment Performance
                    </h2>

                    <p className="mt-1 text-xs text-white/25">
                      Overview of your tracked investments.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => router.push("/investments")}
                    className="text-xs font-medium text-emerald-400 transition hover:text-emerald-300"
                  >
                    View Portfolio
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <p className="text-[11px] text-white/25">
                      Invested
                    </p>

                    <p className="mt-2 text-lg font-semibold">
                      ₹60.5k
                    </p>
                  </div>

                  <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.035] p-4">
                    <p className="text-[11px] text-white/25">
                      Current Value
                    </p>

                    <p className="mt-2 text-lg font-semibold text-emerald-400">
                      ₹65.7k
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white/25">
                      Total Gain
                    </p>

                    <p className="mt-1 text-xl font-bold text-emerald-400">
                      +₹5,765
                    </p>
                  </div>

                  <div className="flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2.5 py-1.5 text-xs text-emerald-400">
                    <ArrowUpRight size={13} />
                    9.5%
                  </div>
                </div>
              </div>
            </section>

            {/* Insights */}
            <section className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <BarChart3 size={18} />
                </div>

                <div>
                  <h2 className="font-semibold">
                    Wealthly Insights
                  </h2>

                  <p className="text-xs text-white/25">
                    Simple observations from your tracked data.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 lg:grid-cols-3">
                {insights.map((insight) => {
                  const Icon = insight.icon;

                  return (
                    <div
                      key={insight.title}
                      className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                    >
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                          insight.type === "positive"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-amber-500/10 text-amber-400"
                        }`}
                      >
                        <Icon size={17} />
                      </div>

                      <h3 className="mt-4 text-sm font-medium">
                        {insight.title}
                      </h3>

                      <p className="mt-2 text-xs leading-5 text-white/25">
                        {insight.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Disclaimer */}
            <section className="mt-6 rounded-2xl border border-white/[0.05] bg-white/[0.015] p-4">
              <div className="flex gap-3">
                <PieChart
                  size={17}
                  className="mt-0.5 shrink-0 text-white/20"
                />

                <p className="text-[11px] leading-5 text-white/20">
                  Analytics shown here are based on demonstration
                  data for the Wealthly prototype. Once the backend
                  is connected, these calculations will be generated
                  from your actual transactions, accounts and
                  investment records.
                </p>
              </div>
            </section>
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}