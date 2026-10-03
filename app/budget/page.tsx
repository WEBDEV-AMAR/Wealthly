"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ChevronRight,
  Plus,
  Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";

import AppSidebar from "@/components/ui/app-sidebar";
import MobileNav from "@/components/ui/mobile-nav";

const initialCategories = [
  {
    name: "Food",
    budget: 6000,
    spent: 5200,
  },
  {
    name: "Shopping",
    budget: 3500,
    spent: 2400,
  },
  {
    name: "Travel",
    budget: 3500,
    spent: 2850,
  },
  {
    name: "Entertainment",
    budget: 2000,
    spent: 1450,
  },
  {
    name: "Bills",
    budget: 5000,
    spent: 4100,
  },
  {
    name: "Other",
    budget: 5000,
    spent: 2640,
  },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function BudgetPage() {
  const router = useRouter();

  const [categories, setCategories] = useState(initialCategories);
  const [showModal, setShowModal] = useState(false);

  const [newBudget, setNewBudget] = useState({
    name: "",
    amount: "",
  });

  const totalBudget = categories.reduce(
    (sum, category) => sum + category.budget,
    0
  );

  const totalSpent = categories.reduce(
    (sum, category) => sum + category.spent,
    0
  );

  const remaining = totalBudget - totalSpent;

  const percentage = (totalSpent / totalBudget) * 100;

  const handleAddBudget = () => {
    const amount = Number(newBudget.amount);

    if (!newBudget.name.trim() || !amount || amount <= 0) {
      return;
    }

    setCategories((prev) => [
      ...prev,
      {
        name: newBudget.name.trim(),
        budget: amount,
        spent: 0,
      },
    ]);

    setNewBudget({
      name: "",
      amount: "",
    });

    setShowModal(false);
  };

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
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-[#07110D] hover:bg-emerald-400"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Add Budget</span>
              <span className="sm:hidden">Add</span>
            </button>
          </header>

          <div className="mx-auto w-full max-w-[1400px] px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
            {/* Main Budget */}
            <section className="rounded-3xl border border-emerald-500/10 bg-emerald-500/[0.035] p-6 sm:p-8">
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div>
                  <p className="text-sm text-white/35">
                    September 2026 Budget
                  </p>

                  <p className="mt-3 text-4xl font-bold tracking-tight">
                    {formatCurrency(totalBudget)}
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
                    className="h-full rounded-full bg-emerald-500"
                    style={{
                      width: `${Math.min(percentage, 100)}%`,
                    }}
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
                {categories.map((category) => {
                  const progress =
                    category.budget > 0
                      ? (category.spent / category.budget) * 100
                      : 0;

                  const overBudget = progress > 100;

                  return (
                    <div
                      key={category.name}
                      className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">
                            {category.name}
                          </p>

                          <p className="mt-1 text-xs text-white/25">
                            {formatCurrency(category.spent)} spent
                          </p>
                        </div>

                        <span
                          className={`text-xs font-medium ${
                            overBudget
                              ? "text-red-400"
                              : "text-emerald-400"
                          }`}
                        >
                          {Math.round(progress)}%
                        </span>
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
                        <span className="text-white/25">
                          Spent
                        </span>

                        <span className="text-white/50">
                          {formatCurrency(category.budget)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Tip */}
            <section className="mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">
                    Budget Insight
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-white/30">
                    You have used {percentage.toFixed(1)}% of your
                    monthly budget. Keep an eye on your larger spending
                    categories as the month progresses.
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
              Create a new monthly spending category.
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-xs text-white/45">
                  Category
                </label>

                <input
                  value={newBudget.name}
                  onChange={(e) =>
                    setNewBudget((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="e.g. Fitness"
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
                  onChange={(e) =>
                    setNewBudget((prev) => ({
                      ...prev,
                      amount: e.target.value,
                    }))
                  }
                  placeholder="₹ 2,000"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm outline-none placeholder:text-white/20 focus:border-emerald-500/40"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="h-12 flex-1 rounded-xl border border-white/10 bg-white/[0.03] text-sm text-white/60"
                >
                  Cancel
                </button>

                <button
                  onClick={handleAddBudget}
                  className="h-12 flex-1 rounded-xl bg-emerald-500 text-sm font-semibold text-[#07110D] hover:bg-emerald-400"
                >
                  Add Budget
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}