"use client";

import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronLeft,
  PiggyBank,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const steps = [
  {
    icon: BarChart3,
    title: "Understand your money",
    description:
      "Track your income, expenses and spending habits in one simple place.",
  },
  {
    icon: PiggyBank,
    title: "Build better habits",
    description:
      "Create budgets, savings goals and stay in control of your financial future.",
  },
  {
    icon: Sparkles,
    title: "Make smarter decisions",
    description:
      "Use Wealthly's insights to understand your finances and plan what comes next.",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const step = steps[currentStep];
  const Icon = step.icon;

  const isLastStep = currentStep === steps.length - 1;

  function handleContinue() {
    if (isLastStep) {
      router.push("/auth");
      return;
    }

    setCurrentStep((prev) => prev + 1);
  }

  function handleBack() {
    if (currentStep === 0) return;

    setCurrentStep((prev) => prev - 1);
  }

  function handleSkip() {
    router.push("/auth");
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050A08] text-white">
      <div className="relative flex min-h-screen">
        {/* Background Glow */}
        <div className="pointer-events-none absolute left-1/2 top-[-220px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-emerald-500/[0.08] blur-[130px]" />

        <div className="relative mx-auto flex min-h-screen w-full max-w-[1280px] flex-col px-5 py-5 sm:px-8 lg:px-10">
          {/* Top Bar */}
          <header className="flex items-center justify-between">
            {/* Wealthly Logo */}
            <button
              type="button"
              onClick={() => router.push("/")}
              className="group flex items-center gap-3"
            >
              {/* Logo Mark */}
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 transition group-hover:bg-emerald-400">
                <svg
                  width="27"
                  height="27"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 18L22 44L28 29L32 40L38 18"
                    stroke="#06100B"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M38 18L43 35L48 18"
                    stroke="#06100B"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="text-left">
                <p className="text-lg font-bold tracking-tight text-white">
                  Wealthly
                </p>

                <p className="text-[9px] uppercase tracking-[0.2em] text-white/25">
                  Finance OS
                </p>
              </div>
            </button>

            {/* Skip */}
            <button
              type="button"
              onClick={handleSkip}
              className="rounded-lg px-3 py-2 text-sm text-white/30 transition hover:bg-white/[0.04] hover:text-white/60"
            >
              Skip
            </button>
          </header>

          {/* Main */}
          <div className="flex flex-1 items-center justify-center">
            <div className="grid w-full max-w-[1050px] items-center gap-12 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
              {/* Left Visual */}
              <div className="relative flex justify-center">
                <div className="relative flex h-[300px] w-[300px] items-center justify-center sm:h-[380px] sm:w-[380px]">
                  {/* Outer Glow */}
                  <div className="absolute inset-8 rounded-full bg-emerald-500/[0.06] blur-3xl" />

                  {/* Outer Ring */}
                  <div className="absolute inset-8 rounded-full border border-emerald-400/10" />

                  {/* Inner Ring */}
                  <div className="absolute inset-16 rounded-full border border-white/[0.05]" />

                  {/* Logo Container */}
                  <div className="relative flex h-32 w-32 items-center justify-center rounded-[30px] border border-emerald-400/20 bg-[#0A1510] shadow-2xl shadow-emerald-500/10 sm:h-40 sm:w-40">
                    <div className="absolute inset-0 rounded-[30px] bg-emerald-500/[0.04]" />

                    <svg
                      className="relative h-20 w-20 sm:h-24 sm:w-24"
                      viewBox="0 0 64 64"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16 18L22 44L28 29L32 40L38 18"
                        stroke="#34D399"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      <path
                        d="M38 18L43 35L48 18"
                        stroke="#34D399"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  {/* Floating Icon */}
                  <div className="absolute right-3 top-10 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#0B1712] shadow-xl sm:right-5">
                    <Icon
                      key={currentStep}
                      size={20}
                      className="text-emerald-400"
                    />
                  </div>

                  {/* Decorative dots */}
                  <div className="absolute bottom-10 left-8 h-2 w-2 rounded-full bg-emerald-400/50" />
                  <div className="absolute right-16 bottom-3 h-1.5 w-1.5 rounded-full bg-white/20" />
                  <div className="absolute left-16 top-8 h-1.5 w-1.5 rounded-full bg-emerald-400/30" />
                </div>
              </div>

              {/* Right Content */}
              <div className="max-w-[560px]">
                {/* Step */}
                <div className="mb-5 flex items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400/60">
                    Step {currentStep + 1} of {steps.length}
                  </span>

                  <div className="h-px w-10 bg-white/[0.08]" />
                </div>

                {/* Heading */}
                <h1 className="max-w-[540px] text-4xl font-semibold leading-[1.08] tracking-[-0.03em] text-white sm:text-5xl lg:text-[54px]">
                  {step.title}
                </h1>

                <p className="mt-5 max-w-[480px] text-base leading-7 text-white/40 sm:text-lg">
                  {step.description}
                </p>

                {/* Feature Pills */}
                <div className="mt-7 flex flex-wrap gap-2">
                  {currentStep === 0 && (
                    <>
                      <FeaturePill text="Income tracking" />
                      <FeaturePill text="Expense tracking" />
                      <FeaturePill text="Analytics" />
                    </>
                  )}

                  {currentStep === 1 && (
                    <>
                      <FeaturePill text="Budgets" />
                      <FeaturePill text="Savings goals" />
                      <FeaturePill text="Subscriptions" />
                    </>
                  )}

                  {currentStep === 2 && (
                    <>
                      <FeaturePill text="AI insights" />
                      <FeaturePill text="Investments" />
                      <FeaturePill text="Smart planning" />
                    </>
                  )}
                </div>

                {/* Progress */}
                <div className="mt-9 flex items-center gap-2">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        index === currentStep
                          ? "w-9 bg-emerald-400"
                          : index < currentStep
                            ? "w-5 bg-emerald-400/40"
                            : "w-5 bg-white/10"
                      }`}
                    />
                  ))}
                </div>

                {/* Buttons */}
                <div className="mt-8 flex items-center gap-3">
                  {currentStep > 0 && (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex h-12 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 text-sm font-medium text-white/50 transition hover:border-white/[0.14] hover:bg-white/[0.04] hover:text-white"
                    >
                      <ChevronLeft size={17} />
                      Back
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleContinue}
                    className="group flex h-12 items-center gap-3 rounded-xl bg-emerald-500 px-6 text-sm font-semibold text-[#06100B] transition hover:bg-emerald-400"
                  >
                    {isLastStep ? "Get Started" : "Continue"}

                    {isLastStep ? (
                      <Check size={17} />
                    ) : (
                      <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <footer className="flex flex-col items-center justify-between gap-3 border-t border-white/[0.05] pt-5 text-[11px] text-white/20 sm:flex-row">
            <p>Plan Today. A Better Tomorrow.</p>

            <p>© 2026 Wealthly</p>
          </footer>
        </div>
      </div>
    </main>
  );
}

function FeaturePill({ text }: { text: string }) {
  return (
    <span className="rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-[11px] text-white/30">
      {text}
    </span>
  );
}