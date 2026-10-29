"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { supabase } from "@/lib/supabase";

import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  BarChart3,
  CalendarDays,
  Check,
  CreditCard,
  Home,
  MoreHorizontal,
  PiggyBank,
  Plus,
  ReceiptText,
  ShoppingBag,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  Utensils,
  Wallet,
} from "lucide-react";

type Subscription = {
  id: number;
  name: string;
  amount: string;
  billingCycle: "monthly" | "yearly";
};

type Goal = {
  id: number;
  name: string;
  targetAmount: string;
  currentAmount: string;
  targetDate: string;
};

type Investment = {
  id: number;
  type: string;
  name: string;
  investedAmount: string;
  currentValue: string;
};

const steps = [
  {
    title: "Your Income",
    subtitle: "Let's understand what comes in every month.",
  },
  {
    title: "Your Expenses",
    subtitle: "Tell us where your money usually goes.",
  },
  {
    title: "Your Subscriptions",
    subtitle: "Keep track of your recurring payments.",
  },
  {
    title: "Your Goals",
    subtitle: "What are you saving money for?",
  },
  {
    title: "Your Investments",
    subtitle: "Tell us about your current investments.",
  },
];

const expenseCategories = [
  {
    key: "rent",
    label: "Rent / Home",
    icon: Home,
  },
  {
    key: "food",
    label: "Food & Groceries",
    icon: Utensils,
  },
  {
    key: "travel",
    label: "Travel",
    icon: TrendingUp,
  },
  {
    key: "bills",
    label: "Bills",
    icon: ReceiptText,
  },
  {
    key: "shopping",
    label: "Shopping",
    icon: ShoppingBag,
  },
  {
    key: "other",
    label: "Other",
    icon: MoreHorizontal,
  },
];

const investmentTypes = [
  "Mutual Fund",
  "Stocks",
  "FD",
  "Gold",
  "Index Fund",
  "Other",
];

export default function OnboardingPage() {
  const router = useRouter();

  const [step, setStep] = useState(0);

  const [monthlySalary, setMonthlySalary] = useState("");
  const [otherIncome, setOtherIncome] = useState("");

  const [expenses, setExpenses] = useState({
    rent: "",
    food: "",
    travel: "",
    bills: "",
    shopping: "",
    other: "",
  });

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  const [goals, setGoals] = useState<Goal[]>([]);

  const [hasInvestments, setHasInvestments] = useState<boolean | null>(
    null
  );

  const [investments, setInvestments] = useState<Investment[]>([]);

  const [showComplete, setShowComplete] = useState(false);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const totalIncome = useMemo(() => {
    return Number(monthlySalary || 0) + Number(otherIncome || 0);
  }, [monthlySalary, otherIncome]);

  const totalExpenses = useMemo(() => {
    return Object.values(expenses).reduce(
      (sum, value) => sum + Number(value || 0),
      0
    );
  }, [expenses]);

  const monthlySubscriptions = useMemo(() => {
    return subscriptions.reduce((sum, sub) => {
      const amount = Number(sub.amount || 0);

      if (sub.billingCycle === "yearly") {
        return sum + amount / 12;
      }

      return sum + amount;
    }, 0);
  }, [subscriptions]);

  const estimatedSavings = Math.max(
    totalIncome - totalExpenses - monthlySubscriptions,
    0
  );

  function updateExpense(
    key: keyof typeof expenses,
    value: string
  ) {
    setExpenses((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function addSubscription() {
    setSubscriptions((previous) => [
      ...previous,
      {
        id: Date.now(),
        name: "",
        amount: "",
        billingCycle: "monthly",
      },
    ]);
  }

  function removeSubscription(id: number) {
    setSubscriptions((previous) =>
      previous.filter((item) => item.id !== id)
    );
  }

  function updateSubscription(
    id: number,
    field: keyof Subscription,
    value: string
  ) {
    setSubscriptions((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  }

  function addGoal() {
    setGoals((previous) => [
      ...previous,
      {
        id: Date.now(),
        name: "",
        targetAmount: "",
        currentAmount: "",
        targetDate: "",
      },
    ]);
  }

  function removeGoal(id: number) {
    setGoals((previous) =>
      previous.filter((item) => item.id !== id)
    );
  }

  function updateGoal(
    id: number,
    field: keyof Goal,
    value: string
  ) {
    setGoals((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  }

  function addInvestment() {
    setInvestments((previous) => [
      ...previous,
      {
        id: Date.now(),
        type: "Mutual Fund",
        name: "",
        investedAmount: "",
        currentValue: "",
      },
    ]);
  }

  function removeInvestment(id: number) {
    setInvestments((previous) =>
      previous.filter((item) => item.id !== id)
    );
  }

  function updateInvestment(
    id: number,
    field: keyof Investment,
    value: string
  ) {
    setInvestments((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  }

  async function finishSetup() {
    if (saving) return;

    setSaving(true);
    setSaveError("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        router.push("/auth");
        return;
      }

      /*
       * --------------------------------
       * 1. SAVE INCOME
       * --------------------------------
       */

      const incomeRows = [];

      if (Number(monthlySalary) > 0) {
        incomeRows.push({
          user_id: user.id,
          income_type: "salary",
          source_name: "Monthly Salary",
          amount: Number(monthlySalary),
          frequency: "monthly",
        });
      }

      if (Number(otherIncome) > 0) {
        incomeRows.push({
          user_id: user.id,
          income_type: "other",
          source_name: "Other Income",
          amount: Number(otherIncome),
          frequency: "monthly",
        });
      }

      if (incomeRows.length > 0) {
        const { error } = await supabase
          .from("financial_income")
          .insert(incomeRows);

        if (error) {
          throw new Error(`Income: ${error.message}`);
        }
      }

      /*
       * --------------------------------
       * 2. SAVE EXPENSES
       * --------------------------------
       */

      const expenseRows = Object.entries(expenses)
        .filter(([, value]) => Number(value) > 0)
        .map(([category, value]) => ({
          user_id: user.id,
          type: "expense",
          amount: Number(value),
          category,
          description: `Initial ${category} expense`,
          payment_method: null,
          transaction_date: new Date()
            .toISOString()
            .split("T")[0],
        }));

      if (expenseRows.length > 0) {
        const { error } = await supabase
          .from("transactions")
          .insert(expenseRows);

        if (error) {
          throw new Error(`Expenses: ${error.message}`);
        }
      }

      /*
       * --------------------------------
       * 3. SAVE SUBSCRIPTIONS
       * --------------------------------
       */

      const validSubscriptions = subscriptions.filter(
        (subscription) =>
          subscription.name.trim() &&
          Number(subscription.amount) > 0
      );

      if (validSubscriptions.length > 0) {
        const subscriptionRows = validSubscriptions.map(
          (subscription) => ({
            user_id: user.id,
            name: subscription.name.trim(),
            amount: Number(subscription.amount),
            billing_cycle: subscription.billingCycle,
            next_billing_date: null,
          })
        );

        const { error } = await supabase
          .from("subscriptions")
          .insert(subscriptionRows);

        if (error) {
          throw new Error(`Subscriptions: ${error.message}`);
        }
      }

      /*
       * --------------------------------
       * 4. SAVE GOALS
       * --------------------------------
       */

      const validGoals = goals.filter(
        (goal) =>
          goal.name.trim() &&
          Number(goal.targetAmount) > 0
      );

      if (validGoals.length > 0) {
        const goalRows = validGoals.map((goal) => ({
          user_id: user.id,
          name: goal.name.trim(),
          target_amount: Number(goal.targetAmount),
          current_amount: Number(
            goal.currentAmount || 0
          ),
          target_date: goal.targetDate || null,
        }));

        const { error } = await supabase
          .from("goals")
          .insert(goalRows);

        if (error) {
          throw new Error(`Goals: ${error.message}`);
        }
      }

      /*
       * --------------------------------
       * 5. SAVE INVESTMENTS
       * --------------------------------
       */

      const investmentTypeMap: Record<string, string> = {
        "Mutual Fund": "mutual_fund",
        Stocks: "stocks",
        FD: "fd",
        Gold: "gold",
        "Index Fund": "index_fund",
        Other: "other",
      };

      const validInvestments =
        hasInvestments === true
          ? investments.filter(
              (investment) =>
                investment.name.trim() &&
                Number(investment.investedAmount) > 0
            )
          : [];

      if (validInvestments.length > 0) {
        const investmentRows = validInvestments.map(
          (investment) => ({
            user_id: user.id,
            investment_type:
              investmentTypeMap[investment.type] || "other",
            name: investment.name.trim(),
            invested_amount: Number(
              investment.investedAmount
            ),
            current_value:
              investment.currentValue === ""
                ? null
                : Number(investment.currentValue),
          })
        );

        const { error } = await supabase
          .from("investments")
          .insert(investmentRows);

        if (error) {
          throw new Error(
            `Investments: ${error.message}`
          );
        }
      }

      /*
       * --------------------------------
       * 6. MARK ONBOARDING COMPLETE
       * --------------------------------
       */

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (profileError) {
        throw new Error(
          `Profile: ${profileError.message}`
        );
      }

      /*
       * --------------------------------
       * SUCCESS
       * --------------------------------
       */

      setShowComplete(true);
    } catch (error) {
      console.error("Onboarding save error:", error);

      setSaveError(
        error instanceof Error
          ? error.message
          : "Something went wrong while saving your financial data."
      );
    } finally {
      setSaving(false);
    }
  }

  async function nextStep() {
    if (saving) return;

    if (step < steps.length - 1) {
      setStep((previous) => previous + 1);
      return;
    }

    await finishSetup();
  }

  function previousStep() {
    if (step > 0 && !saving) {
      setStep((previous) => previous - 1);
    }
  }

  function skipStep() {
    if (saving) return;

    if (step < steps.length - 1) {
      setStep((previous) => previous + 1);
    } else {
      finishSetup();
    }
  }

  return (
    <main className="min-h-screen bg-[#090b0a] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-280px] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-emerald-500/[0.07] blur-[130px]" />

        <div className="absolute bottom-[-250px] right-[-150px] h-[500px] w-[500px] rounded-full bg-green-500/[0.04] blur-[120px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8 lg:px-10">

        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/wealthly-logo.svg"
              alt="Wealthly"
              width={42}
              height={42}
              className="h-10 w-10"
            />

            <div>
              <div className="text-[17px] font-semibold tracking-tight">
                Wealthly
              </div>

              <div className="text-[11px] text-zinc-500">
                Plan Today. A Better Tomorrow.
              </div>
            </div>
          </div>

          <div className="rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs text-zinc-400">
            Setup your finances
          </div>
        </header>

        {/* Progress */}
        <div className="mx-auto mt-10 w-full max-w-3xl">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">
              Step {step + 1} of {steps.length}
            </span>

            <span className="text-xs font-medium text-emerald-400">
              {Math.round(
                ((step + 1) / steps.length) * 100
              )}
              %
            </span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-500"
              style={{
                width: `${
                  ((step + 1) / steps.length) * 100
                }%`,
              }}
            />
          </div>
        </div>

        {/* Main */}
        <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col py-10">
          {!showComplete ? (
            <>
              <div className="mb-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.08]">
                  {step === 0 && (
                    <Banknote className="h-5 w-5 text-emerald-400" />
                  )}

                  {step === 1 && (
                    <Wallet className="h-5 w-5 text-emerald-400" />
                  )}

                  {step === 2 && (
                    <CreditCard className="h-5 w-5 text-emerald-400" />
                  )}

                  {step === 3 && (
                    <Target className="h-5 w-5 text-emerald-400" />
                  )}

                  {step === 4 && (
                    <BarChart3 className="h-5 w-5 text-emerald-400" />
                  )}
                </div>

                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  {steps[step].title}
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
                  {steps[step].subtitle}
                </p>
              </div>

              {/* STEP 1 — INCOME */}
              {step === 0 && (
                <div className="space-y-5">
                  <div className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6">
                    <label className="mb-3 block text-sm font-medium text-zinc-300">
                      Monthly salary / primary income
                    </label>

                    <div className="flex items-center rounded-2xl border border-white/[0.08] bg-[#0d100f] px-4 transition focus-within:border-emerald-500/40">
                      <span className="mr-3 text-lg text-zinc-500">
                        ₹
                      </span>

                      <input
                        type="number"
                        value={monthlySalary}
                        onChange={(e) =>
                          setMonthlySalary(e.target.value)
                        }
                        placeholder="25,000"
                        className="h-14 w-full bg-transparent text-xl font-medium outline-none placeholder:text-zinc-700"
                      />
                    </div>

                    <p className="mt-2 text-xs text-zinc-600">
                      Your regular monthly income after taxes.
                    </p>
                  </div>

                  <div className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6">
                    <label className="mb-3 block text-sm font-medium text-zinc-300">
                      Other monthly income
                      <span className="ml-2 text-xs text-zinc-600">
                        Optional
                      </span>
                    </label>

                    <div className="flex items-center rounded-2xl border border-white/[0.08] bg-[#0d100f] px-4 transition focus-within:border-emerald-500/40">
                      <span className="mr-3 text-lg text-zinc-500">
                        ₹
                      </span>

                      <input
                        type="number"
                        value={otherIncome}
                        onChange={(e) =>
                          setOtherIncome(e.target.value)
                        }
                        placeholder="0"
                        className="h-14 w-full bg-transparent text-xl font-medium outline-none placeholder:text-zinc-700"
                      />
                    </div>
                  </div>

                  <div className="rounded-3xl border border-emerald-500/10 bg-emerald-500/[0.04] p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-zinc-500">
                          Estimated monthly income
                        </p>

                        <p className="mt-1 text-2xl font-semibold">
                          ₹
                          {totalIncome.toLocaleString(
                            "en-IN"
                          )}
                        </p>
                      </div>

                      <Sparkles className="h-5 w-5 text-emerald-400" />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2 — EXPENSES */}
              {step === 1 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {expenseCategories.map((category) => {
                    const Icon = category.icon;

                    return (
                      <div
                        key={category.key}
                        className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5"
                      >
                        <div className="mb-4 flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05]">
                            <Icon className="h-4 w-4 text-zinc-400" />
                          </div>

                          <label className="text-sm font-medium text-zinc-300">
                            {category.label}
                          </label>
                        </div>

                        <div className="flex items-center rounded-xl border border-white/[0.08] bg-[#0d100f] px-3">
                          <span className="mr-2 text-zinc-600">
                            ₹
                          </span>

                          <input
                            type="number"
                            value={
                              expenses[
                                category.key as keyof typeof expenses
                              ]
                            }
                            onChange={(e) =>
                              updateExpense(
                                category.key as keyof typeof expenses,
                                e.target.value
                              )
                            }
                            placeholder="0"
                            className="h-12 w-full bg-transparent outline-none placeholder:text-zinc-700"
                          />
                        </div>
                      </div>
                    );
                  })}

                  <div className="rounded-3xl border border-emerald-500/10 bg-emerald-500/[0.04] p-5 sm:col-span-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-zinc-500">
                          Total monthly expenses
                        </p>

                        <p className="mt-1 text-2xl font-semibold">
                          ₹
                          {totalExpenses.toLocaleString(
                            "en-IN"
                          )}
                        </p>
                      </div>

                      <Wallet className="h-5 w-5 text-emerald-400" />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3 — SUBSCRIPTIONS */}
              {step === 2 && (
                <div className="space-y-4">
                  {subscriptions.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-white/[0.1] bg-white/[0.02] px-6 py-12 text-center">
                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04]">
                        <CreditCard className="h-6 w-6 text-zinc-500" />
                      </div>

                      <h3 className="font-medium text-zinc-300">
                        No subscriptions added
                      </h3>

                      <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-zinc-600">
                        Netflix, Spotify, gym memberships, cloud
                        storage and other recurring payments can be
                        added here.
                      </p>
                    </div>
                  ) : (
                    subscriptions.map(
                      (subscription, index) => (
                        <div
                          key={subscription.id}
                          className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5"
                        >
                          <div className="mb-4 flex items-center justify-between">
                            <span className="text-xs text-zinc-600">
                              Subscription {index + 1}
                            </span>

                            <button
                              onClick={() =>
                                removeSubscription(
                                  subscription.id
                                )
                              }
                              className="rounded-lg p-2 text-zinc-600 transition hover:bg-red-500/10 hover:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="grid gap-3 sm:grid-cols-[1fr_150px_130px]">
                            <input
                              value={subscription.name}
                              onChange={(e) =>
                                updateSubscription(
                                  subscription.id,
                                  "name",
                                  e.target.value
                                )
                              }
                              placeholder="e.g. Spotify"
                              className="h-12 rounded-xl border border-white/[0.08] bg-[#0d100f] px-4 text-sm outline-none placeholder:text-zinc-700 focus:border-emerald-500/40"
                            />

                            <div className="flex items-center rounded-xl border border-white/[0.08] bg-[#0d100f] px-3">
                              <span className="mr-2 text-zinc-600">
                                ₹
                              </span>

                              <input
                                type="number"
                                value={subscription.amount}
                                onChange={(e) =>
                                  updateSubscription(
                                    subscription.id,
                                    "amount",
                                    e.target.value
                                  )
                                }
                                placeholder="140"
                                className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-zinc-700"
                              />
                            </div>

                            <select
                              value={subscription.billingCycle}
                              onChange={(e) =>
                                updateSubscription(
                                  subscription.id,
                                  "billingCycle",
                                  e.target.value
                                )
                              }
                              className="h-12 rounded-xl border border-white/[0.08] bg-[#0d100f] px-3 text-sm text-zinc-400 outline-none"
                            >
                              <option value="monthly">
                                Monthly
                              </option>

                              <option value="yearly">
                                Yearly
                              </option>
                            </select>
                          </div>
                        </div>
                      )
                    )
                  )}

                  <button
                    onClick={addSubscription}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-emerald-500/25 bg-emerald-500/[0.03] py-4 text-sm font-medium text-emerald-400 transition hover:bg-emerald-500/[0.07]"
                  >
                    <Plus className="h-4 w-4" />
                    Add Subscription
                  </button>

                  {subscriptions.length > 0 && (
                    <div className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5 py-4">
                      <span className="text-xs text-zinc-500">
                        Estimated monthly subscriptions
                      </span>

                      <span className="font-semibold text-zinc-200">
                        ₹
                        {Math.round(
                          monthlySubscriptions
                        ).toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4 — GOALS */}
              {step === 3 && (
                <div className="space-y-4">
                  {goals.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-white/[0.1] bg-white/[0.02] px-6 py-12 text-center">
                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04]">
                        <Target className="h-6 w-6 text-zinc-500" />
                      </div>

                      <h3 className="font-medium text-zinc-300">
                        No goals added yet
                      </h3>

                      <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-zinc-600">
                        Add things you're saving for — emergency
                        fund, laptop, trip, car or anything else.
                      </p>
                    </div>
                  ) : (
                    goals.map((goal, index) => (
                      <div
                        key={goal.id}
                        className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5"
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <span className="text-xs text-zinc-600">
                            Goal {index + 1}
                          </span>

                          <button
                            onClick={() =>
                              removeGoal(goal.id)
                            }
                            className="rounded-lg p-2 text-zinc-600 transition hover:bg-red-500/10 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="space-y-3">
                          <input
                            value={goal.name}
                            onChange={(e) =>
                              updateGoal(
                                goal.id,
                                "name",
                                e.target.value
                              )
                            }
                            placeholder="e.g. Emergency Fund"
                            className="h-12 w-full rounded-xl border border-white/[0.08] bg-[#0d100f] px-4 text-sm outline-none placeholder:text-zinc-700 focus:border-emerald-500/40"
                          />

                          <div className="grid gap-3 sm:grid-cols-2">
                            <div className="flex items-center rounded-xl border border-white/[0.08] bg-[#0d100f] px-3">
                              <span className="mr-2 text-zinc-600">
                                ₹
                              </span>

                              <input
                                type="number"
                                value={goal.targetAmount}
                                onChange={(e) =>
                                  updateGoal(
                                    goal.id,
                                    "targetAmount",
                                    e.target.value
                                  )
                                }
                                placeholder="Target amount"
                                className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-zinc-700"
                              />
                            </div>

                            <div className="flex items-center rounded-xl border border-white/[0.08] bg-[#0d100f] px-3">
                              <span className="mr-2 text-zinc-600">
                                ₹
                              </span>

                              <input
                                type="number"
                                value={goal.currentAmount}
                                onChange={(e) =>
                                  updateGoal(
                                    goal.id,
                                    "currentAmount",
                                    e.target.value
                                  )
                                }
                                placeholder="Already saved"
                                className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-zinc-700"
                              />
                            </div>
                          </div>

                          <div className="relative">
                            <CalendarDays className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />

                            <input
                              type="date"
                              value={goal.targetDate}
                              onChange={(e) =>
                                updateGoal(
                                  goal.id,
                                  "targetDate",
                                  e.target.value
                                )
                              }
                              className="h-12 w-full rounded-xl border border-white/[0.08] bg-[#0d100f] pl-11 pr-4 text-sm text-zinc-400 outline-none focus:border-emerald-500/40"
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}

                  <button
                    onClick={addGoal}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-emerald-500/25 bg-emerald-500/[0.03] py-4 text-sm font-medium text-emerald-400 transition hover:bg-emerald-500/[0.07]"
                  >
                    <Plus className="h-4 w-4" />
                    Add Savings Goal
                  </button>
                </div>
              )}

              {/* STEP 5 — INVESTMENTS */}
              {step === 4 && (
                <div className="space-y-5">
                  {hasInvestments === null && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <button
                        onClick={() =>
                          setHasInvestments(true)
                        }
                        className="group rounded-3xl border border-white/[0.08] bg-white/[0.025] p-7 text-left transition hover:border-emerald-500/30 hover:bg-emerald-500/[0.04]"
                      >
                        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/[0.08]">
                          <TrendingUp className="h-5 w-5 text-emerald-400" />
                        </div>

                        <h3 className="font-semibold">
                          Yes, I invest
                        </h3>

                        <p className="mt-2 text-xs leading-5 text-zinc-600">
                          Mutual funds, stocks, FDs, gold and
                          more.
                        </p>
                      </button>

                      <button
                        onClick={() =>
                          setHasInvestments(false)
                        }
                        className="group rounded-3xl border border-white/[0.08] bg-white/[0.025] p-7 text-left transition hover:border-emerald-500/30 hover:bg-emerald-500/[0.04]"
                      >
                        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.05]">
                          <PiggyBank className="h-5 w-5 text-zinc-400" />
                        </div>

                        <h3 className="font-semibold">
                          Not yet
                        </h3>

                        <p className="mt-2 text-xs leading-5 text-zinc-600">
                          That's completely fine. You can add
                          investments later.
                        </p>
                      </button>
                    </div>
                  )}

                  {hasInvestments === false && (
                    <div className="rounded-3xl border border-emerald-500/10 bg-emerald-500/[0.04] p-7 text-center">
                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10">
                        <PiggyBank className="h-6 w-6 text-emerald-400" />
                      </div>

                      <h3 className="font-semibold">
                        No investments yet — no problem.
                      </h3>

                      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
                        We'll help you understand your finances
                        first. You can start tracking investments
                        whenever you're ready.
                      </p>
                    </div>
                  )}

                  {hasInvestments === true && (
                    <>
                      {investments.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-white/[0.1] bg-white/[0.02] px-6 py-10 text-center">
                          <BarChart3 className="mx-auto mb-4 h-7 w-7 text-zinc-600" />

                          <p className="text-sm text-zinc-400">
                            Add your existing investments
                          </p>

                          <p className="mt-1 text-xs text-zinc-600">
                            You can add multiple investments.
                          </p>
                        </div>
                      ) : (
                        investments.map(
                          (investment, index) => (
                            <div
                              key={investment.id}
                              className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5"
                            >
                              <div className="mb-4 flex items-center justify-between">
                                <span className="text-xs text-zinc-600">
                                  Investment {index + 1}
                                </span>

                                <button
                                  onClick={() =>
                                    removeInvestment(
                                      investment.id
                                    )
                                  }
                                  className="rounded-lg p-2 text-zinc-600 transition hover:bg-red-500/10 hover:text-red-400"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>

                              <div className="space-y-3">
                                <select
                                  value={investment.type}
                                  onChange={(e) =>
                                    updateInvestment(
                                      investment.id,
                                      "type",
                                      e.target.value
                                    )
                                  }
                                  className="h-12 w-full rounded-xl border border-white/[0.08] bg-[#0d100f] px-4 text-sm text-zinc-400 outline-none"
                                >
                                  {investmentTypes.map(
                                    (type) => (
                                      <option
                                        key={type}
                                        value={type}
                                      >
                                        {type}
                                      </option>
                                    )
                                  )}
                                </select>

                                <input
                                  value={investment.name}
                                  onChange={(e) =>
                                    updateInvestment(
                                      investment.id,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Investment name"
                                  className="h-12 w-full rounded-xl border border-white/[0.08] bg-[#0d100f] px-4 text-sm outline-none placeholder:text-zinc-700 focus:border-emerald-500/40"
                                />

                                <div className="grid gap-3 sm:grid-cols-2">
                                  <div className="flex items-center rounded-xl border border-white/[0.08] bg-[#0d100f] px-3">
                                    <span className="mr-2 text-zinc-600">
                                      ₹
                                    </span>

                                    <input
                                      type="number"
                                      value={
                                        investment.investedAmount
                                      }
                                      onChange={(e) =>
                                        updateInvestment(
                                          investment.id,
                                          "investedAmount",
                                          e.target.value
                                        )
                                      }
                                      placeholder="Invested amount"
                                      className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-zinc-700"
                                    />
                                  </div>

                                  <div className="flex items-center rounded-xl border border-white/[0.08] bg-[#0d100f] px-3">
                                    <span className="mr-2 text-zinc-600">
                                      ₹
                                    </span>

                                    <input
                                      type="number"
                                      value={
                                        investment.currentValue
                                      }
                                      onChange={(e) =>
                                        updateInvestment(
                                          investment.id,
                                          "currentValue",
                                          e.target.value
                                        )
                                      }
                                      placeholder="Current value"
                                      className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-zinc-700"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        )
                      )}

                      <button
                        onClick={addInvestment}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-emerald-500/25 bg-emerald-500/[0.03] py-4 text-sm font-medium text-emerald-400 transition hover:bg-emerald-500/[0.07]"
                      >
                        <Plus className="h-4 w-4" />
                        Add Investment
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Error */}
              {saveError && (
                <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/[0.05] px-4 py-3 text-sm text-red-400">
                  {saveError}
                </div>
              )}

              {/* Bottom actions */}
              <div className="mt-10 flex items-center justify-between border-t border-white/[0.06] pt-6">
                <button
                  onClick={previousStep}
                  disabled={step === 0 || saving}
                  className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-zinc-500 transition hover:bg-white/[0.04] hover:text-white disabled:pointer-events-none disabled:opacity-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>

                <div className="flex items-center gap-3">
                  {(step === 2 ||
                    step === 3 ||
                    step === 4) && (
                    <button
                      onClick={skipStep}
                      disabled={saving}
                      className="rounded-xl px-4 py-3 text-sm text-zinc-500 transition hover:text-white disabled:pointer-events-none disabled:opacity-50"
                    >
                      Skip for now
                    </button>
                  )}

                  <button
                    onClick={nextStep}
                    disabled={saving}
                    className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-[#07100b] shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {step === steps.length - 1
                      ? saving
                        ? "Saving..."
                        : "Finish Setup"
                      : "Continue"}

                    {!saving &&
                      (step === steps.length - 1 ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <ArrowRight className="h-4 w-4" />
                      ))}
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Completion */
            <div className="flex flex-1 items-center justify-center">
              <div className="w-full max-w-xl text-center">
                <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-[28px] border border-emerald-500/20 bg-emerald-500/[0.08]">
                  <Check className="h-9 w-9 text-emerald-400" />
                </div>

                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/15 bg-emerald-500/[0.05] px-4 py-2 text-xs font-medium text-emerald-400">
                  <Sparkles className="h-3.5 w-3.5" />
                  You're all set
                </div>

                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Your financial journey starts here.
                </h1>

                <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-zinc-500">
                  We've got a better picture of your finances now.
                  Wealthly can use this information to help you
                  budget, save, invest and make smarter decisions.
                </p>

                <div className="mx-auto mt-8 grid max-w-md grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                    <p className="text-lg font-semibold">
                      ₹
                      {totalIncome.toLocaleString(
                        "en-IN"
                      )}
                    </p>

                    <p className="mt-1 text-[10px] text-zinc-600">
                      Monthly income
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                    <p className="text-lg font-semibold">
                      ₹
                      {totalExpenses.toLocaleString(
                        "en-IN"
                      )}
                    </p>

                    <p className="mt-1 text-[10px] text-zinc-600">
                      Expenses
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                    <p className="text-lg font-semibold text-emerald-400">
                      ₹
                      {estimatedSavings.toLocaleString(
                        "en-IN"
                      )}
                    </p>

                    <p className="mt-1 text-[10px] text-zinc-600">
                      Est. savings
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => router.push("/dashboard")}
                  className="mx-auto mt-9 flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-semibold text-[#07100b] shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-400"
                >
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </button>

                <p className="mt-4 text-[11px] text-zinc-700">
                  Your information will be securely connected to
                  your Wealthly account.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}