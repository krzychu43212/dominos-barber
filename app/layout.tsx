import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cinzel",
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Dominos Barber",
    template: "%s — Dominos Barber",
  },
  description:
    "Dominos Barber — fryzjer męski w Olszynie. Męski styl, fryzjerstwo i brody z pasją.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`${cinzel.variable} ${inter.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <ScrollReveal />
      </body>
    </html>
  );
}
