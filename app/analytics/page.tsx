
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  CircleDollarSign,
  LoaderCircle,
  PieChart,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Wallet,
  Target,
  AlertCircle,
} from "lucide-react";

import AppSidebar from "@/components/ui/app-sidebar";
import MobileNav from "@/components/ui/mobile-nav";
import { supabase } from "@/lib/supabase";

type Transaction = {
  id: string;
  type: "income" | "expense";
  amount: number | string;
  category: string;
  transaction_date: string;
  description: string | null;
};

type IncomeRecord = {
  id: string;
  income_type: string;
  source_name: string;
  amount: number | string;
  frequency: "monthly" | "yearly" | "one_time";
  created_at: string;
};

type Goal = {
  id: string;
  name: string;
  target_amount: number | string;
  current_amount: number | string;
};

type Investment = {
  id: string;
  name: string;
  investment_type: string;
  invested_amount: number | string;
  current_value: number | string | null;
};

type MonthData = {
  key: string;
  month: string;
  income: number;
  expense: number;
  savings: number;
};

const currency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));

const numeric = (value: number | string | null | undefined) => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const monthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const monthLabel = (date: Date) =>
  date.toLocaleDateString("en-IN", { month: "short" });

const COLORS = [
  "#34d399",
  "#60a5fa",
  "#fbbf24",
  "#c084fc",
  "#fb7185",
  "#a3a3a3",
  "#2dd4bf",
  "#f97316",
];

export default function AnalyticsPage() {
  const router = useRouter();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [incomeRecords, setIncomeRecords] = useState<IncomeRecord[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(monthKey(new Date()));
  const [period, setPeriod] = useState("6");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadAnalytics = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    setError("");

    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError) throw authError;

      const user = authData.user;
      if (!user) {
        router.replace("/auth");
        return;
      }

      const [transactionResult, incomeResult, goalResult, investmentResult] =
        await Promise.all([
          supabase
            .from("transactions")
            .select(
              "id,type,amount,category,transaction_date,description"
            )
            .eq("user_id", user.id)
            .order("transaction_date", { ascending: true }),

          supabase
            .from("financial_income")
            .select("id,income_type,source_name,amount,frequency,created_at")
            .eq("user_id", user.id),

          supabase
            .from("goals")
            .select("id,name,target_amount,current_amount")
            .eq("user_id", user.id),

          supabase
            .from("investments")
            .select("id,name,investment_type,invested_amount,current_value")
            .eq("user_id", user.id),
        ]);

      const firstError =
        transactionResult.error ||
        incomeResult.error ||
        goalResult.error ||
        investmentResult.error;

      if (firstError) throw firstError;

      setTransactions((transactionResult.data ?? []) as Transaction[]);
      setIncomeRecords((incomeResult.data ?? []) as IncomeRecord[]);
      setGoals((goalResult.data ?? []) as Goal[]);
      setInvestments((investmentResult.data ?? []) as Investment[]);
    } catch (err) {
      console.error("Analytics load failed:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Analytics data load nahi ho saka. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    void loadAnalytics();
  }, [loadAnalytics]);

  const months = useMemo(() => {
    const count = Math.max(1, Number(period) || 6);
    const now = new Date();

    return Array.from({ length: count }, (_, index) => {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - count + index + 1,
        1
      );

      return {
        date,
        key: monthKey(date),
        label: date.toLocaleDateString("en-IN", {
          month: "long",
          year: "numeric",
        }),
      };
    });
  }, [period]);

  const monthlyData = useMemo<MonthData[]>(() => {
    return months.map(({ date, key }) => {
      const incomeFromSources = incomeRecords.reduce((total, item) => {
        const amount = numeric(item.amount);

        if (item.frequency === "monthly") return total + amount;
        if (item.frequency === "yearly") return total + amount / 12;

        // Count one-time income only in its recorded month.
        if (
          item.frequency === "one_time" &&
          item.created_at &&
          monthKey(new Date(item.created_at)) === key
        ) {
          return total + amount;
        }

        return total;
      }, 0);

      const incomeTransactions = transactions
        .filter(
          (item) =>
            item.type === "income" &&
            item.transaction_date?.slice(0, 7) === key
        )
        .reduce((sum, item) => sum + numeric(item.amount), 0);

      const expenses = transactions
        .filter(
          (item) =>
            item.type === "expense" &&
            item.transaction_date?.slice(0, 7) === key
        )
        .reduce((sum, item) => sum + numeric(item.amount), 0);

      const income = incomeFromSources + incomeTransactions;

      return {
        key,
        month: monthLabel(date),
        income,
        expense: expenses,
        savings: income - expenses,
      };
    });
  }, [months, incomeRecords, transactions]);

  const selectedData = useMemo(
    () =>
      monthlyData.find((item) => item.key === selectedMonth) ?? {
        key: selectedMonth,
        month: "Selected month",
        income: 0,
        expense: 0,
        savings: 0,
      },
    [monthlyData, selectedMonth]
  );

  const selectedTransactions = useMemo(
    () =>
      transactions.filter(
        (item) => item.transaction_date?.slice(0, 7) === selectedMonth
      ),
    [transactions, selectedMonth]
  );

  const previousData = useMemo(() => {
    const index = monthlyData.findIndex(
      (item) => item.key === selectedMonth
    );
    return index > 0 ? monthlyData[index - 1] : null;
  }, [monthlyData, selectedMonth]);

  const percentChange = (current: number, previous: number) =>
    previous > 0 ? ((current - previous) / previous) * 100 : null;

  const incomeChange = previousData
    ? percentChange(selectedData.income, previousData.income)
    : null;

  const expenseChange = previousData
    ? percentChange(selectedData.expense, previousData.expense)
    : null;

  const savingsRate =
    selectedData.income > 0
      ? (selectedData.savings / selectedData.income) * 100
      : 0;

  const spendingCategories = useMemo(() => {
    const totals = new Map<string, number>();

    selectedTransactions
      .filter((item) => item.type === "expense")
      .forEach((item) => {
        const category = item.category?.trim() || "Other";
        totals.set(category, (totals.get(category) ?? 0) + numeric(item.amount));
      });

    const total = [...totals.values()].reduce((sum, amount) => sum + amount, 0);

    return [...totals.entries()]
      .map(([name, amount]) => ({
        name,
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [selectedTransactions]);

  const totalSpending = spendingCategories.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const donutStyle = useMemo(() => {
    if (!spendingCategories.length || totalSpending <= 0) {
      return {
        background: "conic-gradient(rgba(255,255,255,0.08) 0deg 360deg)",
      };
    }

    let current = 0;
    const segments = spendingCategories.map((item, index) => {
      const start = current;
      current += (item.amount / totalSpending) * 360;
      return `${COLORS[index % COLORS.length]} ${start}deg ${current}deg`;
    });

    return { background: `conic-gradient(${segments.join(", ")})` };
  }, [spendingCategories, totalSpending]);

  const totalInvested = investments.reduce(
    (sum, item) => sum + numeric(item.invested_amount),
    0
  );

  const investmentsWithValue = investments.filter(
    (item) => item.current_value !== null && item.current_value !== undefined
  );

  const totalCurrentValue = investmentsWithValue.reduce(
    (sum, item) => sum + numeric(item.current_value),
    0
  );

  const totalValuedInvested = investmentsWithValue.reduce(
    (sum, item) => sum + numeric(item.invested_amount),
    0
  );

  const investmentGain = totalCurrentValue - totalValuedInvested;
  const investmentGainRate =
    totalValuedInvested > 0
      ? (investmentGain / totalValuedInvested) * 100
      : 0;

  const totalGoalTarget = goals.reduce(
    (sum, goal) => sum + numeric(goal.target_amount),
    0
  );

  const totalGoalSaved = goals.reduce(
    (sum, goal) => sum + numeric(goal.current_amount),
    0
  );

  const goalProgress =
    totalGoalTarget > 0
      ? Math.min(100, (totalGoalSaved / totalGoalTarget) * 100)
      : 0;

  const maxValue = Math.max(
    1,
    ...monthlyData.flatMap((item) => [
      item.income,
      item.expense,
      Math.max(0, item.savings),
    ])
  );

  const insights = useMemo(() => {
    const result: {
      title: string;
      description: string;
      positive: boolean;
    }[] = [];

    if (selectedData.income === 0 && selectedData.expense === 0) {
      result.push({
        title: "No recorded activity yet",
        description:
          "Add income sources and transactions to start seeing personalised insights.",
        positive: true,
      });
    } else {
      if (selectedData.savings >= 0) {
        result.push({
          title: "Positive cash flow",
          description: `You have ${currency(selectedData.savings)} left after recorded expenses this month.`,
          positive: true,
        });
      } else {
        result.push({
          title: "Expenses exceed income",
          description: `Recorded expenses are ${currency(Math.abs(selectedData.savings))} above income this month.`,
          positive: false,
        });
      }
    }

    const largestCategory = spendingCategories[0];
    if (largestCategory && totalSpending > 0) {
      result.push({
        title: `${largestCategory.name} is your top category`,
        description: `${largestCategory.percentage.toFixed(1)}% of your recorded expenses are in this category.`,
        positive: largestCategory.percentage < 40,
      });
    }

    if (previousData && expenseChange !== null) {
      result.push({
        title:
          expenseChange <= 0
            ? "Spending has decreased"
            : "Spending has increased",
        description: `Expenses changed by ${Math.abs(expenseChange).toFixed(1)}% compared with the previous displayed month.`,
        positive: expenseChange <= 0,
      });
    }

    return result;
  }, [
    selectedData,
    spendingCategories,
    totalSpending,
    previousData,
    expenseChange,
  ]);

  const monthOptions = useMemo(() => {
    const now = new Date();
    const options = Array.from({ length: 24 }, (_, index) => {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - index,
        1
      );

      return {
        key: monthKey(date),
        label: date.toLocaleDateString("en-IN", {
          month: "long",
          year: "numeric",
        }),
      };
    });

    if (!options.some((item) => item.key === selectedMonth)) {
      options.push({ key: selectedMonth, label: selectedMonth });
    }

    return options;
  }, [selectedMonth]);

  const changeLabel = (value: number | null) => {
    if (value === null) return "No previous data";
    return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07110D] text-white">
        <div className="flex min-h-screen">
          <AppSidebar />
          <main className="flex flex-1 items-center justify-center pb-24 lg:pb-0">
            <div className="flex items-center gap-3 text-sm text-white/50">
              <LoaderCircle className="animate-spin" size={20} />
              Loading your analytics...
            </div>
          </main>
        </div>
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07110D] text-white">
      <div className="flex min-h-screen">
        <AppSidebar />

        <main className="min-w-0 flex-1 pb-24 lg:pb-0">
          <header className="flex min-h-[82px] flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] px-5 py-4 sm:px-8 lg:px-10">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/25">
                Insights
              </p>
              <h1 className="mt-1 text-xl font-semibold sm:text-2xl">
                Analytics
              </h1>
              <p className="mt-1 text-xs text-white/30">
                Your money, based on recorded data.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <label className="flex h-10 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3">
                <CalendarDays size={14} className="text-white/35" />
                <select
                  value={selectedMonth}
                  onChange={(event) => setSelectedMonth(event.target.value)}
                  className="max-w-[180px] bg-transparent text-xs text-white/70 outline-none"
                >
                  {monthOptions.map((item) => (
                    <option
                      key={item.key}
                      value={item.key}
                      className="bg-[#07110D]"
                    >
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="button"
                onClick={() => void loadAnalytics(true)}
                disabled={refreshing}
                className="flex h-10 items-center gap-2 rounded-xl border border-white/[0.08] px-3 text-xs text-white/60 transition hover:border-emerald-400/30 hover:text-emerald-300 disabled:opacity-50"
              >
                <RefreshCw
                  size={14}
                  className={refreshing ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </div>
          </header>

          <div className="mx-auto w-full max-w-[1500px] px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.06] p-4 text-sm text-red-200">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">Could not load all analytics data</p>
                  <p className="mt-1 break-words text-xs text-red-200/70">
                    {error}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void loadAnalytics(true)}
                  className="shrink-0 text-xs underline"
                >
                  Retry
                </button>
              </div>
            )}

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                title="Monthly Income"
                value={currency(selectedData.income)}
                comparison={changeLabel(incomeChange)}
                positive={incomeChange === null || incomeChange >= 0}
                icon={<ArrowUpRight size={18} />}
                accent="emerald"
              />
              <MetricCard
                title="Monthly Expenses"
                value={currency(selectedData.expense)}
                comparison={changeLabel(expenseChange)}
                positive={expenseChange === null || expenseChange <= 0}
                icon={<ArrowDownRight size={18} />}
                accent="red"
              />
              <MetricCard
                title="Monthly Savings"
                value={currency(selectedData.savings)}
                comparison={`${savingsRate.toFixed(1)}% savings rate`}
                positive={selectedData.savings >= 0}
                icon={<Wallet size={18} />}
                accent="emerald"
              />
              <MetricCard
                title="Tracked Net Worth"
                value={currency(
                  totalCurrentValue + totalGoalSaved
                )}
                comparison="Investments + goal savings"
                positive={true}
                icon={<TrendingUp size={18} />}
                accent="neutral"
              />
            </section>

            <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.8fr)]">
              <div className="min-w-0 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="font-semibold">Cash Flow</h2>
                    <p className="mt-1 text-xs text-white/30">
                      Income, expenses and positive savings over time.
                    </p>
                  </div>
                  <select
                    value={period}
                    onChange={(event) => setPeriod(event.target.value)}
                    className="h-9 rounded-lg border border-white/[0.08] bg-[#0A1510] px-3 text-xs text-white/60 outline-none"
                  >
                    <option value="3">Last 3 months</option>
                    <option value="6">Last 6 months</option>
                    <option value="12">Last 12 months</option>
                  </select>
                </div>

                <div className="mt-6 flex flex-wrap gap-4 text-[11px] text-white/40">
                  <Legend color="#34d399" label="Income" />
                  <Legend color="rgba(255,255,255,0.35)" label="Expenses" />
                  <Legend color="#60a5fa" label="Positive savings" />
                </div>

                <div className="mt-6 flex h-[250px] gap-3">
                  <div className="flex w-12 flex-col justify-between pb-7 text-right text-[10px] text-white/25">
                    <span>{compactCurrency(maxValue)}</span>
                    <span>{compactCurrency(maxValue * 0.66)}</span>
                    <span>{compactCurrency(maxValue * 0.33)}</span>
                    <span>₹0</span>
                  </div>

                  <div className="relative flex min-w-0 flex-1 flex-col">
                    <div className="absolute inset-0 flex flex-col justify-between pb-7">
                      {[0, 1, 2, 3].map((line) => (
                        <div
                          key={line}
                          className="border-t border-white/[0.06]"
                        />
                      ))}
                    </div>

                    <div className="relative flex h-full items-end justify-around gap-1 pb-7">
                      {monthlyData.map((item) => (
                        <div
                          key={item.key}
                          className="flex h-full min-w-0 flex-1 items-end justify-center gap-0.5"
                          title={`${item.month}: Income ${currency(item.income)}, Expenses ${currency(item.expense)}, Savings ${currency(item.savings)}`}
                        >
                          <Bar value={item.income} max={maxValue} color="#34d399" />
                          <Bar value={item.expense} max={maxValue} color="rgba(255,255,255,0.35)" />
                          <Bar value={Math.max(0, item.savings)} max={maxValue} color="#60a5fa" />
                          <span className="absolute bottom-0 translate-y-0.5 text-[10px] text-white/30">
                            {item.month}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="mt-2 text-[10px] leading-4 text-white/25">
                  Negative savings mean recorded expenses exceeded recorded income. Bars show positive savings only.
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
                <h2 className="font-semibold">Spending Breakdown</h2>
                <p className="mt-1 text-xs text-white/30">
                  Recorded expenses in {selectedMonth}.
                </p>

                <div className="mt-7 flex justify-center">
                  <div
                    className="relative flex h-44 w-44 items-center justify-center rounded-full"
                    style={donutStyle}
                  >
                    <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-[#0A1510]">
                      <p className="text-xs text-white/35">Total spent</p>
                      <p className="mt-1 max-w-[100px] truncate text-center text-lg font-bold">
                        {compactCurrency(totalSpending)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-7 space-y-3">
                  {spendingCategories.length === 0 ? (
                    <EmptyMessage>
                      No expense transactions recorded for this month.
                    </EmptyMessage>
                  ) : (
                    spendingCategories.map((item, index) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between gap-3"
                      >
                        <div className="flex min-w-0 items-center gap-2.5">
                          <span
                            className="h-2.5 w-2.5 shrink-0 rounded-full"
                            style={{
                              background: COLORS[index % COLORS.length],
                            }}
                          />
                          <span className="truncate text-xs text-white/55">
                            {item.name}
                          </span>
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                          <span className="text-xs text-white/70">
                            {currency(item.amount)}
                          </span>
                          <span className="w-10 text-right text-[10px] text-white/35">
                            {item.percentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>

            <section className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-semibold">Savings Rate</h2>
                    <p className="mt-1 text-xs text-white/30">
                      Income left after recorded expenses.
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Wallet size={18} />
                  </div>
                </div>

                <div className="mt-7 flex items-end justify-between gap-4">
                  <div>
                    <p
                      className={`text-4xl font-bold ${
                        selectedData.savings >= 0
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {savingsRate.toFixed(1)}%
                    </p>
                    <p className="mt-2 text-xs text-white/30">
                      {selectedData.month} savings rate
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/30">Net cash flow</p>
                    <p
                      className={`mt-1 font-semibold ${
                        selectedData.savings >= 0
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {currency(selectedData.savings)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className={`h-full rounded-full transition-all ${
                      selectedData.savings >= 0
                        ? "bg-emerald-400"
                        : "bg-red-400"
                    }`}
                    style={{ width: `${Math.min(100, Math.abs(savingsRate))}%` }}
                  />
                </div>
                <div className="mt-3 flex justify-between text-[10px] text-white/25">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-semibold">Investment Performance</h2>
                    <p className="mt-1 text-xs text-white/30">
                      Based on your saved investment records.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push("/investments")}
                    className="shrink-0 text-xs font-medium text-emerald-400 transition hover:text-emerald-300"
                  >
                    View Portfolio
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <ValueCard label="Total Invested" value={currency(totalInvested)} />
                  <ValueCard
                    label="Current Value"
                    value={
                      investmentsWithValue.length
                        ? currency(totalCurrentValue)
                        : "Not available"
                    }
                  />
                </div>

                <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-xs text-white/30">
                      Gain / Loss on valued holdings
                    </p>
                    <p
                      className={`mt-1 text-xl font-bold ${
                        investmentGain >= 0
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {investmentsWithValue.length
                        ? `${investmentGain >= 0 ? "+" : ""}${currency(investmentGain)}`
                        : "Not available"}
                    </p>
                  </div>
                  {investmentsWithValue.length > 0 && (
                    <span
                      className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs ${
                        investmentGain >= 0
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {investmentGain >= 0 ? (
                        <ArrowUpRight size={13} />
                      ) : (
                        <ArrowDownRight size={13} />
                      )}
                      {investmentGainRate.toFixed(2)}%
                    </span>
                  )}
                </div>
                {investments.length > investmentsWithValue.length && (
                  <p className="mt-4 text-[11px] leading-5 text-white/30">
                    {investments.length - investmentsWithValue.length} holding(s) have no current value yet. Gain/loss excludes those holdings.
                  </p>
                )}
                {investments.length === 0 && (
                  <p className="mt-4 text-xs text-white/30">
                    Add holdings to your Investments page to see performance here.
                  </p>
                )}
              </div>
            </section>

            <section className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Target size={18} />
                </div>
                <div>
                  <h2 className="font-semibold">Goals Progress</h2>
                  <p className="text-xs text-white/30">
                    Your saved progress against goal targets.
                  </p>
                </div>
              </div>

              {goals.length === 0 ? (
                <div className="mt-5">
                  <EmptyMessage>
                    No goals yet. Add a goal to start tracking progress.
                  </EmptyMessage>
                </div>
              ) : (
                <>
                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <ValueCard label="Goals" value={String(goals.length)} />
                    <ValueCard label="Total Saved" value={currency(totalGoalSaved)} />
                    <ValueCard label="Combined Target" value={currency(totalGoalTarget)} />
                  </div>
                  <div className="mt-6 space-y-4">
                    {goals.map((goal) => {
                      const target = numeric(goal.target_amount);
                      const saved = numeric(goal.current_amount);
                      const progress =
                        target > 0 ? Math.min(100, (saved / target) * 100) : 0;

                      return (
                        <div key={goal.id}>
                          <div className="flex items-center justify-between gap-3">
                            <span className="truncate text-sm text-white/70">
                              {goal.name}
                            </span>
                            <span className="shrink-0 text-xs text-white/40">
                              {progress.toFixed(0)}%
                            </span>
                          </div>
                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                            <div
                              className="h-full rounded-full bg-emerald-400"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <p className="mt-1.5 text-[11px] text-white/30">
                            {currency(saved)} of {currency(target)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              <p className="mt-5 text-sm text-white/60">
                Overall goal progress:{" "}
                <span className="font-semibold text-emerald-400">
                  {goalProgress.toFixed(1)}%
                </span>
              </p>
            </section>

            <section className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <BarChart3 size={18} />
                </div>
                <div>
                  <h2 className="font-semibold">Wealthly Insights</h2>
                  <p className="text-xs text-white/30">
                    Observations calculated from your recorded data.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 lg:grid-cols-3">
                {insights.map((insight) => (
                  <div
                    key={insight.title}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                  >
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                        insight.positive
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {insight.positive ? (
                        <TrendingUp size={17} />
                      ) : (
                        <TrendingDown size={17} />
                      )}
                    </div>
                    <h3 className="mt-4 text-sm font-medium">
                      {insight.title}
                    </h3>
                    <p className="mt-2 text-xs leading-5 text-white/35">
                      {insight.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-6 rounded-xl border border-white/[0.05] bg-white/[0.015] p-4">
              <div className="flex gap-3">
                <PieChart size={17} className="mt-0.5 shrink-0 text-white/25" />
                <p className="text-[11px] leading-5 text-white/30">
                  Analytics are based on records saved in Wealthly. Monthly and
                  yearly income sources are converted to a monthly estimate;
                  one-time income is counted in its recorded month. Investment
                  gain/loss includes only holdings with a saved current value.
                  Tracked net worth here is a limited estimate of investment
                  value plus goal savings, not a complete bank balance or
                  liabilities calculation.
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

function MetricCard({
  title,
  value,
  comparison,
  positive,
  icon,
  accent,
}: {
  title: string;
  value: string;
  comparison: string;
  positive: boolean;
  icon: React.ReactNode;
  accent: "emerald" | "red" | "neutral";
}) {
  const iconClass =
    accent === "emerald"
      ? "bg-emerald-500/10 text-emerald-400"
      : accent === "red"
      ? "bg-red-500/10 text-red-400"
      : "bg-white/[0.05] text-white/45";

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
      <div className="flex items-center justify-between gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconClass}`}>
          {icon}
        </div>
        <span
          className={`max-w-[60%] text-right text-[11px] ${
            positive ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {comparison}
        </span>
      </div>
      <p className="mt-5 text-xs text-white/35">{title}</p>
      <p className="mt-1 break-words text-2xl font-bold">{value}</p>
      <p className="mt-2 text-[11px] text-white/25">Based on saved records</p>
    </div>
  );
}

function ValueCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
      <p className="text-[11px] text-white/30">{label}</p>
      <p className="mt-2 break-words text-lg font-semibold">{value}</p>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}

function Bar({
  value,
  max,
  color,
}: {
  value: number;
  max: number;
  color: string;
}) {
  const height = Math.max(0, (value / max) * 205);

  return (
    <div
      className="min-w-0 flex-1 max-w-5 rounded-t-sm transition-opacity hover:opacity-75"
      style={{
        height: `${height}px`,
        backgroundColor: color,
        minHeight: value > 0 ? "2px" : "0",
      }}
    />
  );
}

function EmptyMessage({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-lg border border-dashed border-white/[0.08] px-3 py-4 text-xs leading-5 text-white/35">
      {children}
    </p>
  );
}

function compactCurrency(amount: number) {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}k`;
  return `₹${Math.round(amount)}`;
}
