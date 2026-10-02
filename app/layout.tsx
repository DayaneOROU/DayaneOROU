// app/layout.tsx
import type { Metadata } from "next";
import { Montserrat, Geist, Russo_One, Inter } from "next/font/google";
import "./globals.css";
import ThemeWatcher from "@/components/theme-watcher";

const russoOne = Russo_One({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-russo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dayane OROU",
  description: "Dev Portfolio",
  icons: {
    icon: [{ url: "/dayaneorouN.png", sizes: "any" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${russoOne.variable} ${inter.variable}`}>
      <body>
        {/* <ThemeWatcher /> */}
        {children}
      </body>
    </html>
  );
}
