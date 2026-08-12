import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Dominos Barber",
  description:
    "Dominos Barber — fryzjer męski w Olszynie. Męski styl, fryzjerstwo i brody z pasją.",
};

export default function HomePage() {
  return (
    <section id="o-mnie" className="section about">
      <div className="container about-grid">
        <figure className="about-photo">
          <Image
            src="/images/dominik.png"
            alt="Dominik — barber, Dominos Barber"
            fill
            sizes="(max-width: 768px) 100vw, 550px"
            style={{ objectFit: "cover", objectPosition: "center 35%" }}
            priority
          />
        </figure>
        <div className="about-content">
          <p className="eyebrow">Barber</p>
          <h1>Cześć, jestem Dominik — barber i założyciel Dominos Barber.</h1>

          <p className="lead">
            Z barberingiem związany jestem już od 4 lat. Przez ten czas nieustannie rozwijam swoje
            umiejętności, poznaję nowe techniki i szukam sposobów, żeby każda fryzura była wykonana
            jeszcze lepiej.
          </p>
          <p>
            W swojej pracy stawiam przede wszystkim na dokładność, indywidualne podejście i
            dopracowane detale. Nie chodzi mi tylko o samo strzyżenie — zależy mi na tym, żeby
            fryzura pasowała do Ciebie, Twojego stylu i kształtu twarzy.
          </p>
          <p>
            Barbering to dla mnie nie tylko praca, ale przede wszystkim pasja i ciągłe dążenie do
            perfekcji. Każdego dnia chcę być lepszy niż wczoraj i zapewniać klientom efekt, z
            którego naprawdę będą zadowoleni.
          </p>
          <p>Wpadnij do Dominos Barber i przekonaj się sam. ✂️</p>
        </div>
      </div>
    </section>
  );
}
