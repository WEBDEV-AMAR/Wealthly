"use client";

import { useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Plus,
  Target,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

import AppSidebar from "@/components/ui/app-sidebar";
import MobileNav from "@/components/ui/mobile-nav";

type Goal = {
  id: number;
  name: string;
  current: number;
  target: number;
  targetDate: string;
};

const initialGoals: Goal[] = [
  {
    id: 1,
    name: "Emergency Fund",
    current: 18000,
    target: 50000,
    targetDate: "Dec 2026",
  },
  {
    id: 2,
    name: "New Laptop",
    current: 32000,
    target: 60000,
    targetDate: "Jan 2027",
  },
  {
    id: 3,
    name: "Kerala Trip",
    current: 12000,
    target: 30000,
    targetDate: "Jan 2027",
  },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function GoalsPage() {
  const router = useRouter();

  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [showModal, setShowModal] = useState(false);

  const [newGoal, setNewGoal] = useState({
    name: "",
    target: "",
    date: "",
  });

  const totalSaved = goals.reduce(
    (sum, goal) => sum + goal.current,
    0
  );

  const totalTarget = goals.reduce(
    (sum, goal) => sum + goal.target,
    0
  );

  const overallProgress =
    totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  const handleAddGoal = () => {
    const target = Number(newGoal.target);

    if (!newGoal.name.trim() || !target || target <= 0) {
      return;
    }

    setGoals((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: newGoal.name.trim(),
        current: 0,
        target,
        targetDate: newGoal.date || "Not set",
      },
    ]);

    setNewGoal({
      name: "",
      target: "",
      date: "",
    });

    setShowModal(false);
  };

  const handleDeleteGoal = (id: number) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id));
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
                Savings Goals
              </h1>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-[#07110D] hover:bg-emerald-400"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Add Goal</span>
              <span className="sm:hidden">Add</span>
            </button>
          </header>

          <div className="mx-auto w-full max-w-[1400px] px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
            {/* Overview */}
            <section className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <p className="text-sm text-white/35">Total Saved</p>

                <p className="mt-3 text-2xl font-bold">
                  {formatCurrency(totalSaved)}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <p className="text-sm text-white/35">Total Target</p>

                <p className="mt-3 text-2xl font-bold">
                  {formatCurrency(totalTarget)}
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.035] p-5">
                <p className="text-sm text-white/35">
                  Overall Progress
                </p>

                <p className="mt-3 text-2xl font-bold text-emerald-400">
                  {overallProgress.toFixed(1)}%
                </p>
              </div>
            </section>

            {/* Overall Progress */}
            <section className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
              <div className="flex justify-between">
                <div>
                  <h2 className="font-semibold">
                    Your Savings Journey
                  </h2>

                  <p className="mt-1 text-xs text-white/25">
                    Keep building toward your goals
                  </p>
                </div>

                <Target className="text-emerald-400" size={22} />
              </div>

              <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{
                    width: `${Math.min(overallProgress, 100)}%`,
                  }}
                />
              </div>

              <div className="mt-2 flex justify-between text-xs">
                <span className="text-white/25">
                  {formatCurrency(totalSaved)} saved
                </span>

                <span className="text-white/35">
                  {formatCurrency(totalTarget)}
                </span>
              </div>
            </section>

            {/* Goal Cards */}
            <section className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {goals.map((goal) => {
                const progress =
                  goal.target > 0
                    ? (goal.current / goal.target) * 100
                    : 0;

                return (
                  <div
                    key={goal.id}
                    className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                        <Target size={20} />
                      </div>

                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-white/20 transition hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>

                    <h2 className="mt-5 font-semibold">
                      {goal.name}
                    </h2>

                    <p className="mt-2 text-2xl font-bold">
                      {formatCurrency(goal.current)}
                    </p>

                    <p className="mt-1 text-xs text-white/25">
                      of {formatCurrency(goal.target)}
                    </p>

                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{
                          width: `${Math.min(progress, 100)}%`,
                        }}
                      />
                    </div>

                    <div className="mt-2 flex justify-between text-xs">
                      <span className="text-emerald-400">
                        {Math.round(progress)}%
                      </span>

                      <span className="flex items-center gap-1 text-white/25">
                        <CalendarDays size={13} />
                        {goal.targetDate}
                      </span>
                    </div>

                    <button className="mt-5 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] py-3 text-sm font-medium text-white/50 transition hover:bg-white/[0.05] hover:text-white">
                      Add Contribution
                    </button>
                  </div>
                );
              })}

              {goals.length === 0 && (
                <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center md:col-span-2 xl:col-span-3">
                  <Target
                    size={26}
                    className="mx-auto text-white/20"
                  />

                  <p className="mt-4 text-sm text-white/45">
                    No savings goals yet
                  </p>

                  <button
                    onClick={() => setShowModal(true)}
                    className="mt-4 text-sm text-emerald-400"
                  >
                    Create your first goal
                  </button>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>

      <MobileNav />

      {/* Add Goal Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0B1712] p-6 shadow-2xl sm:p-7">
            <h2 className="text-xl font-semibold">Create Goal</h2>

            <p className="mt-1 text-sm text-white/30">
              Set a target and start tracking your progress.
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-xs text-white/45">
                  Goal Name
                </label>

                <input
                  value={newGoal.name}
                  onChange={(e) =>
                    setNewGoal((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="e.g. New Phone"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm outline-none placeholder:text-white/20 focus:border-emerald-500/40"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs text-white/45">
                  Target Amount
                </label>

                <input
                  type="number"
                  min="1"
                  value={newGoal.target}
                  onChange={(e) =>
                    setNewGoal((prev) => ({
                      ...prev,
                      target: e.target.value,
                    }))
                  }
                  placeholder="₹ 50,000"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm outline-none placeholder:text-white/20 focus:border-emerald-500/40"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs text-white/45">
                  Target Date
                </label>

                <input
                  type="text"
                  value={newGoal.date}
                  onChange={(e) =>
                    setNewGoal((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                  placeholder="e.g. June 2027"
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
                  onClick={handleAddGoal}
                  className="h-12 flex-1 rounded-xl bg-emerald-500 text-sm font-semibold text-[#07110D] hover:bg-emerald-400"
                >
                  Create Goal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}