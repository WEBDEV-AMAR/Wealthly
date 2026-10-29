
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Plus,
  Target,
  Trash2,
  Pencil,
  LoaderCircle,
  X,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";

import AppSidebar from "@/components/ui/app-sidebar";
import MobileNav from "@/components/ui/mobile-nav";
import { supabase } from "@/lib/supabase";

type Goal = {
  id: string;
  name: string;
  current: number;
  target: number;
  targetDate: string;
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (date: string) => {
  if (!date) return "Not set";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });
};

export default function GoalsPage() {
  const router = useRouter();

  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const [showContributionModal, setShowContributionModal] =
    useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [contribution, setContribution] = useState("");

  const [form, setForm] = useState({
    name: "",
    target: "",
    current: "0",
    date: "",
  });

  const fetchGoals = useCallback(async () => {
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

      const { data, error: fetchError } = await supabase
        .from("goals")
        .select(
          "id, name, current_amount, target_amount, target_date"
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      setGoals(
        (data ?? []).map((item) => ({
          id: item.id,
          name: item.name,
          current: Number(item.current_amount ?? 0),
          target: Number(item.target_amount),
          targetDate: item.target_date ?? "",
        }))
      );
    } catch (err) {
      console.error("Fetch goals error:", err);
      setError(
        err instanceof Error ? err.message : "Could not load your goals."
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void fetchGoals();
  }, [fetchGoals]);

  const totalSaved = goals.reduce((sum, goal) => sum + goal.current, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0);
  const overallProgress =
    totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  const resetForm = () => {
    setForm({ name: "", target: "", current: "0", date: "" });
    setEditingGoal(null);
  };

  const openAddModal = () => {
    resetForm();
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const openEditModal = (goal: Goal) => {
    setEditingGoal(goal);
    setForm({
      name: goal.name,
      target: String(goal.target),
      current: String(goal.current),
      date: goal.targetDate,
    });
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const handleSaveGoal = async () => {
    const name = form.name.trim();
    const target = Number(form.target);
    const current = Number(form.current);

    if (!name || !Number.isFinite(target) || target <= 0) {
      setError("Enter a goal name and a valid target amount.");
      return;
    }

    if (
      !Number.isFinite(current) ||
      current < 0 ||
      current > target
    ) {
      setError("Current savings must be between ₹0 and your target.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;
      if (!user) throw new Error("Please sign in again.");

      const payload = {
        user_id: user.id,
        name,
        target_amount: target,
        current_amount: current,
        target_date: form.date || null,
        updated_at: new Date().toISOString(),
      };

      if (editingGoal) {
        const { error: updateError } = await supabase
          .from("goals")
          .update(payload)
          .eq("id", editingGoal.id)
          .eq("user_id", user.id);

        if (updateError) throw updateError;
        setSuccess("Goal updated successfully!");
      } else {
        const { error: insertError } = await supabase
          .from("goals")
          .insert(payload);

        if (insertError) throw insertError;
        setSuccess("Goal created successfully!");
      }

      setShowModal(false);
      resetForm();
      await fetchGoals();
    } catch (err) {
      console.error("Save goal error:", err);
      setError(
        err instanceof Error ? err.message : "Could not save the goal."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGoal = async (goal: Goal) => {
    const confirmed = window.confirm(
      `Delete "${goal.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;
      if (!user) throw new Error("Please sign in again.");

      const { error: deleteError } = await supabase
        .from("goals")
        .delete()
        .eq("id", goal.id)
        .eq("user_id", user.id);

      if (deleteError) throw deleteError;

      setGoals((prev) => prev.filter((item) => item.id !== goal.id));
      setSuccess("Goal deleted successfully.");
    } catch (err) {
      console.error("Delete goal error:", err);
      setError(
        err instanceof Error ? err.message : "Could not delete the goal."
      );
    }
  };

  const openContributionModal = (goal: Goal) => {
    setSelectedGoal(goal);
    setContribution("");
    setError("");
    setShowContributionModal(true);
  };

  const handleContribution = async () => {
    const amount = Number(contribution);

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter a contribution greater than ₹0.");
      return;
    }

    if (!selectedGoal) return;

    const updatedAmount = selectedGoal.current + amount;

    if (updatedAmount > selectedGoal.target) {
      setError("Contribution cannot exceed the remaining goal amount.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;
      if (!user) throw new Error("Please sign in again.");

      const { error: updateError } = await supabase
        .from("goals")
        .update({
          current_amount: updatedAmount,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedGoal.id)
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      setShowContributionModal(false);
      setSelectedGoal(null);
      setContribution("");
      setSuccess("Savings contribution added successfully!");
      await fetchGoals();
    } catch (err) {
      console.error("Contribution error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Could not add your contribution."
      );
    } finally {
      setSaving(false);
    }
  };

  const closeGoalModal = () => {
    if (saving) return;
    setShowModal(false);
    resetForm();
    setError("");
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
              onClick={openAddModal}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-[#07110D] hover:bg-emerald-400"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Add Goal</span>
              <span className="sm:hidden">Add</span>
            </button>
          </header>

          <div className="mx-auto w-full max-w-[1400px] px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
            {error && !showModal && !showContributionModal && (
              <div className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.07] p-4 text-sm text-red-300">
                <span>{error}</span>
                <button onClick={() => setError("")} aria-label="Dismiss error">
                  <X size={17} />
                </button>
              </div>
            )}

            {success && (
              <div className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.07] p-4 text-sm text-emerald-300">
                <span>{success}</span>
                <button onClick={() => setSuccess("")} aria-label="Dismiss message">
                  <X size={17} />
                </button>
              </div>
            )}

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
                <p className="text-sm text-white/35">Overall Progress</p>
                <p className="mt-3 text-2xl font-bold text-emerald-400">
                  {overallProgress.toFixed(1)}%
                </p>
              </div>
            </section>

            <section className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
              <div className="flex justify-between">
                <div>
                  <h2 className="font-semibold">Your Savings Journey</h2>
                  <p className="mt-1 text-xs text-white/25">
                    Keep building toward your goals
                  </p>
                </div>
                <Target className="text-emerald-400" size={22} />
              </div>

              <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{ width: `${Math.min(overallProgress, 100)}%` }}
                />
              </div>

              <div className="mt-2 flex justify-between gap-3 text-xs">
                <span className="text-white/25">
                  {formatCurrency(totalSaved)} saved
                </span>
                <span className="text-white/35">
                  {formatCurrency(totalTarget)}
                </span>
              </div>
            </section>

            {loading ? (
              <div className="flex min-h-52 items-center justify-center gap-3 text-sm text-white/40">
                <LoaderCircle className="animate-spin" size={20} />
                Loading your goals...
              </div>
            ) : (
              <section className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {goals.map((goal) => {
                  const progress =
                    goal.target > 0
                      ? (goal.current / goal.target) * 100
                      : 0;

                  const remaining = Math.max(goal.target - goal.current, 0);

                  return (
                    <div
                      key={goal.id}
                      className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                          <Target size={20} />
                        </div>

                        <div className="flex gap-1">
                          <button
                            onClick={() => openEditModal(goal)}
                            aria-label={`Edit ${goal.name}`}
                            className="flex h-9 w-9 items-center justify-center rounded-xl text-white/30 transition hover:bg-emerald-500/10 hover:text-emerald-400"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteGoal(goal)}
                            aria-label={`Delete ${goal.name}`}
                            className="flex h-9 w-9 items-center justify-center rounded-xl text-white/20 transition hover:bg-red-500/10 hover:text-red-400"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </div>

                      <h2 className="mt-5 font-semibold">{goal.name}</h2>

                      <p className="mt-2 text-2xl font-bold">
                        {formatCurrency(goal.current)}
                      </p>

                      <p className="mt-1 text-xs text-white/25">
                        of {formatCurrency(goal.target)}
                      </p>

                      <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>

                      <div className="mt-2 flex justify-between gap-2 text-xs">
                        <span className="text-emerald-400">
                          {Math.round(progress)}%
                        </span>
                        <span className="flex items-center gap-1 text-white/25">
                          <CalendarDays size={13} />
                          {formatDate(goal.targetDate)}
                        </span>
                      </div>

                      <p className="mt-3 text-xs text-white/35">
                        {remaining > 0
                          ? `${formatCurrency(remaining)} left to save`
                          : "🎉 Goal completed!"}
                      </p>

                      <button
                        onClick={() => openContributionModal(goal)}
                        disabled={remaining <= 0}
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] py-3 text-sm font-medium text-white/60 transition hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <TrendingUp size={16} />
                        {remaining <= 0 ? "Goal Completed" : "Add Contribution"}
                      </button>
                    </div>
                  );
                })}

                {goals.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center md:col-span-2 xl:col-span-3">
                    <Target size={26} className="mx-auto text-white/20" />
                    <p className="mt-4 text-sm text-white/45">
                      No savings goals yet
                    </p>
                    <button
                      onClick={openAddModal}
                      className="mt-4 text-sm text-emerald-400"
                    >
                      Create your first goal
                    </button>
                  </div>
                )}
              </section>
            )}
          </div>
        </main>
      </div>

      <MobileNav />

      {/* Create / Edit Goal Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-md rounded-3xl border border-white/10 bg-[#0B1712] p-6 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  {editingGoal ? "Edit Goal" : "Create Goal"}
                </h2>
                <p className="mt-1 text-sm text-white/30">
                  Set a target and track your savings progress.
                </p>
              </div>
              <button
                onClick={closeGoalModal}
                disabled={saving}
                aria-label="Close"
                className="text-white/40 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <p className="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-300">
                {error}
              </p>
            )}

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-xs text-white/45">
                  Goal Name
                </label>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  maxLength={100}
                  placeholder="e.g. New Phone"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm outline-none placeholder:text-white/20 focus:border-emerald-500/40"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs text-white/45">
                  Target Amount (₹)
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={form.target}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, target: e.target.value }))
                  }
                  placeholder="50000"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm outline-none placeholder:text-white/20 focus:border-emerald-500/40"
                />
              </div>

              {editingGoal && (
                <div>
                  <label className="mb-2 block text-xs text-white/45">
                    Current Savings (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.current}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, current: e.target.value }))
                    }
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm outline-none focus:border-emerald-500/40"
                  />
                </div>
              )}

              <div>
                <label className="mb-2 block text-xs text-white/45">
                  Target Date (optional)
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, date: e.target.value }))
                  }
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white/70 outline-none focus:border-emerald-500/40"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={closeGoalModal}
                  disabled={saving}
                  className="h-12 flex-1 rounded-xl border border-white/10 bg-white/[0.03] text-sm text-white/60 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSaveGoal}
                  disabled={saving}
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 text-sm font-semibold text-[#07110D] hover:bg-emerald-400 disabled:opacity-60"
                >
                  {saving && <LoaderCircle size={16} className="animate-spin" />}
                  {saving
                    ? "Saving..."
                    : editingGoal
                      ? "Save Changes"
                      : "Create Goal"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Contribution Modal */}
      {showContributionModal && selectedGoal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0B1712] p-6 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold">Add Contribution</h2>
                <p className="mt-1 text-sm text-white/35">
                  {selectedGoal.name}
                </p>
              </div>
              <button
                onClick={() => {
                  if (saving) return;
                  setShowContributionModal(false);
                  setError("");
                }}
                disabled={saving}
                aria-label="Close"
                className="text-white/40 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-5 rounded-xl bg-white/[0.03] p-4">
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Saved so far</span>
                <span>{formatCurrency(selectedGoal.current)}</span>
              </div>
              <div className="mt-3 flex justify-between text-sm">
                <span className="text-white/40">Remaining</span>
                <span className="text-emerald-400">
                  {formatCurrency(selectedGoal.target - selectedGoal.current)}
                </span>
              </div>
            </div>

            {error && (
              <p className="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-300">
                {error}
              </p>
            )}

            <div className="mt-5">
              <label className="mb-2 block text-xs text-white/45">
                Contribution Amount (₹)
              </label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={contribution}
                onChange={(e) => setContribution(e.target.value)}
                placeholder="e.g. 1000"
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm outline-none placeholder:text-white/20 focus:border-emerald-500/40"
              />
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => {
                  setShowContributionModal(false);
                  setError("");
                }}
                disabled={saving}
                className="h-12 flex-1 rounded-xl border border-white/10 bg-white/[0.03] text-sm text-white/60 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleContribution}
                disabled={saving}
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 text-sm font-semibold text-[#07110D] hover:bg-emerald-400 disabled:opacity-60"
              >
                {saving && <LoaderCircle size={16} className="animate-spin" />}
                {saving ? "Saving..." : "Add Savings"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
