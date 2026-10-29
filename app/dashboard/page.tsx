
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronRight,
  CircleDollarSign,
  CreditCard,
  Target,
  Wallet,
} from "lucide-react";

import AppSidebar from "@/components/ui/app-sidebar";
import MobileNav from "@/components/ui/mobile-nav";
import { supabase } from "@/lib/supabase";

type Transaction = {
  id: string;
  name: string;
  category: string;
  date: string;
  amount: number;
  type: "income" | "expense";
};

type Goal = {
  id: string;
  name: string;
  current: number;
  target: number;
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const getLocalDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    const details = error as Record<string, unknown>;

    const parts = [
      details.message,
      details.details,
      details.hint,
      details.code ? `Code: ${details.code}` : null,
    ]
      .filter(Boolean)
      .map(String);

    return parts.length > 0 ? parts.join(" | ") : JSON.stringify(error);
  }

  return String(error);
}

export default function DashboardPage() {
  const router = useRouter();

  const [userName, setUserName] = useState("User");
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpense, setMonthlyExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  const [categoryTotals, setCategoryTotals] = useState<
    { name: string; amount: number }[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadDashboardData() {
      setLoading(true);
      setLoadError("");

      try {
        // 1. Get the currently authenticated user.
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw new Error(`Authentication: ${userError.message}`);
        }

        if (!user) {
          router.push("/auth");
          return;
        }

        if (cancelled) return;

        setUserName(
          user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split("@")[0] ||
            "User"
        );

        const now = new Date();

        const monthStart = getLocalDateString(
          new Date(now.getFullYear(), now.getMonth(), 1)
        );

        const today = getLocalDateString(now);

        // 2. Fetch recurring income sources.
        const { data: incomeRows, error: incomeError } =
          await supabase
            .from("financial_income")
            .select("amount, frequency")
            .eq("user_id", user.id);

        if (incomeError) {
          throw new Error(`Income query: ${incomeError.message}`);
        }

        const incomeTotal = (incomeRows ?? []).reduce(
          (total, row) => {
            const amount = Number(row.amount);

            if (row.frequency === "monthly") {
              return total + amount;
            }

            if (row.frequency === "yearly") {
              return total + amount / 12;
            }

            // One-time income is not recurring monthly income.
            return total;
          },
          0
        );

        // 3. Fetch the user's transactions.
        const { data: transactionRows, error: transactionError } =
          await supabase
            .from("transactions")
            .select(
              "id, type, amount, category, description, transaction_date"
            )
            .eq("user_id", user.id)
            .order("transaction_date", { ascending: false });

        if (transactionError) {
          throw new Error(
            `Transactions query: ${transactionError.message}`
          );
        }

        const allTransactions: Transaction[] = (
          transactionRows ?? []
        ).map((row) => ({
          id: row.id,
          name: row.description?.trim() || row.category,
          category: row.category,
          date: row.transaction_date,
          amount: Number(row.amount),
          type: row.type as "income" | "expense",
        }));

        // Only include transactions recorded during the current month.
        const thisMonthTransactions = allTransactions.filter(
          (transaction) =>
            transaction.date >= monthStart &&
            transaction.date <= today
        );

        const expenseTotal = thisMonthTransactions
          .filter((transaction) => transaction.type === "expense")
          .reduce((total, transaction) => total + transaction.amount, 0);

        // This is an estimate, not a bank-account balance.
        const balance = incomeTotal - expenseTotal;

        // 4. Calculate spending by category.
        const categoryMap = new Map<string, number>();

        thisMonthTransactions
          .filter((transaction) => transaction.type === "expense")
          .forEach((transaction) => {
            const category = transaction.category || "Other";

            categoryMap.set(
              category,
              (categoryMap.get(category) ?? 0) + transaction.amount
            );
          });

        const categories = Array.from(categoryMap.entries())
          .map(([name, amount]) => ({ name, amount }))
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 4);

        // 5. Fetch savings goals.
        const { data: goalRows, error: goalError } = await supabase
          .from("goals")
          .select("id, name, current_amount, target_amount")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (goalError) {
          throw new Error(`Goals query: ${goalError.message}`);
        }

        const userGoals: Goal[] = (goalRows ?? []).map((goal) => ({
          id: goal.id,
          name: goal.name,
          current: Number(goal.current_amount),
          target: Number(goal.target_amount),
        }));

        if (cancelled) return;

        // 6. Update dashboard state.
        setMonthlyIncome(incomeTotal);
        setMonthlyExpense(expenseTotal);
        setTotalBalance(balance);
        setTransactions(allTransactions);
        setGoals(userGoals);
        setCategoryTotals(categories);
      } catch (error: unknown) {
        console.error("Dashboard loading error:", error);

        if (!cancelled) {
          setLoadError(`Dashboard error: ${getErrorMessage(error)}`);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDashboardData();

    return () => {
      cancelled = true;
    };
  }, [router]);

  const userInitial = userName.charAt(0).toUpperCase() || "U";

  const remaining = monthlyIncome - monthlyExpense;

  const spendingPercentage =
    monthlyIncome > 0
      ? Math.min((monthlyExpense / monthlyIncome) * 100, 100)
      : 0;

  const emergencyFund = goals.find((goal) =>
    goal.name.toLowerCase().includes("emergency")
  );

  const currentMonth = new Date().toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const recentTransactions = transactions.slice(0, 5);

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
                Good afternoon, {userName} 👋
              </h1>
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-sm font-semibold text-emerald-400">
                {userInitial}
              </div>
            </div>
          </header>

          <div className="mx-auto w-full max-w-[1500px] px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
            {/* Error message */}
            {loadError && (
              <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/[0.05] p-4 text-sm text-red-400">
                <p className="font-semibold">
                  Unable to load your dashboard data.
                </p>

                <p className="mt-2 break-words">{loadError}</p>

                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 font-medium underline"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Balance */}
            <section className="rounded-3xl border border-emerald-500/10 bg-emerald-500/[0.035] p-6 sm:p-8">
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div>
                  <p className="text-sm text-white/35">
                    Estimated Monthly Balance
                  </p>

                  <h2 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
                    {loading ? "Loading..." : formatCurrency(totalBalance)}
                  </h2>

                  <p className="mt-4 text-sm text-white/35">
                    Monthly income minus recorded expenses
                  </p>
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
                  <p className="text-sm text-white/35">Monthly Income</p>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    <ArrowUpRight size={18} />
                  </div>
                </div>

                <p className="mt-4 text-2xl font-bold">
                  {loading ? "Loading..." : formatCurrency(monthlyIncome)}
                </p>

                <p className="mt-2 text-xs text-white/25">
                  Based on your recurring income sources
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white/35">Monthly Expenses</p>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                    <ArrowDownRight size={18} />
                  </div>
                </div>

                <p className="mt-4 text-2xl font-bold">
                  {loading ? "Loading..." : formatCurrency(monthlyExpense)}
                </p>

                <p className="mt-2 text-xs text-white/25">
                  Recorded this month
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white/35">Remaining</p>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Wallet size={18} />
                  </div>
                </div>

                <p className="mt-4 text-2xl font-bold">
                  {loading ? "Loading..." : formatCurrency(remaining)}
                </p>

                <p className="mt-2 text-xs text-white/25">
                  Estimated for this month
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
                      {currentMonth}
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
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-3xl font-bold">
                        {loading ? "Loading..." : formatCurrency(monthlyExpense)}
                      </p>

                      <p className="mt-1 text-xs text-white/25">
                        of {formatCurrency(monthlyIncome)} monthly income
                      </p>
                    </div>

                    <p className="text-sm font-medium text-emerald-400">
                      {monthlyIncome > 0
                        ? `${(
                            (monthlyExpense / monthlyIncome) *
                            100
                          ).toFixed(1)}%`
                        : "—"}
                    </p>
                  </div>

                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all"
                      style={{ width: `${spendingPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {categoryTotals.length > 0 ? (
                    categoryTotals.map(({ name, amount }) => (
                      <div
                        key={name}
                        className="rounded-xl bg-white/[0.025] p-3"
                      >
                        <p className="truncate text-xs text-white/30">
                          {name}
                        </p>

                        <p className="mt-2 text-sm font-semibold">
                          {formatCurrency(amount)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="col-span-full py-4 text-sm text-white/30">
                      {loading
                        ? "Loading spending categories..."
                        : "No expenses recorded this month yet."}
                    </p>
                  )}
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

                {emergencyFund ? (
                  <>
                    <p className="mt-6 text-3xl font-bold">
                      {formatCurrency(emergencyFund.current)}
                    </p>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{
                          width: `${
                            emergencyFund.target > 0
                              ? Math.min(
                                  (emergencyFund.current /
                                    emergencyFund.target) *
                                    100,
                                  100
                                )
                              : 0
                          }%`,
                        }}
                      />
                    </div>

                    <div className="mt-2 flex justify-between gap-3 text-xs">
                      <span className="text-white/25">
                        {emergencyFund.target > 0
                          ? Math.round(
                              (emergencyFund.current /
                                emergencyFund.target) *
                                100
                            )
                          : 0}
                        % complete
                      </span>

                      <span className="text-white/35">
                        {formatCurrency(emergencyFund.target)}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="mt-6">
                    <p className="text-sm text-white/35">
                      {loading
                        ? "Loading your goals..."
                        : "No emergency fund goal yet."}
                    </p>

                    <button
                      onClick={() => router.push("/goals")}
                      className="mt-3 text-sm text-emerald-400"
                    >
                      Create a goal
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* Savings Goals */}
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
                {goals.length > 0 ? (
                  goals.slice(0, 3).map((goal) => {
                    const progress =
                      goal.target > 0
                        ? Math.min(
                            (goal.current / goal.target) * 100,
                            100
                          )
                        : 0;

                    return (
                      <div
                        key={goal.id}
                        className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                      >
                        <p className="text-sm font-medium">{goal.name}</p>

                        <p className="mt-3 text-lg font-bold">
                          {formatCurrency(goal.current)}
                        </p>

                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.06]">
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
                  })
                ) : (
                  <p className="col-span-full py-4 text-sm text-white/30">
                    {loading
                      ? "Loading savings goals..."
                      : "No savings goals added yet."}
                  </p>
                )}
              </div>
            </section>

            {/* Recent Transactions */}
            <section className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.025]">
              <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4 sm:px-6">
                <div>
                  <h2 className="font-semibold">Recent Transactions</h2>

                  <p className="mt-1 text-xs text-white/25">
                    Your latest recorded activity
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
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((transaction) => (
                    <button
                      key={transaction.id}
                      onClick={() => router.push("/transactions")}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-white/[0.02] sm:px-6"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04]">
                          <CreditCard
                            size={17}
                            className="text-white/40"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {transaction.name}
                          </p>

                          <p className="mt-1 text-xs text-white/25">
                            {transaction.category} •{" "}
                            {formatDate(transaction.date)}
                          </p>
                        </div>
                      </div>

                      <p
                        className={`shrink-0 text-sm font-semibold ${
                          transaction.type === "income"
                            ? "text-emerald-400"
                            : "text-white/80"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </p>
                    </button>
                  ))
                ) : (
                  <p className="px-5 py-8 text-center text-sm text-white/30">
                    {loading
                      ? "Loading transactions..."
                      : "No transactions recorded yet."}
                  </p>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
