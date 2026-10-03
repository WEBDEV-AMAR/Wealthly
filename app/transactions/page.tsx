"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  Search,
  Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";

import AppSidebar from "@/components/ui/app-sidebar";
import MobileNav from "@/components/ui/mobile-nav";

const transactionData = [
  {
    id: 1,
    name: "Salary",
    category: "Income",
    date: "30 Sep 2026",
    amount: 25000,
    type: "income",
  },
  {
    id: 2,
    name: "Rent",
    category: "Housing",
    date: "29 Sep 2026",
    amount: 7000,
    type: "expense",
  },
  {
    id: 3,
    name: "Grocery Shopping",
    category: "Food",
    date: "28 Sep 2026",
    amount: 1450,
    type: "expense",
  },
  {
    id: 4,
    name: "Spotify",
    category: "Subscription",
    date: "27 Sep 2026",
    amount: 140,
    type: "expense",
  },
  {
    id: 5,
    name: "Travel",
    category: "Transport",
    date: "25 Sep 2026",
    amount: 850,
    type: "expense",
  },
  {
    id: 6,
    name: "Shopping",
    category: "Shopping",
    date: "23 Sep 2026",
    amount: 2100,
    type: "expense",
  },
  {
    id: 7,
    name: "Freelance",
    category: "Income",
    date: "21 Sep 2026",
    amount: 4500,
    type: "income",
  },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function TransactionsPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const income = transactionData
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);

  const expense = transactionData
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);

  const filteredTransactions = useMemo(() => {
    return transactionData.filter((transaction) => {
      const matchesFilter =
        filter === "All" ||
        (filter === "Income" && transaction.type === "income") ||
        (filter === "Expense" && transaction.type === "expense");

      const matchesSearch =
        transaction.name.toLowerCase().includes(search.toLowerCase()) ||
        transaction.category.toLowerCase().includes(search.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [filter, search]);

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

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/25">
                Activity
              </p>

              <h1 className="mt-1 text-xl font-semibold sm:text-2xl">
                Transactions
              </h1>
            </div>
          </header>

          <div className="mx-auto w-full max-w-[1400px] px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
            {/* Summary */}
            <section className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <p className="text-sm text-white/35">Total Transactions</p>
                <p className="mt-3 text-2xl font-bold">
                  {transactionData.length}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <p className="text-sm text-white/35">Income</p>
                <p className="mt-3 text-2xl font-bold text-emerald-400">
                  +{formatCurrency(income)}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <p className="text-sm text-white/35">Expenses</p>
                <p className="mt-3 text-2xl font-bold">
                  {formatCurrency(expense)}
                </p>
              </div>
            </section>

            {/* Transactions */}
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
                      onChange={(e) => setSearch(e.target.value)}
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
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between gap-4 px-5 py-5 sm:px-6"
                  >
                    <div className="flex min-w-0 items-center gap-4">
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
                          {transaction.category} • {transaction.date}
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
                  </div>
                ))}

                {filteredTransactions.length === 0 && (
                  <div className="px-6 py-14 text-center">
                    <Wallet
                      size={24}
                      className="mx-auto text-white/20"
                    />

                    <p className="mt-4 text-sm text-white/50">
                      No transactions found
                    </p>
                  </div>
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