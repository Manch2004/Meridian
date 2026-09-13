import { useTranslation } from "react-i18next";
import { AlertTriangle } from "lucide-react";
import useScrollReveal from "../hooks/useScrollReveal";
import bonusCategories from "../data/bonusCategories";
import MeridianWheel from "./graphics/MeridianWheel";

function BonusCard({ categoryKey, Icon, index }) {
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
        {t(`bonusEcosystem.categories.${categoryKey}.title`)}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-text-dim">
        {t(`bonusEcosystem.categories.${categoryKey}.description`)}
      </p>
    </div>
  );
}

function ClarifyingNote() {
  const { t } = useTranslation();
  return (
    <div className="flex items-start gap-3 rounded-md border border-border-default bg-bg-card p-5 text-sm text-text-dim">
      <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" strokeWidth={2} />
      <p>{t("bonusEcosystem.clarifyingNote")}</p>
    </div>
  );
}

export default function BonusEcosystem() {
  const { t } = useTranslation();
  const [headingRef, headingVisible] = useScrollReveal();
  const [noteRef, noteVisible] = useScrollReveal();
  const [wheelRef, wheelVisible] = useScrollReveal();

  return (
    <section id="bonus-ecosystem" className="relative scroll-mt-20 overflow-hidden px-6 py-24 sm:py-32">
      <div className="relative mx-auto max-w-7xl">
        <div
          ref={headingRef}
          className={`reveal mx-auto max-w-2xl text-center ${headingVisible ? "reveal-visible" : ""}`}
        >
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            {t("bonusEcosystem.heading")}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-text-secondary">{t("bonusEcosystem.intro")}</p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {bonusCategories.map((category, index) => (
            <BonusCard key={category.key} categoryKey={category.key} Icon={category.Icon} index={index} />
          ))}
        </div>

        <div
          ref={noteRef}
          className={`reveal mx-auto mt-10 max-w-3xl ${noteVisible ? "reveal-visible" : ""}`}
        >
          <ClarifyingNote />
        </div>

        <div
          ref={wheelRef}
          className={`reveal mx-auto mt-20 grid max-w-5xl grid-cols-1 items-center gap-12 lg:grid-cols-2 ${
            wheelVisible ? "reveal-visible" : ""
          }`}
        >
          <div className="text-center lg:text-left">
            <h3 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
              {t("bonusEcosystem.wheel.heading")}
            </h3>
            <p className="mt-4 text-base leading-relaxed text-text-secondary">
              {t("bonusEcosystem.wheel.description")}
            </p>
            <p className="mt-4 text-sm text-text-dim">{t("bonusEcosystem.wheel.note")}</p>
          </div>

          <div className="flex justify-center">
            <MeridianWheel size={320} />
          </div>
        </div>
      </div>
    </section>
  );
}
