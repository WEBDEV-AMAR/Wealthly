"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  User,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AuthPage() {
  const router = useRouter();

  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function switchMode() {
    setIsSignUp((prev) => !prev);
    setErrorMessage("");
    setSuccessMessage("");
  }

  async function handleAuth() {
    setErrorMessage("");
    setSuccessMessage("");

    if (isSignUp && !fullName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim(),
            },
          },
        });

        if (error) {
          setErrorMessage(error.message);
          return;
        }

        if (data.session) {
          router.push("/dashboard");
          router.refresh();
          return;
        }

        setSuccessMessage(
          "Account created! Check your email to confirm your account."
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          setErrorMessage(error.message);
          return;
        }

        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setErrorMessage(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleAuth() {
    setErrorMessage("");
    setSuccessMessage("");

    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        setErrorMessage(error.message);
      }
    } catch {
      setErrorMessage(
        "Unable to continue with Google right now."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#07110D] text-white">

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute left-1/3 top-1/4 h-[500px] w-[500px] rounded-full bg-emerald-500/[0.08] blur-[140px]" />

        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-emerald-900/10 blur-[130px]" />

      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1400px] px-6 sm:px-10 lg:px-16">

        {/* Desktop branding */}
        <section className="hidden flex-1 items-center lg:flex">

          <div className="max-w-xl">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-lg font-bold text-[#07110D]">
                W
              </div>

              <span className="text-2xl font-bold">
                Wealthly
              </span>

            </div>

            <h1 className="mt-12 text-6xl font-bold leading-[1.05] tracking-tight">
              Your money.
              <span className="block text-emerald-400">
                Your future.
              </span>
            </h1>

            <p className="mt-7 max-w-lg text-lg leading-8 text-white/40">
              Track your finances, build savings, monitor investments and
              make smarter financial decisions — all from one place.
            </p>

            <div className="mt-10 flex items-center gap-3 text-sm text-white/30">
              <div className="h-px w-12 bg-emerald-500/40" />
              Plan Today. A Better Tomorrow.
            </div>

          </div>

        </section>

        {/* Auth */}
        <section className="flex w-full items-center justify-center lg:w-[520px]">

          <div className="w-full max-w-md py-8">

            {/* Mobile Logo */}
            <div className="mb-12 flex items-center gap-3 lg:hidden">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 font-bold text-[#07110D]">
                W
              </div>

              <span className="text-xl font-bold">
                Wealthly
              </span>

            </div>

            {/* Auth card */}
            <div className="rounded-[30px] border border-white/10 bg-white/[0.025] p-6 shadow-2xl shadow-black/20 sm:p-9">

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
                  {isSignUp ? "Get started" : "Welcome back"}
                </p>

                <h1 className="mt-3 text-3xl font-bold tracking-tight">
                  {isSignUp
                    ? "Create your account"
                    : "Welcome back"}
                </h1>

                <p className="mt-3 text-sm leading-6 text-white/40">
                  {isSignUp
                    ? "Start taking control of your money today."
                    : "Sign in to continue your financial journey."}
                </p>

              </div>

              {/* Form */}
              <div className="mt-8 space-y-4">

                {isSignUp && (
                  <div>

                    <label className="mb-2 block text-sm text-white/55">
                      Full name
                    </label>

                    <div className="relative">

                      <User
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                      />

                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your name"
                        disabled={loading}
                        className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-12 pr-4 text-sm outline-none placeholder:text-white/25 focus:border-emerald-500/50 disabled:cursor-not-allowed disabled:opacity-50"
                      />

                    </div>

                  </div>
                )}

                <div>

                  <label className="mb-2 block text-sm text-white/55">
                    Email address
                  </label>

                  <div className="relative">

                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      disabled={loading}
                      className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-12 pr-4 text-sm outline-none placeholder:text-white/25 focus:border-emerald-500/50 disabled:cursor-not-allowed disabled:opacity-50"
                    />

                  </div>

                </div>

                <div>

                  <label className="mb-2 block text-sm text-white/55">
                    Password
                  </label>

                  <div className="relative">

                    <LockKeyhole
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                    />

                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      disabled={loading}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAuth();
                        }
                      }}
                      className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-12 pr-12 text-sm outline-none placeholder:text-white/25 focus:border-emerald-500/50 disabled:cursor-not-allowed disabled:opacity-50"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((prev) => !prev)
                      }
                      disabled={loading}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 transition hover:text-white/70 disabled:opacity-50"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>

                  </div>

                </div>

                {!isSignUp && (
                  <div className="text-right">

                    <button
                      type="button"
                      className="text-xs text-emerald-400 hover:text-emerald-300"
                    >
                      Forgot password?
                    </button>

                  </div>
                )}

                {/* Error */}
                {errorMessage && (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm leading-5 text-red-300">
                    {errorMessage}
                  </div>
                )}

                {/* Success */}
                {successMessage && (
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-3 text-sm leading-5 text-emerald-300">
                    {successMessage}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleAuth}
                  disabled={loading}
                  className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-emerald-500 font-semibold text-[#07110D] transition hover:bg-emerald-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Please wait..."
                    : isSignUp
                      ? "Create Account"
                      : "Sign In"}

                  {!loading && <ArrowRight size={19} />}

                </button>

              </div>

              {/* Divider */}
              <div className="my-7 flex items-center gap-4">

                <div className="h-px flex-1 bg-white/10" />

                <span className="text-xs text-white/25">
                  OR
                </span>

                <div className="h-px flex-1 bg-white/10" />

              </div>

              {/* Google */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="flex h-14 w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-sm font-medium transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Continue with Google
              </button>

              {/* Switch */}
              <div className="mt-7 text-center text-sm text-white/40">

                {isSignUp
                  ? "Already have an account?"
                  : "Don't have an account?"}{" "}

                <button
                  type="button"
                  onClick={switchMode}
                  disabled={loading}
                  className="font-medium text-emerald-400 hover:text-emerald-300 disabled:opacity-50"
                >
                  {isSignUp
                    ? "Sign In"
                    : "Create Account"}
                </button>

              </div>

            </div>

            <p className="mt-6 text-center text-xs text-white/20">
              By continuing, you agree to Wealthly's terms and privacy policy.
            </p>

          </div>

        </section>

      </div>
    </main>
  );
}