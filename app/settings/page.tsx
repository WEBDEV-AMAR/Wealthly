"use client";

import AppSidebar from "@/components/ui/app-sidebar";
import MobileNav from "@/components/ui/mobile-nav";
import {
  Bell,
  ChevronRight,
  CircleHelp,
  CreditCard,
  DollarSign,
  Download,
  Globe,
  KeyRound,
  LogOut,
  Moon,
  Pencil,
  ShieldCheck,
  SlidersHorizontal,
  User,
  Wallet,
} from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [notifications, setNotifications] = useState(true);
  const [monthlySummary, setMonthlySummary] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [currency, setCurrency] = useState("INR");

  const [profile, setProfile] = useState({
    name: "Amarnath",
    email: "amarnath@example.com",
    phone: "+91 98765 43210",
  });

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const sections = [
    {
      id: "profile",
      name: "Profile",
      icon: User,
    },
    {
      id: "preferences",
      name: "Preferences",
      icon: SlidersHorizontal,
    },
    {
      id: "notifications",
      name: "Notifications",
      icon: Bell,
    },
    {
      id: "security",
      name: "Security",
      icon: ShieldCheck,
    },
  ];

  function handleLogout() {
    alert("Logout will be connected to Supabase Auth later.");
  }

  return (
    <div className="min-h-screen bg-[#050A08] text-white">
      <div className="flex min-h-screen">
        <AppSidebar />

        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-[1180px] px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-10">
            {/* Header */}
            <header className="mb-7">
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-emerald-400/60">
                Account
              </p>

              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Profile & Settings
              </h1>

              <p className="mt-1 text-sm text-white/35">
                Manage your Wealthly account and preferences.
              </p>
            </header>

            {/* Profile Hero */}
            <section className="mb-6 overflow-hidden rounded-3xl border border-white/[0.07] bg-[#09110D]">
              <div className="h-24 bg-gradient-to-r from-emerald-500/[0.14] via-emerald-400/[0.04] to-transparent" />

              <div className="-mt-10 flex flex-col gap-5 px-5 pb-5 sm:px-7 sm:pb-7 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex items-end gap-4">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-[#09110D] bg-emerald-500/15 text-2xl font-semibold text-emerald-400">
                    A
                  </div>

                  <div className="pb-1">
                    <h2 className="text-xl font-semibold text-white/90">
                      {profile.name}
                    </h2>

                    <p className="mt-1 text-sm text-white/30">
                      {profile.email}
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span className="text-xs text-emerald-400/70">
                        Personal Account
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowEditProfile(true)}
                  className="flex w-fit items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-2.5 text-sm font-medium text-white/60 transition hover:border-emerald-400/20 hover:bg-emerald-400/[0.04] hover:text-white"
                >
                  <Pencil size={15} />
                  Edit Profile
                </button>
              </div>
            </section>

            {/* Settings Layout */}
            <div className="grid gap-6 lg:grid-cols-[230px_1fr]">
              {/* Settings Navigation */}
              <aside className="h-fit rounded-3xl border border-white/[0.07] bg-[#09110D] p-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const active = activeSection === section.id;

                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => setActiveSection(section.id)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
                        active
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "text-white/40 hover:bg-white/[0.04] hover:text-white"
                      }`}
                    >
                      <Icon size={18} />
                      <span>{section.name}</span>

                      {active && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      )}
                    </button>
                  );
                })}
              </aside>

              {/* Settings Content */}
              <div className="space-y-5">
                {/* Profile */}
                {activeSection === "profile" && (
                  <>
                    <SettingsCard
                      title="Personal Information"
                      description="Your basic account information."
                    >
                      <div className="grid gap-4 sm:grid-cols-2">
                        <InfoField
                          label="Full name"
                          value={profile.name}
                        />

                        <InfoField
                          label="Email address"
                          value={profile.email}
                        />

                        <InfoField
                          label="Phone number"
                          value={profile.phone}
                        />

                        <InfoField
                          label="Account type"
                          value="Personal Account"
                        />
                      </div>
                    </SettingsCard>

                    <SettingsCard
                      title="Financial Preferences"
                      description="Basic preferences used throughout Wealthly."
                    >
                      <div className="space-y-1">
                        <SettingRow
                          icon={DollarSign}
                          title="Default currency"
                          description="Currency used when displaying amounts."
                          right={
                            <select
                              value={currency}
                              onChange={(e) =>
                                setCurrency(e.target.value)
                              }
                              className="rounded-lg border border-white/[0.08] bg-[#0B1712] px-3 py-2 text-xs text-white/70 outline-none"
                            >
                              <option value="INR">INR ₹</option>
                              <option value="USD">USD $</option>
                              <option value="EUR">EUR €</option>
                            </select>
                          }
                        />

                        <SettingRow
                          icon={Wallet}
                          title="Financial tracking"
                          description="Track income, expenses and investments."
                          right={
                            <span className="text-xs text-emerald-400">
                              Enabled
                            </span>
                          }
                        />
                      </div>
                    </SettingsCard>
                  </>
                )}

                {/* Preferences */}
                {activeSection === "preferences" && (
                  <>
                    <SettingsCard
                      title="App Preferences"
                      description="Customize how Wealthly looks and behaves."
                    >
                      <div className="space-y-1">
                        <SettingRow
                          icon={Moon}
                          title="Dark mode"
                          description="Use Wealthly's dark interface."
                          right={
                            <Toggle
                              enabled={darkMode}
                              onChange={() =>
                                setDarkMode((prev) => !prev)
                              }
                            />
                          }
                        />

                        <SettingRow
                          icon={Globe}
                          title="Language"
                          description="Language used throughout the application."
                          right={
                            <span className="text-xs text-white/50">
                              English
                            </span>
                          }
                        />

                        <SettingRow
                          icon={DollarSign}
                          title="Currency"
                          description="Default display currency."
                          right={
                            <span className="text-xs text-white/50">
                              {currency}
                            </span>
                          }
                        />
                      </div>
                    </SettingsCard>

                    <SettingsCard
                      title="Data & Export"
                      description="Take your financial data with you."
                    >
                      <button
                        type="button"
                        className="flex w-full items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-left transition hover:border-emerald-400/15 hover:bg-emerald-400/[0.03]"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04]">
                          <Download
                            size={18}
                            className="text-white/45"
                          />
                        </div>

                        <div className="flex-1">
                          <p className="text-sm font-medium text-white/75">
                            Export financial data
                          </p>

                          <p className="mt-1 text-xs text-white/25">
                            Download your transactions and financial records.
                          </p>
                        </div>

                        <ChevronRight
                          size={17}
                          className="text-white/20"
                        />
                      </button>
                    </SettingsCard>
                  </>
                )}

                {/* Notifications */}
                {activeSection === "notifications" && (
                  <SettingsCard
                    title="Notifications"
                    description="Choose which Wealthly updates you want to receive."
                  >
                    <div className="space-y-1">
                      <SettingRow
                        icon={Bell}
                        title="Push notifications"
                        description="Receive important account and finance updates."
                        right={
                          <Toggle
                            enabled={notifications}
                            onChange={() =>
                              setNotifications((prev) => !prev)
                            }
                          />
                        }
                      />

                      <SettingRow
                        icon={CircleHelp}
                        title="Monthly financial summary"
                        description="Receive a summary of your monthly spending and savings."
                        right={
                          <Toggle
                            enabled={monthlySummary}
                            onChange={() =>
                              setMonthlySummary((prev) => !prev)
                            }
                          />
                        }
                      />

                      <SettingRow
                        icon={CreditCard}
                        title="Subscription reminders"
                        description="Get reminded about upcoming subscription payments."
                        right={<Toggle enabled={true} onChange={() => {}} />}
                      />
                    </div>
                  </SettingsCard>
                )}

                {/* Security */}
                {activeSection === "security" && (
                  <>
                    <SettingsCard
                      title="Account Security"
                      description="Manage your login and account security."
                    >
                      <div className="space-y-1">
                        <SettingRow
                          icon={KeyRound}
                          title="Password"
                          description="Update your account password."
                          right={
                            <button
                              type="button"
                              onClick={() => setShowPassword(true)}
                              className="rounded-lg border border-white/[0.08] px-3 py-2 text-xs text-white/50 transition hover:border-emerald-400/20 hover:text-white"
                            >
                              Change
                            </button>
                          }
                        />

                        <SettingRow
                          icon={ShieldCheck}
                          title="Two-factor authentication"
                          description="Add an extra layer of security."
                          right={
                            <span className="text-xs text-white/25">
                              Coming soon
                            </span>
                          }
                        />
                      </div>
                    </SettingsCard>

                    <SettingsCard
                      title="Account Actions"
                      description="Manage your Wealthly session."
                    >
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-4 rounded-xl border border-red-400/10 bg-red-400/[0.025] p-4 text-left transition hover:border-red-400/20 hover:bg-red-400/[0.05]"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-400/10">
                          <LogOut
                            size={18}
                            className="text-red-400"
                          />
                        </div>

                        <div className="flex-1">
                          <p className="text-sm font-medium text-red-300">
                            Log out
                          </p>

                          <p className="mt-1 text-xs text-white/25">
                            Sign out from this Wealthly account.
                          </p>
                        </div>

                        <ChevronRight
                          size={17}
                          className="text-red-400/30"
                        />
                      </button>
                    </SettingsCard>
                  </>
                )}

                {/* Demo notice */}
                <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.025] p-4">
                  <p className="text-xs leading-5 text-white/30">
                    <span className="font-medium text-emerald-400/70">
                      Demo mode:
                    </span>{" "}
                    Profile changes, authentication, notifications and data
                    export will be connected to Supabase and the Wealthly
                    backend in the next development phase.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <MobileNav />
        </main>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <Modal
          title="Edit Profile"
          onClose={() => setShowEditProfile(false)}
        >
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-xs text-white/35">
                Full name
              </label>

              <input
                value={profile.name}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    name: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/30"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs text-white/35">
                Email
              </label>

              <input
                value={profile.email}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    email: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/30"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs text-white/35">
                Phone
              </label>

              <input
                value={profile.phone}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    phone: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/30"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowEditProfile(false)}
              className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-[#06100B] transition hover:bg-emerald-400"
            >
              Save Changes
            </button>
          </div>
        </Modal>
      )}

      {/* Password Modal */}
      {showPassword && (
        <Modal
          title="Change Password"
          onClose={() => setShowPassword(false)}
        >
          <div className="space-y-4">
            <PasswordInput label="Current password" />
            <PasswordInput label="New password" />
            <PasswordInput label="Confirm new password" />

            <button
              type="button"
              onClick={() => setShowPassword(false)}
              className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-[#06100B] transition hover:bg-emerald-400"
            >
              Update Password
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function SettingsCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/[0.07] bg-[#09110D] p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-white/85">
          {title}
        </h2>

        <p className="mt-1 text-xs text-white/25">
          {description}
        </p>
      </div>

      {children}
    </section>
  );
}

function InfoField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
      <p className="text-[10px] uppercase tracking-[0.15em] text-white/20">
        {label}
      </p>

      <p className="mt-2 truncate text-sm text-white/65">
        {value}
      </p>
    </div>
  );
}

function SettingRow({
  icon: Icon,
  title,
  description,
  right,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  right: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl p-3 transition hover:bg-white/[0.02]">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.035]">
        <Icon size={17} className="text-white/40" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-white/70">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-white/25">
          {description}
        </p>
      </div>

      <div className="shrink-0">{right}</div>
    </div>
  );
}

function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative h-6 w-11 rounded-full transition ${
        enabled ? "bg-emerald-500" : "bg-white/10"
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
          enabled ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-white/[0.08] bg-[#0A1510] p-5 shadow-2xl sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white/90">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-white/30 transition hover:text-white"
          >
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

function PasswordInput({ label }: { label: string }) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label className="mb-2 block text-xs text-white/35">
        {label}
      </label>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          placeholder="••••••••"
          className="w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3 pr-16 text-sm text-white outline-none focus:border-emerald-400/30"
        />

        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/25 hover:text-white/60"
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}