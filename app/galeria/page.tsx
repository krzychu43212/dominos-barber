import type { Metadata } from "next";
import Image from "next/image";
import { galleryItems, instagramUrl } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Galeria",
  description: "Galeria prac — Dominos Barber, fryzjer męski w Olszynie.",
};

export default function GaleriaPage() {
  return (
    <section id="galeria" className="section gallery">
      <div className="container">
        <header className="section-header">
          <p className="eyebrow">Portfolio</p>
          <h1>Moje prace</h1>
          <p className="section-desc">
            Realizacje z mojego Instagrama — kliknij, żeby zobaczyć więcej
          </p>
        </header>

        <div className="gallery-grid">
          {galleryItems.map((item) => (
            <a
              key={item.src}
              href={item.href}
              className="gallery-item"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src={item.src} alt={item.alt} width={480} height={600} />
            </a>
          ))}
        </div>

        <p className="gallery-more">
          <a href={`${instagramUrl}?hl=en`} target="_blank" rel="noopener noreferrer">
            Zobacz więcej na Instagramie →
          </a>
        </p>
      </div>
    </section>
  );
}
