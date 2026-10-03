"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  CreditCard,
  Plus,
  RefreshCw,
  Trash2,
  Tv,
  Music2,
  Cloud,
  Gamepad2,
  Smartphone,
  Wallet
} from "lucide-react";

import AppSidebar from "@/components/ui/app-sidebar";
import MobileNav from "@/components/ui/mobile-nav";

type Subscription = {
  id: number;
  name: string;
  category: string;
  amount: number;
  billing: "Monthly" | "Yearly";
  nextDate: string;
  icon: "music" | "tv" | "cloud" | "gaming" | "mobile";
};

const initialSubscriptions: Subscription[] = [
  {
    id: 1,
    name: "Spotify Premium",
    category: "Music",
    amount: 140,
    billing: "Monthly",
    nextDate: "Oct 14, 2026",
    icon: "music",
  },
  {
    id: 2,
    name: "Netflix",
    category: "Entertainment",
    amount: 649,
    billing: "Monthly",
    nextDate: "Oct 18, 2026",
    icon: "tv",
  },
  {
    id: 3,
    name: "Google One",
    category: "Cloud Storage",
    amount: 130,
    billing: "Monthly",
    nextDate: "Oct 22, 2026",
    icon: "cloud",
  },
  {
    id: 4,
    name: "PlayStation Plus",
    category: "Gaming",
    amount: 749,
    billing: "Yearly",
    nextDate: "Dec 12, 2026",
    icon: "gaming",
  },
  {
    id: 5,
    name: "Jio Recharge",
    category: "Mobile",
    amount: 350,
    billing: "Monthly",
    nextDate: "Oct 29, 2026",
    icon: "mobile",
  },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

function getMonthlyAmount(subscription: Subscription) {
  if (subscription.billing === "Yearly") {
    return subscription.amount / 12;
  }

  return subscription.amount;
}

function SubscriptionIcon({
  type,
}: {
  type: Subscription["icon"];
}) {
  const common = 19;

  if (type === "music") {
    return <Music2 size={common} />;
  }

  if (type === "tv") {
    return <Tv size={common} />;
  }

  if (type === "cloud") {
    return <Cloud size={common} />;
  }

  if (type === "gaming") {
    return <Gamepad2 size={common} />;
  }

  return <Smartphone size={common} />;
}

export default function SubscriptionsPage() {
  const router = useRouter();

  const [subscriptions, setSubscriptions] = useState<
    Subscription[]
  >(initialSubscriptions);

  const [showAddModal, setShowAddModal] = useState(false);

  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] =
    useState("Entertainment");
  const [newAmount, setNewAmount] = useState("");
  const [newBilling, setNewBilling] =
    useState<"Monthly" | "Yearly">("Monthly");
  const [newDate, setNewDate] = useState("");

  const monthlyTotal = subscriptions.reduce(
    (sum, subscription) =>
      sum + getMonthlyAmount(subscription),
    0
  );

  const yearlyTotal = subscriptions.reduce(
    (sum, subscription) =>
      sum +
      (subscription.billing === "Yearly"
        ? subscription.amount
        : subscription.amount * 12),
    0
  );

  const upcoming = [...subscriptions].slice(0, 3);

  function addSubscription() {
    if (!newName || !newAmount || !newDate) return;

    const newSubscription: Subscription = {
      id: Date.now(),
      name: newName,
      category: newCategory,
      amount: Number(newAmount),
      billing: newBilling,
      nextDate: newDate,
      icon:
        newCategory === "Music"
          ? "music"
          : newCategory === "Gaming"
          ? "gaming"
          : newCategory === "Cloud Storage"
          ? "cloud"
          : newCategory === "Mobile"
          ? "mobile"
          : "tv",
    };

    setSubscriptions((prev) => [
      ...prev,
      newSubscription,
    ]);

    setNewName("");
    setNewCategory("Entertainment");
    setNewAmount("");
    setNewBilling("Monthly");
    setNewDate("");
    setShowAddModal(false);
  }

  function deleteSubscription(id: number) {
    setSubscriptions((prev) =>
      prev.filter((subscription) => subscription.id !== id)
    );
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
                Recurring Expenses
              </p>

              <h1 className="mt-1 text-xl font-semibold sm:text-2xl">
                Subscriptions
              </h1>
            </div>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-3 py-2.5 text-xs font-semibold text-[#07110D] transition hover:bg-emerald-400 sm:px-4 sm:text-sm"
            >
              <Plus size={16} />

              <span className="hidden sm:inline">
                Add Subscription
              </span>

              <span className="sm:hidden">Add</span>
            </button>
          </header>

          <div className="mx-auto w-full max-w-[1500px] px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
            {/* Overview */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <RefreshCw size={18} />
                </div>

                <p className="mt-5 text-xs text-white/25">
                  Active Subscriptions
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {subscriptions.length}
                </p>

                <p className="mt-2 text-[11px] text-white/20">
                  Currently being tracked
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <CreditCard size={18} />
                </div>

                <p className="mt-5 text-xs text-white/25">
                  Monthly Cost
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {formatCurrency(monthlyTotal)}
                </p>

                <p className="mt-2 text-[11px] text-white/20">
                  Average recurring monthly cost
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] text-white/40">
                  <CalendarDays size={18} />
                </div>

                <p className="mt-5 text-xs text-white/25">
                  Annual Cost
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {formatCurrency(yearlyTotal)}
                </p>

                <p className="mt-2 text-[11px] text-white/20">
                  Estimated recurring cost
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.035] p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <ArrowUpRight size={18} />
                </div>

                <p className="mt-5 text-xs text-white/25">
                  Biggest Subscription
                </p>

                <p className="mt-1 text-2xl font-bold">
                  Netflix
                </p>

                <p className="mt-2 text-[11px] text-emerald-400">
                  ₹649 / month
                </p>
              </div>
            </section>

            {/* Main */}
            <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_350px]">
              {/* Subscription List */}
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025]">
                <div className="flex items-center justify-between border-b border-white/[0.06] p-5 sm:p-6">
                  <div>
                    <h2 className="font-semibold">
                      Your Subscriptions
                    </h2>

                    <p className="mt-1 text-xs text-white/25">
                      Track recurring payments in one place.
                    </p>
                  </div>

                  <span className="rounded-lg bg-white/[0.04] px-2.5 py-1.5 text-[10px] text-white/30">
                    {subscriptions.length} Active
                  </span>
                </div>

                <div className="divide-y divide-white/[0.05]">
                  {subscriptions.length === 0 ? (
                    <div className="p-10 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04] text-white/20">
                        <CreditCard size={21} />
                      </div>

                      <p className="mt-4 text-sm text-white/50">
                        No subscriptions yet
                      </p>

                      <p className="mt-1 text-xs text-white/20">
                        Add your first recurring payment.
                      </p>
                    </div>
                  ) : (
                    subscriptions.map((subscription) => (
                      <div
                        key={subscription.id}
                        className="flex flex-col gap-4 p-5 transition hover:bg-white/[0.015] sm:flex-row sm:items-center sm:justify-between sm:p-6"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                            <SubscriptionIcon
                              type={subscription.icon}
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-white/85">
                              {subscription.name}
                            </p>

                            <div className="mt-1 flex items-center gap-2">
                              <span className="text-xs text-white/25">
                                {subscription.category}
                              </span>

                              <span className="h-1 w-1 rounded-full bg-white/15" />

                              <span className="text-xs text-white/20">
                                {subscription.billing}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-5 sm:justify-end">
                          <div className="text-left sm:text-right">
                            <p className="text-sm font-semibold">
                              {formatCurrency(
                                subscription.amount
                              )}
                            </p>

                            <p className="mt-1 flex items-center gap-1 text-xs text-white/25 sm:justify-end">
                              <CalendarDays size={12} />
                              {subscription.nextDate}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              deleteSubscription(
                                subscription.id
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] text-white/20 transition hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400"
                            aria-label={`Delete ${subscription.name}`}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Upcoming */}
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-semibold">
                        Upcoming Payments
                      </h2>

                      <p className="mt-1 text-xs text-white/25">
                        Your next recurring charges.
                      </p>
                    </div>

                    <CalendarDays
                      size={18}
                      className="text-white/25"
                    />
                  </div>

                  <div className="mt-5 space-y-3">
                    {upcoming.map((subscription) => (
                      <div
                        key={subscription.id}
                        className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-white/35">
                            <SubscriptionIcon
                              type={subscription.icon}
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-xs font-medium text-white/65">
                              {subscription.name}
                            </p>

                            <p className="mt-1 text-[10px] text-white/20">
                              {subscription.nextDate}
                            </p>
                          </div>
                        </div>

                        <p className="ml-3 text-xs font-medium text-white/55">
                          {formatCurrency(
                            subscription.amount
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Monthly Cost */}
                <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.035] p-5 sm:p-6">
                  <p className="text-xs uppercase tracking-[0.18em] text-emerald-400">
                    Recurring Cost
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {formatCurrency(monthlyTotal)}
                  </p>

                  <p className="mt-3 text-xs leading-5 text-white/30">
                    This is the estimated monthly amount committed
                    to your currently tracked subscriptions.
                  </p>

                  <div className="mt-5 h-px bg-white/[0.06]" />

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-white/25">
                      Estimated yearly
                    </span>

                    <span className="text-sm font-semibold text-white/65">
                      {formatCurrency(yearlyTotal)}
                    </span>
                  </div>
                </div>

                {/* Budget Link */}
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] text-white/40">
                    <WalletIcon />
                  </div>

                  <h2 className="mt-4 font-semibold">
                    Keep recurring costs under control
                  </h2>

                  <p className="mt-2 text-xs leading-5 text-white/25">
                    Review your subscriptions alongside your monthly
                    budget and spending.
                  </p>

                  <button
                    type="button"
                    onClick={() => router.push("/budget")}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] py-3 text-sm font-medium text-white/50 transition hover:bg-white/[0.05] hover:text-white"
                  >
                    Open Budget
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </section>

            {/* Info */}
            <section className="mt-6 rounded-2xl border border-white/[0.05] bg-white/[0.015] p-4">
              <div className="flex gap-3">
                <RefreshCw
                  size={16}
                  className="mt-0.5 shrink-0 text-white/20"
                />

                <p className="text-[11px] leading-5 text-white/20">
                  Subscription data is currently stored locally in
                  this prototype. Later, subscriptions will be
                  connected to Wealthly&apos;s backend so recurring
                  payments, reminders and transaction history can
                  be synced automatically.
                </p>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Add Subscription Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/[0.08] bg-[#0B1712] p-6 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  Add Subscription
                </h2>

                <p className="mt-1 text-xs text-white/25">
                  Track a recurring payment.
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
              {/* Name */}
              <div>
                <label className="text-xs text-white/35">
                  Subscription Name
                </label>

                <input
                  value={newName}
                  onChange={(e) =>
                    setNewName(e.target.value)
                  }
                  placeholder="e.g. Spotify Premium"
                  className="mt-2 h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 text-sm outline-none placeholder:text-white/15 focus:border-emerald-500/30"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-xs text-white/35">
                  Category
                </label>

                <select
                  value={newCategory}
                  onChange={(e) =>
                    setNewCategory(e.target.value)
                  }
                  className="mt-2 h-11 w-full rounded-xl border border-white/[0.08] bg-[#0B1712] px-3 text-sm text-white outline-none focus:border-emerald-500/30"
                >
                  <option>Entertainment</option>
                  <option>Music</option>
                  <option>Gaming</option>
                  <option>Cloud Storage</option>
                  <option>Mobile</option>
                  <option>Education</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Amount + Billing */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white/35">
                    Amount
                  </label>

                  <input
                    type="number"
                    value={newAmount}
                    onChange={(e) =>
                      setNewAmount(e.target.value)
                    }
                    placeholder="₹"
                    className="mt-2 h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 text-sm outline-none placeholder:text-white/15 focus:border-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/35">
                    Billing
                  </label>

                  <select
                    value={newBilling}
                    onChange={(e) =>
                      setNewBilling(
                        e.target.value as
                          | "Monthly"
                          | "Yearly"
                      )
                    }
                    className="mt-2 h-11 w-full rounded-xl border border-white/[0.08] bg-[#0B1712] px-3 text-sm text-white outline-none focus:border-emerald-500/30"
                  >
                    <option>Monthly</option>
                    <option>Yearly</option>
                  </select>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="text-xs text-white/35">
                  Next Payment
                </label>

                <input
                  type="text"
                  value={newDate}
                  onChange={(e) =>
                    setNewDate(e.target.value)
                  }
                  placeholder="e.g. Oct 25, 2026"
                  className="mt-2 h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 text-sm outline-none placeholder:text-white/15 focus:border-emerald-500/30"
                />
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
                onClick={addSubscription}
                className="flex-1 rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-[#07110D] transition hover:bg-emerald-400"
              >
                Add Subscription
              </button>
            </div>
          </div>
        </div>
      )}

      <MobileNav />
    </div>
  );
}

/*
  Small reusable icon wrapper for the Budget card.
*/
function WalletIcon() {
  return (
    <Wallet size={18} />
  );
}