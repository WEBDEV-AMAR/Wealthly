"use client";

import { useRouter } from "next/navigation";
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronRight,
  CircleDollarSign,
  CreditCard,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";

import AppSidebar from "@/components/ui/app-sidebar";
import MobileNav from "@/components/ui/mobile-nav";

const transactions = [
  {
    name: "Salary",
    category: "Income",
    date: "30 Sep 2026",
    amount: 25000,
    type: "income",
  },
  {
    name: "Rent",
    category: "Housing",
    date: "29 Sep 2026",
    amount: 7000,
    type: "expense",
  },
  {
    name: "Grocery Shopping",
    category: "Food",
    date: "28 Sep 2026",
    amount: 1450,
    type: "expense",
  },
  {
    name: "Spotify",
    category: "Subscription",
    date: "27 Sep 2026",
    amount: 140,
    type: "expense",
  },
  {
    name: "Travel",
    category: "Transport",
    date: "25 Sep 2026",
    amount: 850,
    type: "expense",
  },
];

const goals = [
  {
    name: "Emergency Fund",
    current: 18000,
    target: 50000,
  },
  {
    name: "New Laptop",
    current: 32000,
    target: 60000,
  },
  {
    name: "Kerala Trip",
    current: 12000,
    target: 30000,
  },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function DashboardPage() {
  const router = useRouter();

  const totalBalance = 54360;
  const monthlyIncome = 25000;
  const monthlyExpense = 18640;
  const remaining = monthlyIncome - monthlyExpense;

  return (
    <div className="min-h-screen bg-[#07110D] text-white">
      <div className="flex min-h-screen">
        <AppSidebar />

        <main className="min-w-0 flex-1 pb-24 lg:pb-0">
          {/* Header */}
          <header className="flex h-[82px] items-center justify-between border-b border-white/[0.06] px-5 sm:px-8 lg:px-10">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/25">
                Overview
              </p>
              <h1 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
                Good afternoon, Amarnath 👋
              </h1>
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-sm font-semibold text-emerald-400">
                A
              </div>
            </div>
          </header>

          <div className="mx-auto w-full max-w-[1500px] px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
            {/* Balance */}
            <section className="rounded-3xl border border-emerald-500/10 bg-emerald-500/[0.035] p-6 sm:p-8">
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div>
                  <p className="text-sm text-white/35">Total Balance</p>

                  <h2 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
                    {formatCurrency(totalBalance)}
                  </h2>

                  <div className="mt-4 flex items-center gap-2 text-sm">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <ArrowUpRight size={16} />
                      8.4%
                    </span>
                    <span className="text-white/25">
                      compared to last month
                    </span>
                  </div>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                  <CircleDollarSign size={27} />
                </div>
              </div>
            </section>

            {/* Income / Expense */}
            <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white/35">Income</p>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    <ArrowUpRight size={18} />
                  </div>
                </div>

                <p className="mt-4 text-2xl font-bold">
                  {formatCurrency(monthlyIncome)}
                </p>

                <p className="mt-2 text-xs text-white/25">This month</p>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white/35">Expenses</p>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                    <ArrowDownRight size={18} />
                  </div>
                </div>

                <p className="mt-4 text-2xl font-bold">
                  {formatCurrency(monthlyExpense)}
                </p>

                <p className="mt-2 text-xs text-white/25">This month</p>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white/35">Remaining</p>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Wallet size={18} />
                  </div>
                </div>

                <p className="mt-4 text-2xl font-bold">
                  {formatCurrency(remaining)}
                </p>

                <p className="mt-2 text-xs text-white/25">
                  Available this month
                </p>
              </div>
            </section>

            {/* Spending + Emergency Fund */}
            <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold">Spending Overview</h2>
                    <p className="mt-1 text-xs text-white/25">
                      September 2026
                    </p>
                  </div>

                  <button
                    onClick={() => router.push("/budget")}
                    className="text-sm text-emerald-400"
                  >
                    View Budget
                  </button>
                </div>

                <div className="mt-7">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-bold">₹18,640</p>
                      <p className="mt-1 text-xs text-white/25">
                        of ₹25,000 monthly budget
                      </p>
                    </div>

                    <p className="text-sm font-medium text-emerald-400">
                      74.5%
                    </p>
                  </div>

                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: "74.5%" }}
                    />
                  </div>
                </div>

                <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    ["Food", "₹5,200"],
                    ["Bills", "₹4,100"],
                    ["Travel", "₹2,850"],
                    ["Other", "₹6,490"],
                  ].map(([name, amount]) => (
                    <div
                      key={name}
                      className="rounded-xl bg-white/[0.025] p-3"
                    >
                      <p className="text-xs text-white/30">{name}</p>
                      <p className="mt-2 text-sm font-semibold">{amount}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Target size={20} />
                  </div>

                  <div>
                    <h2 className="font-semibold">Emergency Fund</h2>
                    <p className="text-xs text-white/25">
                      Your safety net
                    </p>
                  </div>
                </div>

                <p className="mt-6 text-3xl font-bold">₹18,000</p>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: "36%" }}
                  />
                </div>

                <div className="mt-2 flex justify-between text-xs">
                  <span className="text-white/25">36% complete</span>
                  <span className="text-white/35">₹50,000</span>
                </div>
              </div>
            </section>

            {/* Goals */}
            <section className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.025]">
              <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4 sm:px-6">
                <div>
                  <h2 className="font-semibold">Savings Goals</h2>
                  <p className="mt-1 text-xs text-white/25">
                    Keep moving toward your goals
                  </p>
                </div>

                <button
                  onClick={() => router.push("/goals")}
                  className="flex items-center gap-1 text-sm text-emerald-400"
                >
                  View all
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="grid gap-4 p-5 sm:grid-cols-3 sm:p-6">
                {goals.map((goal) => {
                  const progress = (goal.current / goal.target) * 100;

                  return (
                    <div
                      key={goal.name}
                      className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                    >
                      <p className="text-sm font-medium">{goal.name}</p>

                      <p className="mt-3 text-lg font-bold">
                        {formatCurrency(goal.current)}
                      </p>

                      <div className="mt-3 h-2 rounded-full bg-white/[0.06]">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <p className="mt-2 text-xs text-white/25">
                        {Math.round(progress)}% of{" "}
                        {formatCurrency(goal.target)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Recent Transactions */}
            <section className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.025]">
              <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4 sm:px-6">
                <div>
                  <h2 className="font-semibold">Recent Transactions</h2>
                  <p className="mt-1 text-xs text-white/25">
                    Your latest activity
                  </p>
                </div>

                <button
                  onClick={() => router.push("/transactions")}
                  className="flex items-center gap-1 text-sm text-emerald-400"
                >
                  See all
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="divide-y divide-white/[0.05]">
                {transactions.map((transaction) => (
                  <button
                    key={transaction.name}
                    onClick={() => router.push("/transactions")}
                    className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-white/[0.02] sm:px-6"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04]">
                        <CreditCard
                          size={17}
                          className="text-white/40"
                        />
                      </div>

                      <div>
                        <p className="text-sm font-medium">
                          {transaction.name}
                        </p>
                        <p className="mt-1 text-xs text-white/25">
                          {transaction.category} • {transaction.date}
                        </p>
                      </div>
                    </div>

                    <p
                      className={`text-sm font-semibold ${
                        transaction.type === "income"
                          ? "text-emerald-400"
                          : "text-white/80"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </p>
                  </button>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}