"use client";

import AppSidebar from "@/components/ui/app-sidebar";
import MobileNav from "@/components/ui/mobile-nav";
import {
  ArrowUp,
  Bot,
  Brain,
  ChevronRight,
  CircleDollarSign,
  Lightbulb,
  Mic,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useState } from "react";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  type?: "text" | "spending" | "savings";
};

const suggestions = [
  {
    icon: TrendingDown,
    text: "Where did I spend the most?",
  },
  {
    icon: Wallet,
    text: "How much can I save this month?",
  },
  {
    icon: TrendingUp,
    text: "How is my portfolio doing?",
  },
  {
    icon: CircleDollarSign,
    text: "Add ₹450 dinner expense",
  },
];

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content:
      "Hey Amarnath 👋 I'm your Wealthly AI Assistant. I can help you understand your spending, savings, investments and goals.",
  },
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  function generateResponse(text: string) {
    const lower = text.toLowerCase();

    if (
      lower.includes("spend") ||
      lower.includes("expense") ||
      lower.includes("spent")
    ) {
      return {
        content:
          "Based on your current Wealthly data, your biggest spending area is Housing/Rent, followed by Food and Shopping. Your monthly tracked expenses are around ₹18,640.",
        type: "spending" as const,
      };
    }

    if (
      lower.includes("save") ||
      lower.includes("saving") ||
      lower.includes("savings")
    ) {
      return {
        content:
          "Your current monthly income is ₹25,000 and tracked expenses are around ₹18,640. That leaves approximately ₹6,360 before considering any untracked expenses.",
        type: "savings" as const,
      };
    }

    if (
      lower.includes("portfolio") ||
      lower.includes("investment") ||
      lower.includes("investments")
    ) {
      return {
        content:
          "Your demo portfolio currently has ₹60,500 invested and a current value of approximately ₹65,765. That's an illustrative gain of ₹5,265. Your portfolio currently contains index, hybrid, gold and liquid-fund positions.",
        type: "text" as const,
      };
    }

    if (
      lower.includes("450") ||
      lower.includes("dinner") ||
      lower.includes("add")
    ) {
      return {
        content:
          "I understood this as a ₹450 dinner expense. In the full version, I would show the parsed transaction details and ask for confirmation before saving it to your account.",
        type: "text" as const,
      };
    }

    return {
      content:
        "I can help you analyze your Wealthly data. Try asking about your spending, savings, investments, budget or goals. In the production version, I'll use your actual financial data through the Wealthly backend.",
      type: "text" as const,
    };
  }

  function sendMessage(customText?: string) {
    const text = (customText ?? input).trim();

    if (!text || isThinking) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    setTimeout(() => {
      const response = generateResponse(text);

      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: response.content,
        type: response.type,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsThinking(false);
    }, 700);
  }

  return (
    <div className="min-h-screen bg-[#050A08] text-white">
      <div className="flex min-h-screen">
        <AppSidebar />

        <main className="min-w-0 flex-1">
          <div className="mx-auto flex min-h-screen w-full max-w-[1180px] flex-col px-4 pb-24 pt-5 sm:px-6 lg:px-8 lg:pb-8">
            {/* Header */}
            <header className="mb-6 flex items-center justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10">
                    <Bot size={19} className="text-emerald-400" />
                  </div>

                  <span className="text-xs font-medium uppercase tracking-[0.16em] text-emerald-400/70">
                    Wealthly AI
                  </span>
                </div>

                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  AI Finance Assistant
                </h1>

                <p className="mt-1 text-sm text-white/35">
                  Ask anything about your money.
                </p>
              </div>

              <div className="hidden items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/[0.04] px-3 py-2 sm:flex">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-xs text-white/40">
                  AI ready
                </span>
              </div>
            </header>

            {/* Main Chat Layout */}
            <div className="grid flex-1 gap-5 lg:grid-cols-[1fr_300px]">
              {/* Chat */}
              <section className="flex min-h-[650px] flex-col overflow-hidden rounded-3xl border border-white/[0.07] bg-[#09110D]">
                {/* Chat header */}
                <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                      <Sparkles
                        size={18}
                        className="text-emerald-400"
                      />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-white/85">
                        Wealthly Assistant
                      </p>
                      <p className="text-[11px] text-white/25">
                        Personal finance companion
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="text-xs text-white/30">
                      Online
                    </span>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 space-y-5 overflow-y-auto px-4 py-6 sm:px-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                          <Bot
                            size={16}
                            className="text-emerald-400"
                          />
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                          message.role === "user"
                            ? "rounded-br-md bg-emerald-500 text-[#06100B]"
                            : "rounded-bl-md border border-white/[0.06] bg-white/[0.025] text-white/65"
                        }`}
                      >
                        {message.content}

                        {message.type === "spending" && (
                          <div className="mt-4 grid grid-cols-2 gap-2">
                            <div className="rounded-xl border border-white/[0.06] bg-black/10 p-3">
                              <p className="text-[10px] uppercase tracking-wider text-white/25">
                                Expenses
                              </p>
                              <p className="mt-1 text-lg font-semibold text-white/85">
                                ₹18,640
                              </p>
                            </div>

                            <div className="rounded-xl border border-white/[0.06] bg-black/10 p-3">
                              <p className="text-[10px] uppercase tracking-wider text-white/25">
                                Remaining
                              </p>
                              <p className="mt-1 text-lg font-semibold text-emerald-400">
                                ₹6,360
                              </p>
                            </div>
                          </div>
                        )}

                        {message.type === "savings" && (
                          <div className="mt-4 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.04] p-3">
                            <div className="flex items-center gap-2">
                              <TrendingUp
                                size={15}
                                className="text-emerald-400"
                              />
                              <span className="text-xs font-medium text-emerald-300">
                                Monthly saving potential
                              </span>
                            </div>

                            <p className="mt-2 text-xl font-semibold text-white">
                              ₹6,360
                            </p>

                            <p className="mt-1 text-[11px] text-white/30">
                              Based on currently tracked income and expenses.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {isThinking && (
                    <div className="flex items-start">
                      <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10">
                        <Bot
                          size={16}
                          className="text-emerald-400"
                        />
                      </div>

                      <div className="rounded-2xl rounded-bl-md border border-white/[0.06] bg-white/[0.025] px-4 py-3">
                        <div className="flex gap-1.5">
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/30" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/30 [animation-delay:150ms]" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/30 [animation-delay:300ms]" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="border-t border-white/[0.06] p-4">
                  <div className="flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-black/20 p-2 focus-within:border-emerald-400/30">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          sendMessage();
                        }
                      }}
                      placeholder="Ask about your finances..."
                      className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-white/20"
                    />

                    <button
                      type="button"
                      className="hidden h-10 w-10 items-center justify-center rounded-xl text-white/25 transition hover:bg-white/[0.04] hover:text-white/60 sm:flex"
                      title="Voice input"
                    >
                      <Mic size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={() => sendMessage()}
                      disabled={!input.trim() || isThinking}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-[#06100B] transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <ArrowUp size={18} strokeWidth={2.5} />
                    </button>
                  </div>

                  <p className="mt-2 text-center text-[10px] text-white/15">
                    Wealthly AI provides financial insights for informational
                    purposes.
                  </p>
                </div>
              </section>

              {/* Suggestions / Insights */}
              <aside className="space-y-4">
                {/* Suggested prompts */}
                <div className="rounded-3xl border border-white/[0.07] bg-[#09110D] p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <Lightbulb
                      size={16}
                      className="text-emerald-400"
                    />

                    <h2 className="text-sm font-medium text-white/80">
                      Try asking
                    </h2>
                  </div>

                  <div className="space-y-2">
                    {suggestions.map((item) => {
                      const Icon = item.icon;

                      return (
                        <button
                          key={item.text}
                          type="button"
                          onClick={() => sendMessage(item.text)}
                          className="group flex w-full items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3 text-left transition hover:border-emerald-400/15 hover:bg-emerald-400/[0.04]"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                            <Icon
                              size={15}
                              className="text-white/35 transition group-hover:text-emerald-400"
                            />
                          </div>

                          <span className="flex-1 text-xs text-white/45 group-hover:text-white/70">
                            {item.text}
                          </span>

                          <ChevronRight
                            size={14}
                            className="text-white/15 transition group-hover:translate-x-0.5 group-hover:text-emerald-400"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Financial Snapshot */}
                <div className="rounded-3xl border border-white/[0.07] bg-[#09110D] p-5">
                  <div className="mb-5 flex items-center gap-2">
                    <Brain
                      size={16}
                      className="text-emerald-400"
                    />

                    <h2 className="text-sm font-medium text-white/80">
                      Financial Snapshot
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/30">
                          Monthly income
                        </span>

                        <span className="text-sm font-medium text-white/75">
                          ₹25,000
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/30">
                          Monthly expenses
                        </span>

                        <span className="text-sm font-medium text-white/75">
                          ₹18,640
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/30">
                          Savings rate
                        </span>

                        <span className="text-sm font-medium text-emerald-400">
                          25.4%
                        </span>
                      </div>

                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                        <div className="h-full w-[25.4%] rounded-full bg-emerald-500" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Status */}
                <div className="rounded-3xl border border-emerald-400/10 bg-emerald-400/[0.035] p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10">
                      <Sparkles
                        size={17}
                        className="text-emerald-400"
                      />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-white/75">
                        Smarter with your data
                      </p>

                      <p className="mt-1 text-xs leading-5 text-white/30">
                        Once connected to your Wealthly account, the assistant
                        can analyze your actual transactions, budgets, goals
                        and investments.
                      </p>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>

          <MobileNav />
        </main>
      </div>
    </div>
  );
}