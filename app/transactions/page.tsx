
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  Search,
  Wallet,
  Plus,
  Pencil,
  Trash2,
  X,
  CalendarDays,
  LoaderCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

import AppSidebar from "@/components/ui/app-sidebar";
import MobileNav from "@/components/ui/mobile-nav";
import { supabase } from "@/lib/supabase";

type TransactionType = "income" | "expense";

type Transaction = {
  id: string;
  name: string;
  category: string;
  date: string;
  amount: number;
  type: TransactionType;
};

type TransactionRow = {
  id: string;
  description: string | null;
  category: string;
  transaction_date: string;
  amount: number | string;
  type: string;
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const todayString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;

  if (typeof error === "object" && error !== null && "message" in error) {
    return String(error.message);
  }

  return String(error);
}

const emptyForm = {
  name: "",
  category: "Food",
  amount: "",
  type: "expense" as TransactionType,
  date: todayString(),
};

export default function TransactionsPage() {
  const router = useRouter();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageError, setPageError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    setPageError("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw new Error(`Authentication: ${authError.message}`);
      }

      if (!user) {
        router.push("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("transactions")
        .select(
          "id, description, category, transaction_date, amount, type"
        )
        .eq("user_id", user.id)
        .order("transaction_date", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(`Transactions query: ${error.message}`);
      }

      const rows = (data ?? []) as TransactionRow[];

      setTransactions(
        rows.map((row) => ({
          id: row.id,
          name: row.description?.trim() || row.category,
          category: row.category,
          date: row.transaction_date,
          amount: Number(row.amount),
          type: row.type as TransactionType,
        }))
      );
    } catch (error) {
      console.error("Transactions loading error:", error);
      setPageError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const income = transactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);

  const expense = transactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return transactions.filter((transaction) => {
      const matchesFilter =
        filter === "All" ||
        (filter === "Income" && transaction.type === "income") ||
        (filter === "Expense" && transaction.type === "expense");

      const matchesSearch =
        transaction.name.toLowerCase().includes(query) ||
        transaction.category.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [transactions, filter, search]);

  function openAddModal() {
    setEditingId(null);
    setForm({
      ...emptyForm,
      date: todayString(),
    });
    setPageError("");
    setShowModal(true);
  }

  function openEditModal(transaction: Transaction) {
    setEditingId(transaction.id);
    setForm({
      name: transaction.name,
      category: transaction.category,
      amount: String(transaction.amount),
      type: transaction.type,
      date: transaction.date,
    });
    setPageError("");
    setShowModal(true);
  }

  async function handleSaveTransaction() {
    const name = form.name.trim();
    const category = form.category.trim();
    const amount = Number(form.amount);

    if (!name || !category || !form.date) {
      setPageError("Please fill in the description, category and date.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setPageError("Enter an amount greater than zero.");
      return;
    }

    setSaving(true);
    setPageError("");

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

      const payload = {
        user_id: user.id,
        description: name,
        category,
        amount,
        type: form.type,
        transaction_date: form.date,
        updated_at: new Date().toISOString(),
      };

      if (editingId) {
        const { data, error } = await supabase
          .from("transactions")
          .update({
            description: payload.description,
            category: payload.category,
            amount: payload.amount,
            type: payload.type,
            transaction_date: payload.transaction_date,
            updated_at: payload.updated_at,
          })
          .eq("id", editingId)
          .eq("user_id", user.id)
          .select("id");

        if (error) throw error;

        if (!data || data.length === 0) {
          throw new Error(
            "Transaction was not updated. Check your table permissions."
          );
        }
      } else {
        const { error } = await supabase
          .from("transactions")
          .insert(payload);

        if (error) throw error;
      }

      setShowModal(false);
      setEditingId(null);
      setForm({
        ...emptyForm,
        date: todayString(),
      });

      await loadTransactions();
    } catch (error) {
      console.error("Saving transaction error:", error);
      setPageError(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteTransaction(transaction: Transaction) {
    const confirmed = window.confirm(
      `Delete "${transaction.name}"? This cannot be undone.`
    );

    if (!confirmed) return;

    setPageError("");

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

      const { data, error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", transaction.id)
        .eq("user_id", user.id)
        .select("id");

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error(
          "Transaction was not deleted. Check your table permissions."
        );
      }

      await loadTransactions();
    } catch (error) {
      console.error("Deleting transaction error:", error);
      setPageError(getErrorMessage(error));
    }
  }

  return (
    <div className="min-h-screen bg-[#07110D] text-white">
      <div className="flex min-h-screen">
        <AppSidebar />

        <main className="min-w-0 flex-1 pb-24 lg:pb-0">
          <header className="flex min-h-[82px] items-center gap-4 border-b border-white/[0.06] px-5 py-4 sm:px-8 lg:px-10">
            <button
              onClick={() => router.back()}
              aria-label="Go back"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] text-white/40 hover:bg-white/[0.04] lg:hidden"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.2em] text-white/25">
                Activity
              </p>
              <h1 className="mt-1 text-xl font-semibold sm:text-2xl">
                Transactions
              </h1>
            </div>

            <button
              onClick={openAddModal}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-[#07110D] transition hover:bg-emerald-400"
            >
              <Plus size={17} />
              <span className="hidden sm:inline">Add Transaction</span>
              <span className="sm:hidden">Add</span>
            </button>
          </header>

          <div className="mx-auto w-full max-w-[1400px] px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
            {pageError && (
              <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/[0.05] p-4 text-sm text-red-400">
                <p className="font-semibold">Transaction error</p>
                <p className="mt-1 break-words">{pageError}</p>
                <button
                  onClick={loadTransactions}
                  className="mt-3 underline"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Summary */}
            <section className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <p className="text-sm text-white/35">Total Transactions</p>
                <p className="mt-3 text-2xl font-bold">
                  {loading ? "..." : transactions.length}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <p className="text-sm text-white/35">Income</p>
                <p className="mt-3 text-2xl font-bold text-emerald-400">
                  {loading ? "..." : `+${formatCurrency(income)}`}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <p className="text-sm text-white/35">Expenses</p>
                <p className="mt-3 text-2xl font-bold">
                  {loading ? "..." : formatCurrency(expense)}
                </p>
              </div>
            </section>

            {/* Transaction List */}
            <section className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.025]">
              <div className="border-b border-white/[0.06] p-5 sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="relative w-full lg:max-w-sm">
                    <Search
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
                    />

                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search transactions..."
                      className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-emerald-500/40"
                    />
                  </div>

                  <div className="flex gap-2 overflow-x-auto">
                    {["All", "Income", "Expense"].map((item) => (
                      <button
                        key={item}
                        onClick={() => setFilter(item)}
                        className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                          filter === item
                            ? "bg-emerald-500 text-[#07110D]"
                            : "bg-white/[0.04] text-white/40 hover:text-white"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="divide-y divide-white/[0.05]">
                {loading ? (
                  <div className="flex items-center justify-center gap-2 px-6 py-14 text-sm text-white/40">
                    <LoaderCircle size={18} className="animate-spin" />
                    Loading transactions...
                  </div>
                ) : filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between gap-3 px-5 py-5 sm:px-6"
                    >
                      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                            transaction.type === "income"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-white/[0.04] text-white/40"
                          }`}
                        >
                          {transaction.type === "income" ? (
                            <ArrowUpRight size={19} />
                          ) : (
                            <ArrowDownRight size={19} />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {transaction.name}
                          </p>
                          <p className="mt-1 truncate text-xs text-white/25">
                            {transaction.category} • {formatDate(transaction.date)}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
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

                        <button
                          onClick={() => openEditModal(transaction)}
                          aria-label={`Edit ${transaction.name}`}
                          title="Edit transaction"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 hover:bg-white/[0.06] hover:text-emerald-400"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          onClick={() => handleDeleteTransaction(transaction)}
                          aria-label={`Delete ${transaction.name}`}
                          title="Delete transaction"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-14 text-center">
                    <Wallet size={24} className="mx-auto text-white/20" />
                    <p className="mt-4 text-sm text-white/50">
                      {search || filter !== "All"
                        ? "No matching transactions found"
                        : "No transactions yet. Add your first transaction."}
                    </p>
                    {!search && filter === "All" && (
                      <button
                        onClick={openAddModal}
                        className="mt-4 text-sm font-medium text-emerald-400"
                      >
                        + Add Transaction
                      </button>
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>

      <MobileNav />

      {/* Add / Edit Transaction Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-md rounded-3xl border border-white/10 bg-[#0B1712] p-6 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">
                  {editingId ? "Edit Transaction" : "Add Transaction"}
                </h2>
                <p className="mt-1 text-sm text-white/30">
                  Your changes will be saved to your account.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                disabled={saving}
                aria-label="Close modal"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-white/40 hover:bg-white/[0.05]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-xs text-white/45">
                  Transaction type
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {(["expense", "income"] as TransactionType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() =>
                        setForm((previous) => ({
                          ...previous,
                          type,
                          category:
                            type === "income"
                              ? previous.category === "Food"
                                ? "Salary"
                                : previous.category
                              : previous.category === "Salary"
                                ? "Food"
                                : previous.category,
                        }))
                      }
                      className={`h-11 rounded-xl text-sm font-medium capitalize ${
                        form.type === type
                          ? type === "income"
                            ? "bg-emerald-500 text-[#07110D]"
                            : "bg-white/15 text-white"
                          : "border border-white/[0.08] text-white/40"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs text-white/45">
                  Description
                </label>
                <input
                  value={form.name}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      name: event.target.value,
                    }))
                  }
                  placeholder={
                    form.type === "income"
                      ? "e.g. Monthly salary"
                      : "e.g. Grocery shopping"
                  }
                  maxLength={120}
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm outline-none placeholder:text-white/20 focus:border-emerald-500/40"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs text-white/45">
                  Category
                </label>
                <input
                  value={form.category}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      category: event.target.value,
                    }))
                  }
                  placeholder="e.g. Food, Housing, Salary"
                  maxLength={80}
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm outline-none placeholder:text-white/20 focus:border-emerald-500/40"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs text-white/45">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.amount}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      amount: event.target.value,
                    }))
                  }
                  placeholder="e.g. 1500"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm outline-none placeholder:text-white/20 focus:border-emerald-500/40"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-xs text-white/45">
                  <CalendarDays size={14} />
                  Transaction date
                </label>
                <input
                  type="date"
                  value={form.date}
                  max={todayString()}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      date: event.target.value,
                    }))
                  }
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none focus:border-emerald-500/40"
                />
              </div>

              {pageError && (
                <p className="break-words text-sm text-red-400">{pageError}</p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                  className="h-12 flex-1 rounded-xl border border-white/10 bg-white/[0.03] text-sm text-white/60 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSaveTransaction}
                  disabled={saving}
                  className="h-12 flex-1 rounded-xl bg-emerald-500 text-sm font-semibold text-[#07110D] hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Save Changes"
                      : "Add Transaction"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
