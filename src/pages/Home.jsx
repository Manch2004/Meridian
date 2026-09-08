import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, KeyRound, Wallet, CheckCircle2, Layers, BarChart3 } from "lucide-react";
import Hero from "../components/Hero";
import useScrollReveal from "../hooks/useScrollReveal";
import technologyPillars from "../data/technologyPillars";

const HOW_IT_WORKS_STEPS = [
  { key: "access", Icon: KeyRound },
  { key: "deposit", Icon: Wallet },
  { key: "confirmation", Icon: CheckCircle2 },
  { key: "units", Icon: Layers },
  { key: "portfolio", Icon: BarChart3 },
];

function SectionHeading({ children }) {
  return (
    <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">{children}</h2>
  );
}

function PreviewLink({ to, children }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-primary transition-colors hover:text-gold-light"
    >
      {children}
      <ArrowRight className="h-4 w-4" strokeWidth={2} />
    </Link>
  );
}

function AboutPreview() {
  const { t } = useTranslation();
  const [ref, isVisible] = useScrollReveal();

  return (
    <section className="scroll-mt-20 px-6 py-12 sm:py-16">
      <div
        ref={ref}
        className={`reveal mx-auto max-w-2xl text-center ${isVisible ? "reveal-visible" : ""}`}
      >
        <SectionHeading>{t("about.heading")}</SectionHeading>
        <p className="mt-6 text-lg leading-relaxed text-text-secondary">{t("home.aboutPreview")}</p>
        <div className="mt-8 flex justify-center">
          <PreviewLink to="/about">{t("common.learnMore")}</PreviewLink>
        </div>
      </div>
    </section>
  );
}

function HowItWorksPreview() {
  const { t } = useTranslation();
  const [ref, isVisible] = useScrollReveal();

  return (
    <section className="scroll-mt-20 px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <div
          ref={ref}
          className={`reveal mx-auto max-w-2xl text-center ${isVisible ? "reveal-visible" : ""}`}
        >
          <SectionHeading>{t("howItWorks.heading")}</SectionHeading>
          <p className="mt-4 text-base text-text-secondary">{t("home.howItWorksPreview")}</p>
        </div>

        <div className="mt-16 flex flex-wrap items-start justify-center gap-10 sm:gap-6">
          {HOW_IT_WORKS_STEPS.map((step) => (
            <div key={step.key} className="flex w-24 flex-col items-center text-center">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-md border border-gold-primary/20 bg-gold-primary/12 text-gold-primary">
                <step.Icon className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-text-primary">
                {t(`howItWorks.steps.${step.key}.title`)}
              </h3>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <PreviewLink to="/how-it-works">{t("common.seeDetails")}</PreviewLink>
        </div>
      </div>
    </section>
  );
}

function TechnologyPreview() {
  const { t } = useTranslation();
  const [ref, isVisible] = useScrollReveal();

  return (
    <section className="scroll-mt-20 px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <div
          ref={ref}
          className={`reveal mx-auto max-w-2xl text-center ${isVisible ? "reveal-visible" : ""}`}
        >
          <SectionHeading>{t("technology.heading")}</SectionHeading>
          <p className="mt-4 text-base text-text-secondary">{t("home.technologyPreview")}</p>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {technologyPillars.map((pillar) => (
            <div key={pillar.key} className="flex flex-col items-center text-center">
              <div className="gold-icon-glow inline-flex h-11 w-11 items-center justify-center rounded-sm border border-gold-primary/20 bg-gold-primary/12 text-gold-primary">
                <pillar.Icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-text-primary">
                {t(`technology.pillars.${pillar.key}.title`)}
              </h3>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <PreviewLink to="/technology">{t("common.learnMore")}</PreviewLink>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <AboutPreview />
      <HowItWorksPreview />
      <TechnologyPreview />
    </>
  );
}
