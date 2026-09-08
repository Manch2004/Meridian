import { useTranslation } from "react-i18next";
import useScrollReveal from "../hooks/useScrollReveal";
import technologyPillars from "../data/technologyPillars";
import MeridianOrb from "./graphics/MeridianOrb";

function PillarCard({ pillarKey, Icon, index }) {
  const { t } = useTranslation();
  const [ref, isVisible] = useScrollReveal();

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${index * 120}ms` }}
      className={`glass-card reveal group p-6 transition-all duration-300 hover:shadow-[0_0_32px_-12px_rgba(61,90,254,0.45)] ${
        isVisible ? "reveal-visible" : ""
      }`}
    >
      <span className="card-corner-dot" aria-hidden="true" />
      <div className="card-icon-glow inline-flex h-11 w-11 items-center justify-center rounded-sm border border-border bg-accent-soft text-accent transition-colors duration-300 group-hover:border-accent/50">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <h3 className="mt-4 text-base font-semibold text-text-primary">
        {t(`technology.pillars.${pillarKey}.title`)}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">
        {t(`technology.pillars.${pillarKey}.description`)}
      </p>
    </div>
  );
}

export default function Technology() {
  const { t } = useTranslation();
  const [introRef, introVisible] = useScrollReveal();

  return (
    <section id="technology" className="relative isolate scroll-mt-20 overflow-hidden px-6 py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10 hidden items-center justify-center sm:flex">
        <MeridianOrb variant="network" size={480} opacity={0.14} speed={110} />
      </div>

      <div className="mx-auto max-w-7xl">
        <div
          ref={introRef}
          className={`reveal mx-auto max-w-2xl text-center ${introVisible ? "reveal-visible" : ""}`}
        >
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            {t("technology.heading")}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-text-secondary">{t("technology.intro")}</p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {technologyPillars.map((pillar, index) => (
            <PillarCard key={pillar.key} pillarKey={pillar.key} Icon={pillar.Icon} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
