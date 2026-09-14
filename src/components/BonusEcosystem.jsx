import { useTranslation } from "react-i18next";
import { AlertTriangle } from "lucide-react";
import useScrollReveal from "../hooks/useScrollReveal";
import bonusCategories from "../data/bonusCategories";
import dailyWheelSteps from "../data/dailyWheelSteps";
import MeridianWheel from "./graphics/MeridianWheel";
import MeridianOrb from "./graphics/MeridianOrb";

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

function NoteCard({ textKey }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-start gap-3 rounded-md border border-border-default bg-bg-card p-5 text-sm text-text-dim">
      <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" strokeWidth={2} />
      <p>{t(textKey)}</p>
    </div>
  );
}

function StepIconBadge({ Icon }) {
  return (
    <span className="gold-icon-glow relative inline-flex h-14 w-14 items-center justify-center rounded-full border border-gold-primary/25 bg-bg-card text-gold-primary">
      <svg viewBox="0 0 56 56" aria-hidden="true" className="absolute inset-0 h-full w-full">
        <circle
          cx="28"
          cy="28"
          r="25"
          fill="none"
          stroke="var(--color-gold-primary)"
          strokeOpacity="0.4"
          strokeWidth="1"
          strokeDasharray="4 7"
          className="animate-dash"
        />
      </svg>
      <Icon className="relative h-5 w-5" strokeWidth={1.75} />
    </span>
  );
}

function WheelStepCard({ stepKey, Icon, index }) {
  const { t } = useTranslation();
  const [ref, isVisible] = useScrollReveal();

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${index * 120}ms` }}
      className={`gold-card reveal p-6 text-center ${isVisible ? "reveal-visible" : ""}`}
    >
      <span className="gold-corner-dot" aria-hidden="true" />
      <StepIconBadge Icon={Icon} />
      <span className="mt-4 block font-mono text-xs text-gold-primary">0{index + 1}</span>
      <h4 className="mt-1 text-sm font-semibold text-text-main">
        {t(`bonusEcosystem.wheel.steps.${stepKey}.title`)}
      </h4>
      <p className="mt-2 text-sm leading-relaxed text-text-dim">
        {t(`bonusEcosystem.wheel.steps.${stepKey}.description`)}
      </p>
    </div>
  );
}

export default function BonusEcosystem() {
  const { t } = useTranslation();
  const [headingRef, headingVisible] = useScrollReveal();
  const [noteRef, noteVisible] = useScrollReveal();
  const [wheelHeadingRef, wheelHeadingVisible] = useScrollReveal();
  const [wheelDisclaimerRef, wheelDisclaimerVisible] = useScrollReveal();
  const [wheelGraphicRef, wheelGraphicVisible] = useScrollReveal();

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
          <NoteCard textKey="bonusEcosystem.clarifyingNote" />
        </div>

        <div className="mx-auto mt-20 max-w-5xl">
          <div
            ref={wheelHeadingRef}
            className={`reveal mx-auto max-w-2xl text-center ${wheelHeadingVisible ? "reveal-visible" : ""}`}
          >
            <h3 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
              {t("bonusEcosystem.wheel.heading")}
            </h3>
            <p className="mt-4 text-base leading-relaxed text-text-secondary">
              {t("bonusEcosystem.wheel.description")}
            </p>
            <p className="mt-4 text-sm text-text-dim">{t("bonusEcosystem.wheel.note")}</p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {dailyWheelSteps.map((step, index) => (
              <WheelStepCard key={step.key} stepKey={step.key} Icon={step.Icon} index={index} />
            ))}
          </div>

          <div
            ref={wheelDisclaimerRef}
            className={`reveal mx-auto mt-10 max-w-3xl ${wheelDisclaimerVisible ? "reveal-visible" : ""}`}
          >
            <NoteCard textKey="bonusEcosystem.wheel.disclaimer" />
          </div>

          <div
            ref={wheelGraphicRef}
            className={`reveal relative isolate mt-16 flex justify-center ${
              wheelGraphicVisible ? "reveal-visible" : ""
            }`}
          >
            <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
              <MeridianOrb size={420} opacity={0.14} speed={150} />
            </div>
            <MeridianWheel size={320} />
          </div>
        </div>
      </div>
    </section>
  );
}
