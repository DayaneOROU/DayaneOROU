import type { Metadata } from "next";
import "@/app/globals.css";
import {
  Montserrat,
  Geist,
  Russo_One,
  Inter,
  Bebas_Neue,
} from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-inter",
  display: "swap",
});

const russoOne = Russo_One({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-russo",
  display: "swap",
});

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Dayane OROU",
  description: "Dev Portfolio",
  icons: {
    icon: [{ url: "/logoBeninTravel.png", sizes: "any" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${russoOne.variable} ${montserrat.variable} ${geist.variable} ${inter.variable} ${bebas.variable}`}
    >
      <body className="min-h-screen antialiased  flex flex-col">
        {children}
      </body>
    </html>
  );
}
