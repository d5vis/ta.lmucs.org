import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
      <body
        className={`${metricRegular.variable} ${metricBold.variable} antialiased font-[family-name:var(--font-metric-regular)] flex flex-col min-h-screen text-center p-4 gap-4`}
      >
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
