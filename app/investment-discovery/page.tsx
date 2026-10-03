"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Check,
  CircleHelp,
  Clock3,
  Coins,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";

import AppSidebar from "@/components/ui/app-sidebar";
import MobileNav from "@/components/ui/mobile-nav";

type RiskLevel = "Low" | "Moderate" | "High";

const riskOptions: {
  name: RiskLevel;
  description: string;
  icon: typeof ShieldCheck;
}[] = [
  {
    name: "Low",
    description: "Focus on capital stability",
    icon: ShieldCheck,
  },
  {
    name: "Moderate",
    description: "Balance growth and stability",
    icon: BarChart3,
  },
  {
    name: "High",
    description: "Higher growth potential with more volatility",
    icon: TrendingUp,
  },
];

const goalOptions = [
  {
    name: "Wealth Creation",
    description: "Build long-term wealth",
    icon: TrendingUp,
  },
  {
    name: "Short Term",
    description: "Plan for a near-term goal",
    icon: Clock3,
  },
  {
    name: "Retirement",
    description: "Build a long-term retirement corpus",
    icon: Target,
  },
  {
    name: "Tax Saving",
    description: "Explore tax-saving investments",
    icon: Coins,
  },
];

const durationOptions = [1, 3, 5, 7, 10];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));

function calculateFutureValue(
  monthlyAmount: number,
  years: number,
  annualReturn: number
) {
  const months = years * 12;
  const monthlyRate = annualReturn / 100 / 12;

  if (monthlyRate === 0) {
    return monthlyAmount * months;
  }

  return (
    monthlyAmount *
    (((1 + monthlyRate) ** months - 1) / monthlyRate)
  );
}

export default function InvestmentDiscoveryPage() {
  const router = useRouter();

  const [monthlyAmount, setMonthlyAmount] = useState("5000");
  const [duration, setDuration] = useState(5);
  const [risk, setRisk] = useState<RiskLevel>("Moderate");
  const [goal, setGoal] = useState("Wealth Creation");

  const amount = Number(monthlyAmount) || 0;

  const scenarios = useMemo(() => {
    const conservativeRate =
      risk === "Low" ? 6 : risk === "Moderate" ? 7 : 8;

    const moderateRate =
      risk === "Low" ? 7 : risk === "Moderate" ? 10 : 12;

    const higherRate =
      risk === "Low" ? 8 : risk === "Moderate" ? 12 : 15;

    return [
      {
        label: "Conservative",
        rate: conservativeRate,
        value: calculateFutureValue(
          amount,
          duration,
          conservativeRate
        ),
      },
      {
        label: "Moderate",
        rate: moderateRate,
        value: calculateFutureValue(
          amount,
          duration,
          moderateRate
        ),
      },
      {
        label: "Higher Growth",
        rate: higherRate,
        value: calculateFutureValue(
          amount,
          duration,
          higherRate
        ),
      },
    ];
  }, [amount, duration, risk]);

  const totalInvested = amount * duration * 12;

  const categories = useMemo(() => {
    if (risk === "Low") {
      return [
        {
          name: "Debt",
          percentage: 60,
          description:
            "Generally lower-volatility instruments focused on capital stability.",
        },
        {
          name: "Hybrid",
          percentage: 25,
          description:
            "Combines debt and equity exposure.",
        },
        {
          name: "Gold",
          percentage: 15,
          description:
            "Can provide diversification within a portfolio.",
        },
      ];
    }

    if (risk === "High") {
      return [
        {
          name: "Equity",
          percentage: 65,
          description:
            "Higher growth potential with higher market volatility.",
        },
        {
          name: "Index",
          percentage: 25,
          description:
            "Tracks a market index rather than selecting individual securities.",
        },
        {
          name: "Gold",
          percentage: 10,
          description:
            "Can provide diversification within a portfolio.",
        },
      ];
    }

    return [
      {
        name: "Equity",
        percentage: 45,
        description:
          "Growth-oriented category with market-linked volatility.",
      },
      {
        name: "Debt",
        percentage: 30,
        description:
          "Generally more stability-oriented than equity.",
      },
      {
        name: "Hybrid",
        percentage: 15,
        description:
          "Combines equity and debt exposure.",
      },
      {
        name: "Gold",
        percentage: 10,
        description:
          "Can provide portfolio diversification.",
      },
    ];
  }, [risk]);

  return (
    <div className="min-h-screen bg-[#07110D] text-white">
      <div className="flex min-h-screen">
        <AppSidebar />

        <main className="min-w-0 flex-1 pb-24 lg:pb-0">
          {/* Header */}
          <header className="flex h-[82px] items-center gap-4 border-b border-white/[0.06] px-5 sm:px-8 lg:px-10">
            <button
              type="button"
              onClick={() => router.push("/investments")}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] text-white/40 transition hover:bg-white/[0.04] hover:text-white"
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/25">
                Discover
              </p>

              <h1 className="mt-1 text-xl font-semibold sm:text-2xl">
                Investment Discovery
              </h1>
            </div>
          </header>

          <div className="mx-auto w-full max-w-[1500px] px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
            {/* Intro */}
            <section className="rounded-3xl border border-emerald-500/10 bg-emerald-500/[0.035] p-6 sm:p-8">
              <div className="max-w-3xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Sparkles size={21} />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">
                      Wealthly Discovery
                    </p>

                    <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                      Find an investment path that fits your plan.
                    </h2>
                  </div>
                </div>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-white/35 sm:text-base">
                  Tell Wealthly how much you want to invest, how long you
                  have and what level of risk you are comfortable with.
                  We&apos;ll turn those inputs into an illustrative
                  investment scenario.
                </p>
              </div>
            </section>

            {/* Input Section */}
            <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-7">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold">
                      Your Investment Plan
                    </h2>

                    <p className="mt-1 text-xs text-white/25">
                      Adjust the inputs to explore different scenarios.
                    </p>
                  </div>

                  <CircleHelp
                    size={18}
                    className="text-white/20"
                  />
                </div>

                {/* Monthly Amount */}
                <div className="mt-7">
                  <label className="text-sm font-medium text-white/60">
                    Monthly Investment
                  </label>

                  <div className="mt-3 flex items-center rounded-xl border border-white/10 bg-white/[0.03] px-4 focus-within:border-emerald-500/40">
                    <span className="text-white/35">₹</span>

                    <input
                      type="number"
                      min="0"
                      value={monthlyAmount}
                      onChange={(e) =>
                        setMonthlyAmount(e.target.value)
                      }
                      className="h-13 w-full bg-transparent px-3 text-lg font-semibold outline-none"
                    />
                  </div>

                  <div className="mt-3 flex gap-2 overflow-x-auto">
                    {[1000, 2500, 5000, 10000, 25000].map(
                      (value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() =>
                            setMonthlyAmount(String(value))
                          }
                          className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs transition ${
                            Number(monthlyAmount) === value
                              ? "bg-emerald-500 text-[#07110D]"
                              : "bg-white/[0.04] text-white/35 hover:text-white"
                          }`}
                        >
                          ₹{value.toLocaleString("en-IN")}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Duration */}
                <div className="mt-8">
                  <label className="text-sm font-medium text-white/60">
                    Investment Duration
                  </label>

                  <div className="mt-3 grid grid-cols-5 gap-2">
                    {durationOptions.map((year) => (
                      <button
                        key={year}
                        type="button"
                        onClick={() => setDuration(year)}
                        className={`rounded-xl border py-3 text-sm font-medium transition ${
                          duration === year
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                            : "border-white/[0.07] bg-white/[0.02] text-white/35 hover:text-white"
                        }`}
                      >
                        {year}Y
                      </button>
                    ))}
                  </div>
                </div>

                {/* Risk */}
                <div className="mt-8">
                  <label className="text-sm font-medium text-white/60">
                    Risk Preference
                  </label>

                  <div className="mt-3 grid gap-3 md:grid-cols-3">
                    {riskOptions.map((option) => {
                      const Icon = option.icon;
                      const selected = risk === option.name;

                      return (
                        <button
                          key={option.name}
                          type="button"
                          onClick={() => setRisk(option.name)}
                          className={`rounded-xl border p-4 text-left transition ${
                            selected
                              ? "border-emerald-500/30 bg-emerald-500/[0.08]"
                              : "border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04]"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div
                              className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                                selected
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : "bg-white/[0.04] text-white/30"
                              }`}
                            >
                              <Icon size={18} />
                            </div>

                            {selected && (
                              <Check
                                size={16}
                                className="text-emerald-400"
                              />
                            )}
                          </div>

                          <p
                            className={`mt-4 text-sm font-semibold ${
                              selected
                                ? "text-white"
                                : "text-white/60"
                            }`}
                          >
                            {option.name}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-white/25">
                            {option.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Goal */}
                <div className="mt-8">
                  <label className="text-sm font-medium text-white/60">
                    Investment Goal
                  </label>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {goalOptions.map((option) => {
                      const Icon = option.icon;
                      const selected = goal === option.name;

                      return (
                        <button
                          key={option.name}
                          type="button"
                          onClick={() => setGoal(option.name)}
                          className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                            selected
                              ? "border-emerald-500/30 bg-emerald-500/[0.08]"
                              : "border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04]"
                          }`}
                        >
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                              selected
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-white/[0.04] text-white/30"
                            }`}
                          >
                            <Icon size={18} />
                          </div>

                          <div className="min-w-0">
                            <p
                              className={`text-sm font-medium ${
                                selected
                                  ? "text-white"
                                  : "text-white/60"
                              }`}
                            >
                              {option.name}
                            </p>

                            <p className="mt-1 text-xs text-white/25">
                              {option.description}
                            </p>
                          </div>

                          {selected && (
                            <Check
                              size={16}
                              className="ml-auto shrink-0 text-emerald-400"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-6">
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/25">
                    Your Plan
                  </p>

                  <div className="mt-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/35">
                        Monthly investment
                      </span>

                      <span className="font-semibold">
                        {formatCurrency(amount)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/35">
                        Duration
                      </span>

                      <span className="font-semibold">
                        {duration} years
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/35">
                        Risk
                      </span>

                      <span className="font-semibold text-emerald-400">
                        {risk}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/35">
                        Goal
                      </span>

                      <span className="max-w-[160px] text-right text-sm font-semibold">
                        {goal}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-white/[0.06] pt-5">
                    <p className="text-xs text-white/25">
                      Total amount contributed
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                      {formatCurrency(totalInvested)}
                    </p>
                  </div>
                </div>

                {/* Category Mix */}
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
                  <h2 className="font-semibold">
                    Illustrative Category Mix
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-white/25">
                    This is a scenario, not a personalized investment
                    recommendation.
                  </p>

                  <div className="mt-5 space-y-4">
                    {categories.map((category) => (
                      <div key={category.name}>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white/55">
                            {category.name}
                          </span>

                          <span className="text-sm font-medium text-white/75">
                            {category.percentage}%
                          </span>
                        </div>

                        <div className="mt-2 h-2 rounded-full bg-white/[0.06]">
                          <div
                            className="h-full rounded-full bg-emerald-500"
                            style={{
                              width: `${category.percentage}%`,
                            }}
                          />
                        </div>

                        <p className="mt-2 text-[11px] leading-5 text-white/20">
                          {category.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Scenario Results */}
            <section className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-7">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-emerald-400">
                  Projection
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  Illustrative Corpus Scenarios
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/30">
                  These values are mathematical illustrations based on
                  assumed annual return rates. Actual investment returns
                  can be higher or lower and are not guaranteed.
                </p>
              </div>

              <div className="mt-7 grid gap-4 md:grid-cols-3">
                {scenarios.map((scenario, index) => {
                  const gain =
                    scenario.value - totalInvested;

                  return (
                    <div
                      key={scenario.label}
                      className={`rounded-2xl border p-5 ${
                        index === 1
                          ? "border-emerald-500/20 bg-emerald-500/[0.045]"
                          : "border-white/[0.06] bg-white/[0.02]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-white/55">
                          {scenario.label}
                        </p>

                        {index === 1 && (
                          <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                            Illustrative
                          </span>
                        )}
                      </div>

                      <p className="mt-5 text-2xl font-bold">
                        {formatCurrency(scenario.value)}
                      </p>

                      <p className="mt-1 text-xs text-white/25">
                        at {scenario.rate}% assumed annual return
                      </p>

                      <div className="mt-5 border-t border-white/[0.06] pt-4">
                        <div className="flex justify-between text-xs">
                          <span className="text-white/25">
                            Contributions
                          </span>

                          <span className="text-white/55">
                            {formatCurrency(totalInvested)}
                          </span>
                        </div>

                        <div className="mt-2 flex justify-between text-xs">
                          <span className="text-white/25">
                            Illustrative growth
                          </span>

                          <span className="text-emerald-400">
                            +{formatCurrency(gain)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Discovery CTA */}
            <section className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-semibold">
                    Ready to explore actual investment options?
                  </h2>

                  <p className="mt-1 text-sm text-white/30">
                    Wealthly will use reliable investment data to show
                    available schemes and their relevant information.
                  </p>
                </div>

                <button
                  type="button"
                  className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-[#07110D] transition hover:bg-emerald-400"
                >
                  Explore Options
                  <ArrowRight size={17} />
                </button>
              </div>
            </section>

            {/* Disclaimer */}
            <div className="mt-6 flex gap-3 rounded-2xl border border-white/[0.05] bg-white/[0.015] p-4">
              <CircleHelp
                size={17}
                className="mt-0.5 shrink-0 text-white/20"
              />

              <p className="text-xs leading-5 text-white/25">
                Wealthly&apos;s scenario calculations are for
                informational purposes. They do not guarantee returns
                or constitute personalized financial advice. Actual
                investment options, risk classifications, fees and
                performance data will be fetched from reliable data
                sources before being displayed.
              </p>
            </div>
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}