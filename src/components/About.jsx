import { useTranslation } from "react-i18next";
import { Landmark, Network, Users } from "lucide-react";
import useScrollReveal from "../hooks/useScrollReveal";
import MeridianOrb from "./graphics/MeridianOrb";

const PILLARS = [
  { key: "treasury", Icon: Landmark },
  { key: "infrastructure", Icon: Network },
  { key: "participants", Icon: Users },
];

function PillarCard({ pillarKey, Icon, index }) {
  const { t } = useTranslation();
  const [ref, isVisible] = useScrollReveal();

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${index * 120}ms` }}
      className={`gold-card reveal group p-6 ${isVisible ? "reveal-visible" : ""}`}
    >
      <span className="gold-corner-dot" aria-hidden="true" />
      <div className="gold-icon-glow inline-flex h-11 w-11 items-center justify-center rounded-sm border border-gold-primary/20 bg-gold-primary/12 text-gold-primary transition-colors duration-300 group-hover:border-gold-primary/40">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <h3 className="mt-4 text-base font-semibold text-text-main">
        {t(`about.pillars.${pillarKey}.title`)}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-text-dim">
        {t(`about.pillars.${pillarKey}.description`)}
      </p>
    </div>
  );
}

export default function About() {
  const { t } = useTranslation();
  const [introRef, introVisible] = useScrollReveal();

  return (
    <section id="about" className="relative isolate scroll-mt-20 overflow-hidden px-6 py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10 hidden items-center justify-center sm:flex">
        <MeridianOrb size={520} opacity={0.12} speed={160} />
      </div>

      <div className="mx-auto max-w-7xl">
        <div
          ref={introRef}
          className={`reveal mx-auto max-w-2xl text-center ${introVisible ? "reveal-visible" : ""}`}
        >
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            {t("about.heading")}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-text-secondary">{t("about.intro")}</p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {PILLARS.map((pillar, index) => (
            <PillarCard key={pillar.key} pillarKey={pillar.key} Icon={pillar.Icon} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
