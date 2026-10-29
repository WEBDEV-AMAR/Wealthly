
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronRight,
  CircleDollarSign,
  Plus,
  TrendingUp,
  Search,
  Pencil,
  Trash2,
  RefreshCw,
  X,
} from "lucide-react";

import AppSidebar from "@/components/ui/app-sidebar";
import MobileNav from "@/components/ui/mobile-nav";
import { supabase } from "@/lib/supabase";

type InvestmentType =
  | "mutual_fund"
  | "stocks"
  | "fd"
  | "gold"
  | "index_fund"
  | "other";

type Investment = {
  id: string;
  name: string;
  investment_type: InvestmentType;
  invested_amount: number;
  current_value: number | null;
  symbol: string | null;
  scheme_code: string | null;
  units: number | null;
  purchase_price: number | null;
  last_price: number | null;
  price_as_of: string | null;
  valuation_source: string;
};

type InvestmentForm = {
  name: string;
  investment_type: InvestmentType;
  invested_amount: string;
  current_value: string;
  symbol: string;
  scheme_code: string;
  units: string;
  purchase_price: string;
};

const emptyForm: InvestmentForm = {
  name: "",
  investment_type: "mutual_fund",
  invested_amount: "",
  current_value: "",
  symbol: "",
  scheme_code: "",
  units: "",
  purchase_price: "",
};

const investmentTypeLabels: Record<InvestmentType, string> = {
  mutual_fund: "Mutual Fund",
  stocks: "Stocks",
  fd: "Fixed Deposit",
  gold: "Gold",
  index_fund: "Index Fund",
  other: "Other",
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

function formatDate(value: string | null) {
  if (!value) return "Not available";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getCategory(type: InvestmentType) {
  switch (type) {
    case "stocks":
      return "Equity";
    case "mutual_fund":
      return "Mutual Fund";
    case "fd":
      return "Debt";
    case "gold":
      return "Gold";
    case "index_fund":
      return "Index";
    default:
      return "Other";
  }
}

function getValuationSourceLabel(source: string) {
  return source === "market" ? "Market-sourced" : "Manual valuation";
}

export default function InvestmentsPage() {
  const router = useRouter();

  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingInvestment, setEditingInvestment] =
    useState<Investment | null>(null);
  const [form, setForm] = useState<InvestmentForm>(emptyForm);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchInvestments = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;

      if (!user) {
        router.replace("/auth");
        return;
      }

      const { data, error: queryError } = await supabase
        .from("investments")
        .select(
          "id, name, investment_type, invested_amount, current_value, symbol, scheme_code, units, purchase_price, last_price, price_as_of, valuation_source"
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (queryError) throw queryError;

      setInvestments(
        (data ?? []).map((row) => ({
          id: row.id,
          name: row.name,
          investment_type: row.investment_type as InvestmentType,
          invested_amount: Number(row.invested_amount),
          current_value:
            row.current_value === null
              ? null
              : Number(row.current_value),
          symbol: row.symbol,
          scheme_code: row.scheme_code,
          units: row.units === null ? null : Number(row.units),
          purchase_price:
            row.purchase_price === null
              ? null
              : Number(row.purchase_price),
          last_price:
            row.last_price === null ? null : Number(row.last_price),
          price_as_of: row.price_as_of,
          valuation_source: row.valuation_source ?? "manual",
        }))
      );
    } catch (err) {
      console.error("Failed to fetch investments:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Could not load investments. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void fetchInvestments();
  }, [fetchInvestments]);

  const totalInvested = useMemo(
    () =>
      investments.reduce(
        (sum, item) => sum + item.invested_amount,
        0
      ),
    [investments]
  );

  // Only include known valuations. Unknown values are not treated as zero.
  const valuedInvestments = investments.filter(
    (item) => item.current_value !== null
  );

  const currentValue = valuedInvestments.reduce(
    (sum, item) => sum + (item.current_value ?? 0),
    0
  );

  const unvaluedCount = investments.length - valuedInvestments.length;
  const totalReturns = currentValue -
    valuedInvestments.reduce(
      (sum, item) => sum + item.invested_amount,
      0
    );

  const valuedPrincipal = valuedInvestments.reduce(
    (sum, item) => sum + item.invested_amount,
    0
  );

  const returnPercentage =
    valuedPrincipal > 0 ? (totalReturns / valuedPrincipal) * 100 : 0;

  const allocation = useMemo(() => {
    const totals = new Map<string, number>();

    for (const item of valuedInvestments) {
      const category = getCategory(item.investment_type);
      totals.set(
        category,
        (totals.get(category) ?? 0) + (item.current_value ?? 0)
      );
    }

    return Array.from(totals.entries())
      .map(([name, amount]) => ({
        name,
        amount,
        percentage:
          currentValue > 0 ? (amount / currentValue) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [investments, currentValue]); // Recompute when saved holdings change.

  const filteredInvestments = investments.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());

    const matchesType =
      filterType === "all" || item.investment_type === filterType;

    return matchesSearch && matchesType;
  });

  function openAddModal() {
    setEditingInvestment(null);
    setForm(emptyForm);
    setError("");
    setNotice("");
    setShowModal(true);
  }

  function openEditModal(item: Investment) {
    setEditingInvestment(item);
    setForm({
      name: item.name,
      investment_type: item.investment_type,
      invested_amount: String(item.invested_amount),
      current_value:
        item.current_value === null ? "" : String(item.current_value),
      symbol: item.symbol ?? "",
      scheme_code: item.scheme_code ?? "",
      units: item.units === null ? "" : String(item.units),
      purchase_price:
        item.purchase_price === null
          ? ""
          : String(item.purchase_price),
    });
    setError("");
    setNotice("");
    setShowModal(true);
  }

  function closeModal() {
    if (saving) return;
    setShowModal(false);
    setEditingInvestment(null);
    setForm(emptyForm);
  }

  async function saveInvestment() {
    setError("");
    setNotice("");

    const name = form.name.trim();
    const invested = Number(form.invested_amount);
    const current =
      form.current_value.trim() === ""
        ? null
        : Number(form.current_value);

    if (!name) {
      setError("Please enter an investment name.");
      return;
    }

    if (
      !form.invested_amount.trim() ||
      !Number.isFinite(invested) ||
      invested <= 0
    ) {
      setError("Invested amount must be greater than zero.");
      return;
    }

    if (
      current !== null &&
      (!Number.isFinite(current) || current < 0)
    ) {
      setError("Current value must be zero or greater.");
      return;
    }

    const optionalNumber = (value: string) => {
      if (!value.trim()) return null;
      const parsed = Number(value);
      return Number.isFinite(parsed) && parsed >= 0 ? parsed : NaN;
    };

    const units = optionalNumber(form.units);
    const purchasePrice = optionalNumber(form.purchase_price);

    if (
      Number.isNaN(units) ||
      Number.isNaN(purchasePrice)
    ) {
      setError("Units and purchase price cannot be negative.");
      return;
    }

    setSaving(true);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;
      if (!user) throw new Error("Please sign in again.");

      const payload = {
        name,
        investment_type: form.investment_type,
        invested_amount: invested,
        current_value: current,
        symbol: form.symbol.trim() || null,
        scheme_code: form.scheme_code.trim() || null,
        units,
        purchase_price: purchasePrice,
        valuation_source: "manual",
        // Do not claim a live market price or update timestamp.
      };

      if (editingInvestment) {
        const { data, error: updateError } = await supabase
          .from("investments")
          .update(payload)
          .eq("id", editingInvestment.id)
          .eq("user_id", user.id)
          .select("id")
          .maybeSingle();

        if (updateError) throw updateError;
        if (!data) {
          throw new Error(
            "Investment was not updated. Refresh the page and try again."
          );
        }

        setNotice("Investment updated successfully.");
      } else {
        const { error: insertError } = await supabase
          .from("investments")
          .insert({
            ...payload,
            user_id: user.id,
          });

        if (insertError) throw insertError;

        setNotice("Investment added successfully.");
      }

      setShowModal(false);
      setEditingInvestment(null);
      setForm(emptyForm);
      await fetchInvestments();
    } catch (err) {
      console.error("Failed to save investment:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Could not save the investment."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteInvestment(item: Investment) {
    const confirmed = window.confirm(
      `Delete "${item.name}" from your investments? This cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(item.id);
    setError("");
    setNotice("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;
      if (!user) throw new Error("Please sign in again.");

      const { data, error: deleteError } = await supabase
        .from("investments")
        .delete()
        .eq("id", item.id)
        .eq("user_id", user.id)
        .select("id")
        .maybeSingle();

      if (deleteError) throw deleteError;
      if (!data) {
        throw new Error(
          "Investment was not deleted. Refresh the page and try again."
        );
      }

      setInvestments((prev) => prev.filter((row) => row.id !== item.id));
      setNotice("Investment deleted successfully.");
    } catch (err) {
      console.error("Failed to delete investment:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Could not delete the investment."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#07110D] text-white">
      <div className="flex min-h-screen">
        <AppSidebar />

        <main className="min-w-0 flex-1 pb-24 lg:pb-0">
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
              <button
                type="button"
                onClick={() => router.push("/investment-discovery")}
                className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.08] px-3 py-2.5 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500/[0.14] sm:px-4 sm:text-sm"
              >
                <Search size={16} />
                <span className="hidden sm:inline">
                  Explore Investments
                </span>
                <span className="sm:hidden">Explore</span>
              </button>

              <button
                type="button"
                onClick={openAddModal}
                className="flex items-center gap-2 rounded-xl bg-emerald-500 px-3 py-2.5 text-xs font-semibold text-[#07110D] transition hover:bg-emerald-400 sm:px-4 sm:text-sm"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">Add Investment</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </header>

          <div className="mx-auto w-full max-w-[1500px] px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
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
                  onClick={() => router.push("/investment-discovery")}
                  className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-[#07110D] transition hover:bg-emerald-400"
                >
                  Explore Investments
                  <ChevronRight size={17} />
                </button>
              </div>
            </section>

            {error && !showModal && (
              <div
                role="alert"
                className="mb-5 rounded-xl border border-red-500/20 bg-red-500/[0.07] p-4 text-sm text-red-300"
              >
                {error}
                <button
                  type="button"
                  onClick={() => void fetchInvestments()}
                  className="ml-3 underline"
                >
                  Try again
                </button>
              </div>
            )}

            {notice && (
              <div
                role="status"
                className="mb-5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4 text-sm text-emerald-300"
              >
                {notice}
              </div>
            )}

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    <CircleDollarSign size={18} />
                  </div>
                  <span className="text-xs text-white/20">Portfolio</span>
                </div>
                <p className="mt-5 text-xs text-white/25">Current Value</p>
                <p className="mt-1 text-2xl font-bold">
                  {loading ? "—" : formatCurrency(currentValue)}
                </p>
                {unvaluedCount > 0 && (
                  <p className="mt-2 text-xs text-amber-300/80">
                    {unvaluedCount} holding(s) need a valuation
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] text-white/35">
                    <CircleDollarSign size={18} />
                  </div>
                  <span className="text-xs text-white/20">Principal</span>
                </div>
                <p className="mt-5 text-xs text-white/25">Total Invested</p>
                <p className="mt-1 text-2xl font-bold">
                  {loading ? "—" : formatCurrency(totalInvested)}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    {totalReturns >= 0 ? (
                      <ArrowUpRight size={18} />
                    ) : (
                      <ArrowDownRight size={18} />
                    )}
                  </div>
                  <span
                    className={`text-xs ${
                      totalReturns >= 0
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {valuedPrincipal > 0
                      ? `${returnPercentage.toFixed(1)}%`
                      : "—"}
                  </span>
                </div>
                <p className="mt-5 text-xs text-white/25">
                  Returns on valued holdings
                </p>
                <p
                  className={`mt-1 text-2xl font-bold ${
                    totalReturns >= 0
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {loading
                    ? "—"
                    : `${totalReturns >= 0 ? "+" : ""}${formatCurrency(totalReturns)}`}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] text-white/35">
                    <TrendingUp size={18} />
                  </div>
                  <span className="text-xs text-white/20">Recurring</span>
                </div>
                <p className="mt-5 text-xs text-white/25">Active SIP</p>
                <p className="mt-1 text-2xl font-bold">Not configured</p>
                <p className="mt-2 text-xs text-white/25">
                  SIP schedules are not tracked yet.
                </p>
              </div>
            </section>

            <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025]">
                <div className="border-b border-white/[0.06] p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="font-semibold">Your Investments</h2>
                      <p className="mt-1 text-xs text-white/25">
                        {loading
                          ? "Loading your holdings..."
                          : `${investments.length} investment(s) tracked`}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void fetchInvestments()}
                      disabled={loading}
                      aria-label="Refresh investments"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-white/40 transition hover:bg-white/[0.05] hover:text-emerald-400 disabled:opacity-40"
                    >
                      <RefreshCw
                        size={15}
                        className={loading ? "animate-spin" : ""}
                      />
                    </button>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_180px]">
                    <input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search investments..."
                      className="h-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 text-sm outline-none placeholder:text-white/25 focus:border-emerald-500/30"
                    />
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="h-10 rounded-xl border border-white/[0.08] bg-[#0B1712] px-3 text-sm text-white/70 outline-none"
                    >
                      <option value="all">All types</option>
                      {Object.entries(investmentTypeLabels).map(
                        ([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>

                {loading ? (
                  <div className="p-12 text-center text-sm text-white/35">
                    <RefreshCw size={20} className="mx-auto mb-3 animate-spin" />
                    Loading investments...
                  </div>
                ) : filteredInvestments.length === 0 ? (
                  <div className="p-10 text-center">
                    <CircleDollarSign
                      size={28}
                      className="mx-auto text-white/20"
                    />
                    <p className="mt-4 text-sm text-white/50">
                      {investments.length === 0
                        ? "No investments added yet"
                        : "No investments match your search"}
                    </p>
                    <p className="mt-2 text-xs text-white/25">
                      {investments.length === 0
                        ? "Add your first holding to start tracking your portfolio."
                        : "Try another name or asset type."}
                    </p>
                    {investments.length === 0 && (
                      <button
                        type="button"
                        onClick={openAddModal}
                        className="mt-5 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-[#07110D] hover:bg-emerald-400"
                      >
                        Add your first investment
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="divide-y divide-white/[0.05]">
                    {filteredInvestments.map((item) => {
                      const gain =
                        item.current_value === null
                          ? null
                          : item.current_value - item.invested_amount;

                      const gainPercentage =
                        gain !== null && item.invested_amount > 0
                          ? (gain / item.invested_amount) * 100
                          : null;

                      return (
                        <div
                          key={item.id}
                          className="flex flex-col gap-4 p-5 transition hover:bg-white/[0.015] sm:p-6"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                                <TrendingUp size={19} />
                              </div>
                              <div className="min-w-0">
                                <p className="break-words text-sm font-medium text-white/85">
                                  {item.name}
                                </p>
                                <p className="mt-1 text-xs text-white/30">
                                  {investmentTypeLabels[item.investment_type]}
                                  {" · "}
                                  {getCategory(item.investment_type)}
                                </p>
                                {item.symbol && (
                                  <p className="mt-1 text-xs text-white/25">
                                    Symbol: {item.symbol}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex shrink-0 items-center gap-1">
                              <button
                                type="button"
                                onClick={() => openEditModal(item)}
                                aria-label={`Edit ${item.name}`}
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] text-white/40 transition hover:bg-white/[0.05] hover:text-emerald-400"
                              >
                                <Pencil size={15} />
                              </button>
                              <button
                                type="button"
                                onClick={() => void deleteInvestment(item)}
                                disabled={deletingId === item.id}
                                aria-label={`Delete ${item.name}`}
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] text-white/40 transition hover:border-red-500/20 hover:bg-red-500/[0.06] hover:text-red-400 disabled:opacity-40"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                            <div>
                              <p className="text-xs text-white/30">Invested</p>
                              <p className="mt-1 text-sm font-medium">
                                {formatCurrency(item.invested_amount)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-white/30">
                                Current value
                              </p>
                              <p className="mt-1 text-sm font-semibold">
                                {item.current_value === null
                                  ? "Not entered"
                                  : formatCurrency(item.current_value)}
                              </p>
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                              <p className="text-xs text-white/30">
                                Gain / loss
                              </p>
                              {gain === null ? (
                                <p className="mt-1 text-sm text-white/40">
                                  Not available
                                </p>
                              ) : (
                                <p
                                  className={`mt-1 flex items-center gap-1 text-sm font-medium ${
                                    gain >= 0
                                      ? "text-emerald-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  {gain >= 0 ? (
                                    <ArrowUpRight size={14} />
                                  ) : (
                                    <ArrowDownRight size={14} />
                                  )}
                                  {gain >= 0 ? "+" : ""}
                                  {formatCurrency(gain)}
                                  <span className="text-xs">
                                    ({gainPercentage?.toFixed(1)}%)
                                  </span>
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.05] pt-3">
                            <span className="text-[11px] text-white/30">
                              {getValuationSourceLabel(item.valuation_source)}
                            </span>
                            {item.price_as_of && (
                              <span className="text-[11px] text-white/30">
                                Price timestamp: {formatDate(item.price_as_of)}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => router.push("/fund-details")}
                              className="flex items-center gap-1 text-xs text-emerald-400 transition hover:text-emerald-300"
                            >
                              Details <ChevronRight size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
                  <h2 className="font-semibold">Portfolio Allocation</h2>
                  <p className="mt-1 text-xs text-white/25">
                    Based on entered current values.
                  </p>

                  {allocation.length === 0 ? (
                    <p className="mt-6 text-sm text-white/35">
                      Add current valuations to see your allocation.
                    </p>
                  ) : (
                    <div className="mt-6 space-y-5">
                      {allocation.map((item) => (
                        <div key={item.name}>
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-sm text-white/45">
                              {item.name}
                            </span>
                            <span className="text-right text-xs text-white/40">
                              {item.percentage.toFixed(1)}% ·{" "}
                              {formatCurrency(item.amount)}
                            </span>
                          </div>
                          <div className="mt-2 h-1.5 rounded-full bg-white/[0.06]">
                            <div
                              className="h-full rounded-full bg-emerald-500 transition-all"
                              style={{
                                width: `${Math.min(item.percentage, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.035] p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-emerald-400">
                        Monthly SIP
                      </p>
                      <p className="mt-2 text-2xl font-bold">
                        Not configured
                      </p>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                      <TrendingUp size={20} />
                    </div>
                  </div>
                  <p className="mt-4 text-xs leading-5 text-white/30">
                    Use the calculator to explore illustrative outcomes.
                    A real recurring SIP schedule is not stored yet.
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

                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] text-white/40">
                    <Search size={18} />
                  </div>
                  <h2 className="mt-4 font-semibold">
                    Discover Investments
                  </h2>
                  <p className="mt-2 text-xs leading-5 text-white/25">
                    Explore categories and compare illustrative scenarios
                    based on your amount, time horizon and risk preference.
                  </p>
                  <button
                    type="button"
                    onClick={() => router.push("/investment-discovery")}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-[#07110D] transition hover:bg-emerald-400"
                  >
                    Explore Investments
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </section>

            <section className="mt-6 rounded-2xl border border-white/[0.05] bg-white/[0.015] p-4">
              <div className="flex gap-3">
                <CircleDollarSign
                  size={17}
                  className="mt-0.5 shrink-0 text-white/20"
                />
                <p className="text-[11px] leading-5 text-white/30">
                  Portfolio values are based on information entered in
                  Wealthly. They are not live market prices. Update current
                  values manually until a verified market-data provider is
                  connected. Returns shown are simple gain/loss estimates,
                  not annualised returns.
                </p>
              </div>
            </section>
          </div>
        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 px-4 py-6 backdrop-blur-sm">
          <div className="my-auto w-full max-w-lg rounded-3xl border border-white/[0.08] bg-[#0B1712] p-6 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">
                  {editingInvestment ? "Edit Investment" : "Add Investment"}
                </h2>
                <p className="mt-1 text-xs text-white/30">
                  {editingInvestment
                    ? "Update your saved holding."
                    : "Add a holding to your portfolio."}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                aria-label="Close modal"
                className="text-white/35 transition hover:text-white disabled:opacity-40"
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div
                role="alert"
                className="mt-5 rounded-xl border border-red-500/20 bg-red-500/[0.07] p-3 text-sm text-red-300"
              >
                {error}
              </div>
            )}

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-xs text-white/45">
                  Investment Name *
                </label>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g. Nifty 50 Index Fund"
                  maxLength={150}
                  className="mt-2 h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 text-sm outline-none placeholder:text-white/20 focus:border-emerald-500/30"
                />
              </div>

              <div>
                <label className="text-xs text-white/45">
                  Investment Type *
                </label>
                <select
                  value={form.investment_type}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      investment_type: e.target.value as InvestmentType,
                    }))
                  }
                  className="mt-2 h-11 w-full rounded-xl border border-white/[0.08] bg-[#0B1712] px-3 text-sm text-white outline-none"
                >
                  {Object.entries(investmentTypeLabels).map(
                    ([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs text-white/45">
                    Total Invested (₹) *
                  </label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={form.invested_amount}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        invested_amount: e.target.value,
                      }))
                    }
                    placeholder="25000"
                    className="mt-2 h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 text-sm outline-none placeholder:text-white/20 focus:border-emerald-500/30"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/45">
                    Current Value (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.current_value}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        current_value: e.target.value,
                      }))
                    }
                    placeholder="Leave blank if unknown"
                    className="mt-2 h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 text-sm outline-none placeholder:text-white/20 focus:border-emerald-500/30"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-4">
                <p className="text-xs font-medium text-white/50">
                  Optional market identifiers
                </p>
                <p className="mt-1 text-xs leading-5 text-white/25">
                  For future price integration. These fields do not fetch
                  market data by themselves.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs text-white/40">
                      Symbol
                    </label>
                    <input
                      value={form.symbol}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          symbol: e.target.value,
                        }))
                      }
                      placeholder="e.g. RELIANCE"
                      maxLength={50}
                      className="mt-2 h-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 text-sm outline-none placeholder:text-white/20 focus:border-emerald-500/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40">
                      Scheme Code
                    </label>
                    <input
                      value={form.scheme_code}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          scheme_code: e.target.value,
                        }))
                      }
                      placeholder="Mutual fund code"
                      maxLength={50}
                      className="mt-2 h-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 text-sm outline-none placeholder:text-white/20 focus:border-emerald-500/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40">
                      Units / Shares
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.000001"
                      value={form.units}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          units: e.target.value,
                        }))
                      }
                      placeholder="e.g. 12.5"
                      className="mt-2 h-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 text-sm outline-none placeholder:text-white/20 focus:border-emerald-500/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40">
                      Purchase Price / Unit (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.0001"
                      value={form.purchase_price}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          purchase_price: e.target.value,
                        }))
                      }
                      placeholder="Optional"
                      className="mt-2 h-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 text-sm outline-none placeholder:text-white/20 focus:border-emerald-500/30"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.025] py-3 text-sm text-white/55 transition hover:text-white disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void saveInvestment()}
                disabled={saving}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-[#07110D] transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving && <RefreshCw size={15} className="animate-spin" />}
                {saving
                  ? "Saving..."
                  : editingInvestment
                    ? "Save Changes"
                    : "Add Investment"}
              </button>
            </div>
          </div>
        </div>
      )}

      <MobileNav />
    </div>
  );
}
