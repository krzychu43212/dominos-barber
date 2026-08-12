import type { Metadata } from "next";
import FaqAccordion from "@/components/FaqAccordion";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Najczęściej zadawane pytania — Dominos Barber, fryzjer męski w Olszynie.",
};

export default function FaqPage() {
  return (
    <section className="page-hero">
      <div className="container">
        <header className="section-header">
          <p className="eyebrow">Pytania</p>
          <h1>FAQ</h1>
          <p className="section-desc">Najczęściej zadawane pytania</p>
        </header>

        <FaqAccordion />
      </div>
    </section>
  );
}
