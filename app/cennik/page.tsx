import type { Metadata } from "next";
import { priceItems } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Cennik",
  description: "Cennik usług — Dominos Barber, fryzjer męski w Olszynie.",
};

export default function CennikPage() {
  return (
    <section className="page-hero">
      <div className="container">
        <header className="section-header">
          <p className="eyebrow">Usługi</p>
          <h1>Cennik</h1>
          <p className="section-desc">Aktualne ceny usług fryzjerskich</p>
        </header>

        <ul className="price-list">
          {priceItems.map((item) => (
            <li key={item.name} className="price-item">
              <span className="price-name">{item.name}</span>
              <span className="price-dots" aria-hidden="true" />
              <span className="price-amount">{item.amount}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
