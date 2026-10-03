import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Wealthly — Finance OS",
    template: "%s | Wealthly",
  },
  description:
    "Wealthly — Plan Today. A Better Tomorrow. Your personal finance operating system.",
  applicationName: "Wealthly",
  generator: "Wealthly",
  keywords: [
    "Wealthly",
    "personal finance",
    "finance tracker",
    "budget",
    "investments",
    "savings",
  ],
  icons: {
    icon: "/wealthly-icon.svg",
    shortcut: "/wealthly-icon.svg",
    apple: "/wealthly-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}