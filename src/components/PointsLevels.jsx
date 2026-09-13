import { useTranslation } from "react-i18next";
import { AlertTriangle } from "lucide-react";
import useScrollReveal from "../hooks/useScrollReveal";
import pointsSources from "../data/pointsSources";
import meridianLevels from "../data/meridianLevels";
import levelBenefits from "../data/levelBenefits";

function PointsSourceTag({ sourceKey, Icon, index }) {
  const { t } = useTranslation();
  const [ref, isVisible] = useScrollReveal();

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${index * 80}ms` }}
      className={`reveal flex items-center gap-2.5 rounded-md border border-border-default bg-bg-card px-4 py-2.5 ${
        isVisible ? "reveal-visible" : ""
      }`}
    >
      <Icon className="h-4 w-4 flex-shrink-0 text-gold-primary" strokeWidth={1.75} />
      <span className="text-sm text-text-dim">{t(`pointsLevels.earnPoints.items.${sourceKey}`)}</span>
    </div>
  );
}

function LevelNode({ levelKey, Icon, index, style }) {
  const { t } = useTranslation();
  const [ref, isVisible] = useScrollReveal();

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${index * 120}ms` }}
      className={`reveal grid grid-cols-[3rem_1fr] items-center gap-x-4 gap-y-0 md:grid-cols-1 md:justify-items-center md:gap-y-3 ${
        isVisible ? "reveal-visible" : ""
      }`}
    >
      <div
        className="relative z-10 col-start-1 row-start-1 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border bg-bg-elevated transition-shadow duration-300"
        style={style}
      >
        <Icon className="h-5 w-5" strokeWidth={1.75} style={{ color: style.color }} />
      </div>
      <span className="col-start-2 row-start-1 text-sm font-semibold text-text-main md:col-start-1 md:row-start-2 md:text-center">
        {t(`pointsLevels.levels.tiers.${levelKey}`)}
      </span>
    </div>
  );
}

function EarnPoints() {
  const { t } = useTranslation();
  const [headingRef, headingVisible] = useScrollReveal();

  return (
    <div
      ref={headingRef}
      className={`reveal mx-auto mt-20 max-w-4xl ${headingVisible ? "reveal-visible" : ""}`}
    >
      <h2 className="text-center text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
        {t("pointsLevels.earnPoints.heading")}
      </h2>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {pointsSources.map((source, index) => (
          <PointsSourceTag key={source.key} sourceKey={source.key} Icon={source.Icon} index={index} />
        ))}
      </div>
    </div>
  );
}

function LevelsProgression() {
  const { t } = useTranslation();
  const [headingRef, headingVisible] = useScrollReveal();
  const [lineRef, lineVisible] = useScrollReveal(0.1);

  return (
    <div className="mx-auto mt-24 max-w-5xl">
      <div
        ref={headingRef}
        className={`reveal mx-auto max-w-2xl text-center ${headingVisible ? "reveal-visible" : ""}`}
      >
        <h2 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
          {t("pointsLevels.levels.heading")}
        </h2>
        <p className="mt-5 text-base leading-relaxed text-text-secondary">
          {t("pointsLevels.levels.intro")}
        </p>
      </div>

      <div ref={lineRef} className="relative mt-16">
        <div className="pointer-events-none absolute left-6 top-0 h-full w-px bg-border md:left-[10%] md:right-[10%] md:top-6 md:h-px md:w-auto">
          <div
            className={`h-full w-full origin-top bg-gold-primary/40 transition-transform duration-[1400ms] ease-out md:origin-left ${
              lineVisible ? "scale-y-100 md:scale-x-100" : "scale-y-0 md:scale-x-0"
            }`}
          />
        </div>

        <div className="flex flex-col gap-8 md:grid md:grid-cols-5 md:gap-4">
          {meridianLevels.map((level, index) => (
            <LevelNode
              key={level.key}
              levelKey={level.key}
              Icon={level.Icon}
              index={index}
              style={{
                borderColor: `color-mix(in srgb, ${level.color} ${level.borderOpacity}%, transparent)`,
                backgroundColor: `color-mix(in srgb, ${level.color} ${level.bgOpacity}%, transparent)`,
                boxShadow: level.glow
                  ? `0 0 ${level.glow}px -4px color-mix(in srgb, ${level.color} 65%, transparent)`
                  : "none",
                color: level.color,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function LevelBenefits() {
  const { t } = useTranslation();
  const [ref, isVisible] = useScrollReveal();

  return (
    <div ref={ref} className={`reveal mx-auto mt-24 max-w-4xl ${isVisible ? "reveal-visible" : ""}`}>
      <h2 className="text-center text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
        {t("pointsLevels.benefits.heading")}
      </h2>
      <p className="mx-auto mt-5 max-w-2xl text-center text-base leading-relaxed text-text-secondary">
        {t("pointsLevels.benefits.intro")}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {levelBenefits.map((benefitKey) => (
          <span
            key={benefitKey}
            className="rounded-full border border-border-default bg-bg-card px-4 py-2 text-sm text-text-dim"
          >
            {t(`pointsLevels.benefits.items.${benefitKey}`)}
          </span>
        ))}
      </div>
    </div>
  );
}

function ClarifyingNote() {
  const { t } = useTranslation();
  return (
    <div className="flex items-start gap-3 rounded-md border border-border-default bg-bg-card p-5 text-sm text-text-dim">
      <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" strokeWidth={2} />
      <p>{t("pointsLevels.clarifyingNote")}</p>
    </div>
  );
}

export default function PointsLevels() {
  const { t } = useTranslation();
  const [headingRef, headingVisible] = useScrollReveal();
  const [noteRef, noteVisible] = useScrollReveal();

  return (
    <section id="points-levels" className="relative scroll-mt-20 overflow-hidden px-6 py-24 sm:py-32">
      <div className="relative mx-auto max-w-7xl">
        <div
          ref={headingRef}
          className={`reveal mx-auto max-w-2xl text-center ${headingVisible ? "reveal-visible" : ""}`}
        >
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            {t("pointsLevels.heading")}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-text-secondary">{t("pointsLevels.intro")}</p>
        </div>

        <EarnPoints />
        <LevelsProgression />
        <LevelBenefits />

        <div
          ref={noteRef}
          className={`reveal mx-auto mt-14 max-w-3xl ${noteVisible ? "reveal-visible" : ""}`}
        >
          <ClarifyingNote />
        </div>
      </div>
    </section>
  );
}
