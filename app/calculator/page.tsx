"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Calculator,
  CheckCircle2,
  CircleHelp,
  Coins,
  IndianRupee,
  LineChart,
  PiggyBank,
  RefreshCcw,
  TrendingUp,
} from "lucide-react";

import AppSidebar from "@/components/ui/app-sidebar";
import MobileNav from "@/components/ui/mobile-nav";

type CalculatorMode = "sip" | "lumpsum";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

function calculateSip(
  monthlyAmount: number,
  years: number,
  annualReturn: number
) {
  const months = years * 12;
  const monthlyRate = annualReturn / 100 / 12;

  if (months <= 0) return 0;

  if (monthlyRate === 0) {
    return monthlyAmount * months;
  }

  return (
    monthlyAmount *
    (((1 + monthlyRate) ** months - 1) / monthlyRate) *
    (1 + monthlyRate)
  );
}

function calculateLumpsum(
  amount: number,
  years: number,
  annualReturn: number
) {
  return amount * (1 + annualReturn / 100) ** years;
}

export default function CalculatorPage() {
  const router = useRouter();

  const [mode, setMode] = useState<CalculatorMode>("sip");
  const [investment, setInvestment] = useState("5000");
  const [duration, setDuration] = useState(5);
  const [returnRate, setReturnRate] = useState("12");

  const investmentAmount = Number(investment) || 0;
  const expectedReturn = Number(returnRate) || 0;

  const result = useMemo(() => {
    const finalValue =
      mode === "sip"
        ? calculateSip(
            investmentAmount,
            duration,
            expectedReturn
          )
        : calculateLumpsum(
            investmentAmount,
            duration,
            expectedReturn
          );

    const totalInvested =
      mode === "sip"
        ? investmentAmount * duration * 12
        : investmentAmount;

    const estimatedReturns = Math.max(
      finalValue - totalInvested,
      0
    );

    return {
      finalValue,
      totalInvested,
      estimatedReturns,
    };
  }, [mode, investmentAmount, duration, expectedReturn]);

  const chartData = useMemo(() => {
    return Array.from({ length: duration }, (_, index) => {
      const year = index + 1;

      const value =
        mode === "sip"
          ? calculateSip(
              investmentAmount,
              year,
              expectedReturn
            )
          : calculateLumpsum(
              investmentAmount,
              year,
              expectedReturn
            );

      const invested =
        mode === "sip"
          ? investmentAmount * year * 12
          : investmentAmount;

      return {
        year,
        value,
        invested,
      };
    });
  }, [mode, investmentAmount, duration, expectedReturn]);

  const maxChartValue =
    chartData.length > 0
      ? Math.max(...chartData.map((item) => item.value), 1)
      : 1;

  function resetCalculator() {
    setMode("sip");
    setInvestment("5000");
    setDuration(5);
    setReturnRate("12");
  }

  return (
    <div className="min-h-screen bg-[#07110D] text-white">
      <div className="flex min-h-screen">
        <AppSidebar />

        <main className="min-w-0 flex-1 pb-24 lg:pb-0">
          {/* Header */}
          <header className="flex h-[82px] items-center justify-between border-b border-white/[0.06] px-5 sm:px-8 lg:px-10">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => router.push("/fund-details")}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] text-white/40 transition hover:bg-white/[0.04] hover:text-white"
              >
                <ArrowLeft size={18} />
              </button>

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/25">
                  Tools
                </p>

                <h1 className="mt-1 text-xl font-semibold sm:text-2xl">
                  Investment Calculator
                </h1>
              </div>
            </div>

            <button
              type="button"
              onClick={resetCalculator}
              className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-2 text-xs text-white/40 transition hover:bg-white/[0.05] hover:text-white"
            >
              <RefreshCcw size={15} />
              <span className="hidden sm:inline">
                Reset
              </span>
            </button>
          </header>

          <div className="mx-auto w-full max-w-[1500px] px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
            {/* Intro */}
            <section className="rounded-3xl border border-emerald-500/10 bg-emerald-500/[0.035] p-6 sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-3xl">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                      <Calculator size={21} />
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">
                        Wealthly Calculator
                      </p>

                      <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                        See where your investment could take you.
                      </h2>
                    </div>
                  </div>

                  <p className="mt-5 max-w-2xl text-sm leading-7 text-white/35 sm:text-base">
                    Estimate how your SIP or one-time investment could
                    grow over time using an assumed annual return.
                  </p>
                </div>

                <div className="hidden shrink-0 lg:block">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.05]">
                    <LineChart
                      size={36}
                      strokeWidth={1.5}
                      className="text-emerald-400"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Calculator */}
            <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_430px]">
              {/* Inputs */}
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-7">
                <div>
                  <h2 className="font-semibold">
                    Investment Details
                  </h2>

                  <p className="mt-1 text-xs text-white/25">
                    Change the inputs and the projection updates instantly.
                  </p>
                </div>

                {/* Mode */}
                <div className="mt-7">
                  <label className="text-sm font-medium text-white/55">
                    Investment Type
                  </label>

                  <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-white/[0.025] p-1">
                    <button
                      type="button"
                      onClick={() => setMode("sip")}
                      className={`rounded-lg py-3 text-sm font-medium transition ${
                        mode === "sip"
                          ? "bg-emerald-500 text-[#07110D]"
                          : "text-white/35 hover:text-white"
                      }`}
                    >
                      Monthly SIP
                    </button>

                    <button
                      type="button"
                      onClick={() => setMode("lumpsum")}
                      className={`rounded-lg py-3 text-sm font-medium transition ${
                        mode === "lumpsum"
                          ? "bg-emerald-500 text-[#07110D]"
                          : "text-white/35 hover:text-white"
                      }`}
                    >
                      One-time
                    </button>
                  </div>
                </div>

                {/* Investment */}
                <div className="mt-7">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-white/55">
                      {mode === "sip"
                        ? "Monthly Investment"
                        : "Investment Amount"}
                    </label>

                    <span className="text-xs text-white/20">
                      INR
                    </span>
                  </div>

                  <div className="mt-3 flex items-center rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 focus-within:border-emerald-500/30">
                    <IndianRupee
                      size={17}
                      className="text-white/25"
                    />

                    <input
                      type="number"
                      min="0"
                      value={investment}
                      onChange={(e) =>
                        setInvestment(e.target.value)
                      }
                      className="h-13 w-full bg-transparent px-3 text-lg font-semibold outline-none"
                    />
                  </div>

                  <div className="mt-3 flex gap-2 overflow-x-auto">
                    {(mode === "sip"
                      ? [1000, 2500, 5000, 10000, 25000]
                      : [10000, 25000, 50000, 100000, 500000]
                    ).map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setInvestment(String(value))
                        }
                        className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs transition ${
                          investmentAmount === value
                            ? "bg-emerald-500 text-[#07110D]"
                            : "bg-white/[0.04] text-white/35 hover:text-white"
                        }`}
                      >
                        ₹{value.toLocaleString("en-IN")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div className="mt-8">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-white/55">
                      Investment Duration
                    </label>

                    <span className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-sm font-semibold text-emerald-400">
                      {duration} years
                    </span>
                  </div>

                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={duration}
                    onChange={(e) =>
                      setDuration(Number(e.target.value))
                    }
                    className="mt-5 w-full accent-emerald-500"
                  />

                  <div className="mt-2 flex justify-between text-[11px] text-white/20">
                    <span>1 year</span>
                    <span>15 years</span>
                    <span>30 years</span>
                  </div>

                  <div className="mt-4 grid grid-cols-5 gap-2">
                    {[3, 5, 7, 10, 15].map((year) => (
                      <button
                        key={year}
                        type="button"
                        onClick={() => setDuration(year)}
                        className={`rounded-xl border py-2.5 text-xs transition ${
                          duration === year
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                            : "border-white/[0.07] bg-white/[0.02] text-white/30 hover:text-white"
                        }`}
                      >
                        {year}Y
                      </button>
                    ))}
                  </div>
                </div>

                {/* Return */}
                <div className="mt-8">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-white/55">
                      Expected Annual Return
                    </label>

                    <span className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-sm font-semibold text-emerald-400">
                      {expectedReturn}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="0.5"
                    value={expectedReturn}
                    onChange={(e) =>
                      setReturnRate(e.target.value)
                    }
                    className="mt-5 w-full accent-emerald-500"
                  />

                  <div className="mt-2 flex justify-between text-[11px] text-white/20">
                    <span>1%</span>
                    <span>10%</span>
                    <span>20%</span>
                  </div>

                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {[8, 10, 12, 15].map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() =>
                          setReturnRate(String(rate))
                        }
                        className={`rounded-xl border py-2.5 text-xs transition ${
                          expectedReturn === rate
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                            : "border-white/[0.07] bg-white/[0.02] text-white/30 hover:text-white"
                        }`}
                      >
                        {rate}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notice */}
                <div className="mt-8 flex gap-3 rounded-xl border border-white/[0.05] bg-white/[0.015] p-4">
                  <CircleHelp
                    size={17}
                    className="mt-0.5 shrink-0 text-white/20"
                  />

                  <p className="text-xs leading-5 text-white/25">
                    The expected return is an assumption for calculation
                    only. Actual market-linked investment returns can
                    vary significantly and are not guaranteed.
                  </p>
                </div>
              </div>

              {/* Results */}
              <div className="space-y-6">
                <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.035] p-5 sm:p-7">
                  <div className="flex items-center gap-2">
                    <PiggyBank
                      size={18}
                      className="text-emerald-400"
                    />

                    <p className="text-sm font-medium text-white/55">
                      Estimated Future Value
                    </p>
                  </div>

                  <p className="mt-4 text-4xl font-bold tracking-tight">
                    {formatCurrency(result.finalValue)}
                  </p>

                  <p className="mt-2 text-xs text-white/25">
                    After {duration} years at an assumed{" "}
                    {expectedReturn}% annual return
                  </p>

                  <div className="mt-7 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-white/[0.06] bg-black/10 p-4">
                      <p className="text-xs text-white/25">
                        Invested
                      </p>

                      <p className="mt-2 text-base font-semibold">
                        {formatCurrency(result.totalInvested)}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/[0.06] bg-black/10 p-4">
                      <p className="text-xs text-white/25">
                        Estimated Growth
                      </p>

                      <p className="mt-2 text-base font-semibold text-emerald-400">
                        +{formatCurrency(result.estimatedReturns)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
                  <h2 className="font-semibold">
                    Investment Summary
                  </h2>

                  <div className="mt-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/30">
                        Investment type
                      </span>

                      <span className="text-sm font-medium">
                        {mode === "sip"
                          ? "Monthly SIP"
                          : "One-time"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/30">
                        Investment amount
                      </span>

                      <span className="text-sm font-medium">
                        {formatCurrency(investmentAmount)}
                        {mode === "sip" ? " / month" : ""}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/30">
                        Duration
                      </span>

                      <span className="text-sm font-medium">
                        {duration} years
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/30">
                        Assumed return
                      </span>

                      <span className="text-sm font-medium text-emerald-400">
                        {expectedReturn}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Growth Chart */}
            <section className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-7">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-semibold">
                    Growth Over Time
                  </h2>

                  <p className="mt-1 text-xs text-white/25">
                    Illustrative year-by-year projection.
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs text-white/30">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Projected value
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-white/20" />
                    Invested
                  </div>
                </div>
              </div>

              <div className="mt-8 overflow-x-auto">
                <div className="flex min-w-[600px] items-end gap-2 sm:gap-3">
                  {chartData.map((item) => {
                    const valueHeight =
                      (item.value / maxChartValue) * 100;

                    const investedHeight =
                      (item.invested / maxChartValue) * 100;

                    return (
                      <div
                        key={item.year}
                        className="flex min-w-[28px] flex-1 flex-col items-center"
                      >
                        <div className="relative flex h-52 w-full items-end justify-center gap-1">
                          <div
                            className="w-2.5 rounded-t-md bg-white/[0.12] transition-all"
                            style={{
                              height: `${Math.max(
                                investedHeight,
                                2
                              )}%`,
                            }}
                            title={`Invested: ${formatCurrency(
                              item.invested
                            )}`}
                          />

                          <div
                            className="w-2.5 rounded-t-md bg-emerald-500/60 transition-all"
                            style={{
                              height: `${Math.max(
                                valueHeight,
                                2
                              )}%`,
                            }}
                            title={`Value: ${formatCurrency(
                              item.value
                            )}`}
                          />
                        </div>

                        <span className="mt-3 text-[10px] text-white/20">
                          Y{item.year}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* How it works */}
            <section className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Coins size={18} />
                </div>

                <h3 className="mt-4 font-semibold">
                  1. Choose an amount
                </h3>

                <p className="mt-2 text-xs leading-5 text-white/25">
                  Decide how much you want to invest every month or as a
                  one-time investment.
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <TrendingUp size={18} />
                </div>

                <h3 className="mt-4 font-semibold">
                  2. Set your assumptions
                </h3>

                <p className="mt-2 text-xs leading-5 text-white/25">
                  Select your investment duration and an assumed annual
                  return.
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <CheckCircle2 size={18} />
                </div>

                <h3 className="mt-4 font-semibold">
                  3. See the projection
                </h3>

                <p className="mt-2 text-xs leading-5 text-white/25">
                  Wealthly calculates the illustrative future value and
                  estimated growth instantly.
                </p>
              </div>
            </section>

            {/* Disclaimer */}
            <div className="mt-6 flex gap-3 rounded-2xl border border-white/[0.05] bg-white/[0.015] p-4">
              <CircleHelp
                size={17}
                className="mt-0.5 shrink-0 text-white/20"
              />

              <p className="text-[11px] leading-5 text-white/20">
                This calculator provides illustrative projections only.
                It does not guarantee investment returns. Actual returns
                depend on market conditions and the specific investment
                product. Wealthly is not providing personalized
                financial advice through this calculator.
              </p>
            </div>

            {/* Bottom CTA */}
            <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <h2 className="font-semibold">
                  Want to explore investment options?
                </h2>

                <p className="mt-1 text-sm text-white/25">
                  Use your calculation as a starting point for exploring
                  different investment categories.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  router.push("/investment-discovery")
                }
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-[#07110D] transition hover:bg-emerald-400"
              >
                Explore Investments
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}