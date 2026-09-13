import { useTranslation } from "react-i18next";
import useScrollReveal from "../hooks/useScrollReveal";
import roadmapPhases from "../data/roadmapPhases";

function PhaseRow({ phase, index }) {
  const { t } = useTranslation();
  const [ref, isVisible] = useScrollReveal();
  const isLeft = index % 2 === 0;
  const Icon = phase.Icon;

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${index * 120}ms` }}
      className={`reveal grid grid-cols-[3rem_1fr] items-start gap-x-6 gap-y-0 md:grid-cols-[1fr_3rem_1fr] md:items-center md:gap-x-10 ${
        isVisible ? "reveal-visible" : ""
      }`}
    >
      <div className="relative z-10 col-start-1 row-start-1 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-gold-primary/20 bg-gold-primary/12 text-gold-primary md:col-start-2">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </div>

      <span className="col-start-1 row-start-2 mt-2 text-center font-mono text-xs text-text-muted md:col-start-2">
        0{index + 1}
      </span>

      <div
        className={`col-start-2 row-start-1 row-span-2 pb-10 md:row-span-1 md:pb-0 ${
          isLeft
            ? "md:col-start-1 md:row-start-1 md:text-right"
            : "md:col-start-3 md:row-start-1 md:text-left"
        }`}
      >
        <div className="gold-card inline-block w-full p-6 text-left">
          <h3 className="text-base font-semibold text-text-main">
            {t(`roadmap.phases.${phase.key}.title`)}
          </h3>
          <ul className={`mt-4 flex flex-wrap gap-2 ${isLeft ? "md:justify-end" : "md:justify-start"}`}>
            {phase.items.map((itemKey) => (
              <li
                key={itemKey}
                className="rounded-full border border-border-default bg-bg-card px-3 py-1 text-xs text-text-dim"
              >
                {t(`roadmap.phases.${phase.key}.items.${itemKey}`)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function Roadmap() {
  const { t } = useTranslation();
  const [introRef, introVisible] = useScrollReveal();
  const [lineRef, lineVisible] = useScrollReveal(0.1);

  return (
    <section id="roadmap" className="scroll-mt-20 px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div
          ref={introRef}
          className={`reveal mx-auto max-w-2xl text-center ${introVisible ? "reveal-visible" : ""}`}
        >
          <h2 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            {t("roadmap.heading")}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-text-secondary">{t("roadmap.intro")}</p>
        </div>

        <div ref={lineRef} className="relative mt-16">
          <div className="pointer-events-none absolute left-6 top-0 h-full w-px bg-border md:left-1/2 md:-translate-x-1/2">
            <div
              className={`w-full origin-top bg-gold-primary/50 transition-transform duration-[1400ms] ease-out ${
                lineVisible ? "h-full scale-y-100" : "h-full scale-y-0"
              }`}
            />
          </div>

          <div className="flex flex-col gap-10 md:gap-4">
            {roadmapPhases.map((phase, index) => (
              <PhaseRow key={phase.key} phase={phase} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
