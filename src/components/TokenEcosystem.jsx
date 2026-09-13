import { useTranslation } from "react-i18next";
import { AlertTriangle, Hexagon, PieChart, Gift, ArrowRight } from "lucide-react";
import useScrollReveal from "../hooks/useScrollReveal";
import MeridianOrb from "./graphics/MeridianOrb";
import daoPrinciples from "../data/daoPrinciples";

const CONCEPTS = [
  { key: "futureToken", Icon: Hexagon },
  { key: "tokenAllocation", Icon: PieChart },
  { key: "earlyParticipantRewards", Icon: Gift },
];

function DisclaimerBadge() {
  const { t } = useTranslation();

  return (
    <span className="inline-flex items-center gap-2 rounded-md border border-border-default bg-bg-card px-3.5 py-1.5 text-left text-sm font-medium text-text-dim">
      <AlertTriangle className="h-4 w-4 flex-shrink-0" strokeWidth={2} />
      {t("token.disclaimer")}
    </span>
  );
}

function ConceptCard({ conceptKey, Icon, index }) {
  const { t } = useTranslation();
  const [ref, isVisible] = useScrollReveal();

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${index * 120}ms` }}
      className={`gold-card reveal p-5 ${isVisible ? "reveal-visible" : ""}`}
    >
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-gold-primary/20 bg-gold-primary/12 text-gold-primary">
        <Icon className="h-4 w-4" strokeWidth={1.75} />
      </div>
      <h3 className="mt-4 text-base font-semibold text-text-main">
        {t(`token.concepts.${conceptKey}.title`)}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-text-dim">
        {t(`token.concepts.${conceptKey}.description`)}
      </p>
    </div>
  );
}

function DaoCard({ principleKey, Icon, index }) {
  const { t } = useTranslation();
  const [ref, isVisible] = useScrollReveal();

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${index * 120}ms` }}
      className={`gold-card reveal p-5 ${isVisible ? "reveal-visible" : ""}`}
    >
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-gold-primary/20 bg-gold-primary/12 text-gold-primary">
        <Icon className="h-4 w-4" strokeWidth={1.75} />
      </div>
      <h3 className="mt-4 text-base font-semibold text-text-main">
        {t(`token.dao.items.${principleKey}.title`)}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-text-dim">
        {t(`token.dao.items.${principleKey}.description`)}
      </p>
    </div>
  );
}

function DaoSection() {
  const { t } = useTranslation();
  const [headingRef, headingVisible] = useScrollReveal();

  return (
    <div className="mt-16">
      <div
        ref={headingRef}
        className={`reveal mx-auto max-w-2xl text-center ${headingVisible ? "reveal-visible" : ""}`}
      >
        <h2 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
          {t("token.dao.heading")}
        </h2>
        <p className="mt-5 text-base leading-relaxed text-text-secondary">{t("token.dao.intro")}</p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        {daoPrinciples.map((principle, index) => (
          <DaoCard key={principle.key} principleKey={principle.key} Icon={principle.Icon} index={index} />
        ))}
      </div>
    </div>
  );
}

function ConnectionDiagram() {
  const { t } = useTranslation();
  const [ref, isVisible] = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`reveal mx-auto flex max-w-3xl flex-col items-stretch gap-6 sm:flex-row sm:items-center ${
        isVisible ? "reveal-visible" : ""
      }`}
    >
      <div className="gold-card flex-1 px-6 py-6 text-center">
        <p className="text-sm font-semibold text-text-main">{t("token.diagram.current")}</p>
      </div>

      <div className="flex flex-shrink-0 flex-col items-center gap-2 sm:w-28">
        <span className="whitespace-nowrap rounded-sm border border-border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-text-muted">
          {t("token.diagram.planned")}
        </span>
        <div className="h-8 w-px border-l border-dashed border-border-strong sm:h-px sm:w-full sm:border-l-0 sm:border-t" />
        <ArrowRight className="h-4 w-4 rotate-90 text-text-muted sm:rotate-0" strokeWidth={2} />
      </div>

      <div className="flex-1 rounded-md border border-dashed border-border-strong bg-bg-card px-6 py-6 text-center">
        <p className="text-sm font-semibold text-text-main">{t("token.diagram.future")}</p>
      </div>
    </div>
  );
}

export default function TokenEcosystem() {
  const { t } = useTranslation();
  const [introRef, introVisible] = useScrollReveal();

  return (
    <section id="token" className="scroll-mt-20 px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div
          ref={introRef}
          className={`reveal mx-auto max-w-2xl text-center ${introVisible ? "reveal-visible" : ""}`}
        >
          <div className="mb-5 flex justify-center">
            <DisclaimerBadge />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            {t("token.heading")}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-text-secondary">{t("token.intro")}</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {CONCEPTS.map((concept, index) => (
            <ConceptCard key={concept.key} conceptKey={concept.key} Icon={concept.Icon} index={index} />
          ))}
        </div>

        <DaoSection />

        <div className="relative isolate mt-16 overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10 hidden items-center justify-center sm:flex">
            <MeridianOrb size={420} opacity={0.07} speed={190} />
          </div>
          <ConnectionDiagram />
        </div>
      </div>
    </section>
  );
}
