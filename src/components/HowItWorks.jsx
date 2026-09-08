import { useTranslation } from "react-i18next";
import { KeyRound, Wallet, CheckCircle2, Layers, BarChart3 } from "lucide-react";
import useScrollReveal from "../hooks/useScrollReveal";

const STEPS = [
  { key: "access", Icon: KeyRound },
  { key: "deposit", Icon: Wallet },
  { key: "confirmation", Icon: CheckCircle2 },
  { key: "units", Icon: Layers },
  { key: "portfolio", Icon: BarChart3 },
];

function Step({ stepKey, Icon, index }) {
  const { t } = useTranslation();
  const [ref, isVisible] = useScrollReveal();

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${index * 120}ms` }}
      className={`reveal relative z-10 flex flex-1 flex-col items-center text-center ${
        isVisible ? "reveal-visible" : ""
      }`}
    >
      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-md border border-gold-primary/20 bg-gold-primary/12 text-gold-primary">
        <Icon className="h-6 w-6" strokeWidth={1.75} />
      </div>
      <span className="mt-4 font-mono text-xs text-gold-primary">0{index + 1}</span>
      <h3 className="mt-2 text-base font-semibold text-text-primary">
        {t(`howItWorks.steps.${stepKey}.title`)}
      </h3>
      <p className="mt-2 max-w-[220px] text-sm leading-relaxed text-text-secondary">
        {t(`howItWorks.steps.${stepKey}.description`)}
      </p>
    </div>
  );
}

export default function HowItWorks() {
  const { t } = useTranslation();
  const [headingRef, headingVisible] = useScrollReveal();
  const [lineRef, lineVisible] = useScrollReveal(0.4);

  return (
    <section id="how-it-works" className="scroll-mt-20 px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div
          ref={headingRef}
          className={`reveal mx-auto max-w-2xl text-center ${headingVisible ? "reveal-visible" : ""}`}
        >
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            {t("howItWorks.heading")}
          </h2>
        </div>

        <div
          ref={lineRef}
          className="relative mt-20 flex flex-col gap-12 md:flex-row md:items-start md:gap-4"
        >
          <div className="pointer-events-none absolute inset-x-0 top-7 hidden h-px bg-border md:block">
            <div
              className={`h-full bg-gold-primary transition-transform duration-[1400ms] ease-out ${
                lineVisible ? "scale-x-100" : "scale-x-0"
              }`}
              style={{ transformOrigin: "left" }}
            />
          </div>

          {STEPS.map((step, index) => (
            <Step key={step.key} stepKey={step.key} Icon={step.Icon} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
