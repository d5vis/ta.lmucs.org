import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import localFont from "next/font/local";
import "./globals.css";

import DarkModeProvider from "./components/DarkModeProvider";
import Header from "./components/header/Header";

const metricRegular = localFont({
  src: "./fonts/Metric-Regular.otf",
  variable: "--font-metric-regular",
  weight: "400",
});

const metricBold = localFont({
  src: "./fonts/Metric-Bold.otf",
  variable: "--font-metric-bold",
  weight: "700",
});

export const metadata: Metadata = {
  title: "LMUCS",
  description: "LMU Computer Science",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Analytics />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="#f5f5f5"
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="#171412"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (prefersDarkMode) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${metricRegular.variable} ${metricBold.variable} antialiased font-[family-name:var(--font-metric-regular)] flex flex-col min-h-screen text-center p-4 gap-4`}
      >
        <DarkModeProvider />
        <Header />
        <main className="flex-grow">{children}</main>
        <footer className="mt-auto">
          made with <span className="text-lmucrimson">&lt;3</span> at loyola
          marymount university
        </footer>
      </body>
    </html>
  );
}
