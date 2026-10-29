
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  ChevronRight,
  Plus,
  Wallet,
  Trash2,
} from "lucide-react";

import AppSidebar from "@/components/ui/app-sidebar";
import MobileNav from "@/components/ui/mobile-nav";
import { supabase } from "@/lib/supabase";

type BudgetCategory = {
  id: string;
  name: string;
  budget: number;
  spent: number;
};

type BudgetRow = {
  id: string;
  category: string;
  monthly_limit: number;
  month_start: string;
};

type TransactionRow = {
  category: string;
  amount: number;
  type: string;
  transaction_date: string;
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const getLocalDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;

  if (typeof error === "object" && error !== null && "message" in error) {
    return String(error.message);
  }

  return String(error);
}

export default function BudgetPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newBudget, setNewBudget] = useState({
    name: "",
    amount: "",
  });

  const [monthStart, setMonthStart] = useState("");

  const loadBudgets = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw new Error(`Authentication: ${authError.message}`);

      if (!user) {
        router.push("/auth");
        return;
      }

      const now = new Date();
      const start = getLocalDateString(
        new Date(now.getFullYear(), now.getMonth(), 1)
      );
      const today = getLocalDateString(now);

      setMonthStart(start);

      const { data: budgetRows, error: budgetError } = await supabase
        .from("budgets")
        .select("id, category, monthly_limit, month_start")
        .eq("user_id", user.id)
        .eq("month_start", start)
        .order("category");

      if (budgetError) {
        throw new Error(`Budget query: ${budgetError.message}`);
      }

      const { data: transactionRows, error: transactionError } =
        await supabase
          .from("transactions")
          .select("category, amount, type, transaction_date")
          .eq("user_id", user.id)
          .eq("type", "expense")
          .gte("transaction_date", start)
          .lte("transaction_date", today);

      if (transactionError) {
        throw new Error(`Transactions query: ${transactionError.message}`);
      }

      const spending = new Map<string, number>();

      ((transactionRows ?? []) as TransactionRow[]).forEach((transaction) => {
        const category = transaction.category || "Other";
        const key = category.trim().toLowerCase();

        spending.set(
          key,
          (spending.get(key) ?? 0) + Number(transaction.amount)
        );
      });

      const loadedBudgets: BudgetCategory[] = (
        (budgetRows ?? []) as BudgetRow[]
      ).map((row) => ({
        id: row.id,
        name: row.category,
        budget: Number(row.monthly_limit),
        spent: spending.get(row.category.trim().toLowerCase()) ?? 0,
      }));

      // Also show spending categories even when no budget has been set.
      spending.forEach((amount, key) => {
        const alreadyIncluded = loadedBudgets.some(
          (budget) => budget.name.trim().toLowerCase() === key
        );

        if (!alreadyIncluded) {
          const originalName =
            ((transactionRows ?? []) as TransactionRow[]).find(
              (transaction) =>
                transaction.category.trim().toLowerCase() === key
            )?.category || key;

          loadedBudgets.push({
            id: `unbudgeted-${key}`,
            name: originalName,
            budget: 0,
            spent: amount,
          });
        }
      });

      setCategories(loadedBudgets);
    } catch (err) {
      console.error("Budget loading error:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadBudgets();
  }, [loadBudgets]);

  const totalBudget = categories.reduce(
    (sum, category) => sum + category.budget,
    0
  );

  const totalSpent = categories.reduce(
    (sum, category) => sum + category.spent,
    0
  );

  const remaining = totalBudget - totalSpent;

  const percentage =
    totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const currentMonth = new Date().toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  async function handleAddBudget() {
    const name = newBudget.name.trim();
    const amount = Number(newBudget.amount);

    if (!name || !Number.isFinite(amount) || amount <= 0 || !monthStart) {
      setError("Enter a category name and a valid budget amount.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;

      if (!user) {
        router.push("/auth");
        return;
      }

      const { error: saveError } = await supabase
        .from("budgets")
        .upsert(
          {
            user_id: user.id,
            category: name,
            monthly_limit: amount,
            month_start: monthStart,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id,category,month_start",
          }
        );

      if (saveError) throw saveError;

      setNewBudget({ name: "", amount: "" });
      setShowModal(false);

      await loadBudgets();
    } catch (err) {
      console.error("Saving budget error:", err);
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteBudget(category: BudgetCategory) {
    if (category.id.startsWith("unbudgeted-")) return;

    const confirmed = window.confirm(
      `Delete the ${category.name} budget for ${currentMonth}?`
    );

    if (!confirmed) return;

    setError("");

    const { error: deleteError } = await supabase
      .from("budgets")
      .delete()
      .eq("id", category.id);

    if (deleteError) {
      setError(`Delete budget: ${deleteError.message}`);
      return;
    }

    await loadBudgets();
  }

  return (
    <div className="min-h-screen bg-[#07110D] text-white">
      <div className="flex min-h-screen">
        <AppSidebar />

        <main className="min-w-0 flex-1 pb-24 lg:pb-0">
          <header className="flex h-[82px] items-center gap-4 border-b border-white/[0.06] px-5 sm:px-8 lg:px-10">
            <button
              onClick={() => router.back()}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] text-white/40 hover:bg-white/[0.04] lg:hidden"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.2em] text-white/25">
                Planning
              </p>

              <h1 className="mt-1 text-xl font-semibold sm:text-2xl">
                Budget
              </h1>
            </div>

            <button
              onClick={() => {
                setError("");
                setShowModal(true);
              }}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-[#07110D] hover:bg-emerald-400"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Add Budget</span>
              <span className="sm:hidden">Add</span>
            </button>
          </header>

          <div className="mx-auto w-full max-w-[1400px] px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
            {error && (
              <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/[0.05] p-4 text-sm text-red-400">
                <p className="font-semibold">Budget error</p>
                <p className="mt-1 break-words">{error}</p>

                <button
                  onClick={loadBudgets}
                  className="mt-3 underline"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Main Budget */}
            <section className="rounded-3xl border border-emerald-500/10 bg-emerald-500/[0.035] p-6 sm:p-8">
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div>
                  <p className="text-sm text-white/35">
                    {currentMonth} Budget
                  </p>

                  <p className="mt-3 text-4xl font-bold tracking-tight">
                    {loading ? "Loading..." : formatCurrency(totalBudget)}
                  </p>

                  <p className="mt-2 text-sm text-white/30">
                    {formatCurrency(remaining)} remaining
                  </p>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                  <Wallet size={27} />
                </div>
              </div>

              <div className="mt-8">
                <div className="flex justify-between text-sm">
                  <span className="text-white/35">
                    {formatCurrency(totalSpent)} spent
                  </span>

                  <span className="text-emerald-400">
                    {percentage.toFixed(1)}%
                  </span>
                </div>

                <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
            </section>

            {/* Categories */}
            <section className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.025]">
              <div className="border-b border-white/[0.06] px-5 py-4 sm:px-6">
                <h2 className="font-semibold">Budget Categories</h2>

                <p className="mt-1 text-xs text-white/25">
                  Track your monthly spending limits
                </p>
              </div>

              <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-3">
                {loading ? (
                  <p className="col-span-full py-8 text-center text-sm text-white/40">
                    Loading your budgets...
                  </p>
                ) : categories.length === 0 ? (
                  <div className="col-span-full py-8 text-center">
                    <p className="text-sm text-white/40">
                      No budgets or expenses recorded this month yet.
                    </p>

                    <button
                      onClick={() => setShowModal(true)}
                      className="mt-3 text-sm text-emerald-400"
                    >
                      Create your first budget
                    </button>
                  </div>
                ) : (
                  categories.map((category) => {
                    const progress =
                      category.budget > 0
                        ? (category.spent / category.budget) * 100
                        : category.spent > 0
                          ? 100
                          : 0;

                    const overBudget =
                      category.budget > 0 &&
                      category.spent > category.budget;

                    return (
                      <div
                        key={category.id}
                        className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium">{category.name}</p>

                            <p className="mt-1 text-xs text-white/25">
                              {formatCurrency(category.spent)} spent
                            </p>
                          </div>

                          {category.budget > 0 ? (
                            <span
                              className={`text-xs font-medium ${
                                overBudget
                                  ? "text-red-400"
                                  : "text-emerald-400"
                              }`}
                            >
                              {Math.round(progress)}%
                            </span>
                          ) : (
                            <span className="text-xs text-white/35">
                              No limit
                            </span>
                          )}
                        </div>

                        <div className="mt-5 h-2 rounded-full bg-white/[0.06]">
                          <div
                            className={`h-full rounded-full ${
                              overBudget
                                ? "bg-red-400"
                                : "bg-emerald-500"
                            }`}
                            style={{
                              width: `${Math.min(progress, 100)}%`,
                            }}
                          />
                        </div>

                        <div className="mt-3 flex justify-between text-xs">
                          <span className="text-white/25">Budget limit</span>

                          <span className="text-white/50">
                            {category.budget > 0
                              ? formatCurrency(category.budget)
                              : "Not set"}
                          </span>
                        </div>

                        {!category.id.startsWith("unbudgeted-") && (
                          <button
                            onClick={() => handleDeleteBudget(category)}
                            className="mt-4 flex items-center gap-2 text-xs text-white/35 transition hover:text-red-400"
                          >
                            <Trash2 size={14} />
                            Delete budget
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </section>

            {/* Budget Insight */}
            <section className="mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">Budget Insight</h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-white/30">
                    {loading
                      ? "Calculating your spending..."
                      : totalBudget === 0
                        ? "Set a monthly budget to start tracking your spending limits."
                        : `You have used ${percentage.toFixed(1)}% of your monthly budget. ${
                            remaining < 0
                              ? `You are ${formatCurrency(Math.abs(remaining))} over budget.`
                              : "Keep an eye on your spending as the month progresses."
                          }`}
                  </p>
                </div>

                <ChevronRight
                  size={20}
                  className="hidden text-white/20 sm:block"
                />
              </div>
            </section>
          </div>
        </main>
      </div>

      <MobileNav />

      {/* Add Budget Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0B1712] p-6 shadow-2xl sm:p-7">
            <h2 className="text-xl font-semibold">Add Budget</h2>

            <p className="mt-1 text-sm text-white/30">
              Create or update a monthly spending category.
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-xs text-white/45">
                  Category
                </label>

                <input
                  value={newBudget.name}
                  onChange={(event) =>
                    setNewBudget((previous) => ({
                      ...previous,
                      name: event.target.value,
                    }))
                  }
                  placeholder="e.g. Food"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm outline-none placeholder:text-white/20 focus:border-emerald-500/40"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs text-white/45">
                  Monthly Budget
                </label>

                <input
                  type="number"
                  min="1"
                  value={newBudget.amount}
                  onChange={(event) =>
                    setNewBudget((previous) => ({
                      ...previous,
                      amount: event.target.value,
                    }))
                  }
                  placeholder="₹ 2,000"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm outline-none placeholder:text-white/20 focus:border-emerald-500/40"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                  className="h-12 flex-1 rounded-xl border border-white/10 bg-white/[0.03] text-sm text-white/60 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleAddBudget}
                  disabled={saving}
                  className="h-12 flex-1 rounded-xl bg-emerald-500 text-sm font-semibold text-[#07110D] hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Budget"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
