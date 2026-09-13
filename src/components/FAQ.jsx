import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, AlertTriangle } from "lucide-react";
import useScrollReveal from "../hooks/useScrollReveal";
import faqItems from "../data/faqItems";
import riskCategories from "../data/riskCategories";

function FAQItem({ item, index, isOpen, onToggle }) {
  const { t } = useTranslation();
  const [ref, isVisible] = useScrollReveal();

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${index * 120}ms` }}
      className={`gold-card reveal overflow-hidden ${isOpen ? "is-active" : ""} ${
        isVisible ? "reveal-visible" : ""
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="text-base font-semibold text-text-main">
          {t(`faq.items.${item.key}.question`)}
        </span>
        <ChevronDown
          className={`h-5 w-5 flex-shrink-0 transition-all duration-300 ${
            isOpen ? "rotate-180 text-gold-primary" : "text-text-dim"
          }`}
          strokeWidth={1.75}
        />
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-5 text-sm leading-relaxed text-text-dim">
            {t(`faq.items.${item.key}.answer`)}
          </p>
        </div>
      </div>
    </div>
  );
}

function RiskDisclosure() {
  const { t } = useTranslation();
  const [ref, isVisible] = useScrollReveal();

  return (
    <div
      id="risk-disclosure"
      ref={ref}
      className={`reveal mt-20 scroll-mt-24 border-t border-border-default pt-14 ${
        isVisible ? "reveal-visible" : ""
      }`}
    >
      <div className="flex items-start gap-3 rounded-md border border-border-default bg-bg-card p-5">
        <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-text-dim" strokeWidth={2} />
        <div>
          <h2 className="text-lg font-semibold text-text-main">{t("faq.risk.heading")}</h2>
          <p className="mt-2 text-sm leading-relaxed text-text-dim">{t("faq.risk.intro")}</p>
        </div>
      </div>

      <ul className="mt-6 flex flex-wrap gap-2">
        {riskCategories.map((key) => (
          <li
            key={key}
            className="rounded-full border border-border-default bg-bg-secondary px-3 py-1.5 text-xs text-text-dim"
          >
            {t(`faq.risk.categories.${key}`)}
          </li>
        ))}
      </ul>

      <p className="mt-6 text-sm leading-relaxed text-text-muted">{t("faq.risk.closing")}</p>
    </div>
  );
}

export default function FAQ() {
  const { t } = useTranslation();
  const [introRef, introVisible] = useScrollReveal();
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="scroll-mt-20 px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <div
          ref={introRef}
          className={`reveal text-center ${introVisible ? "reveal-visible" : ""}`}
        >
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            {t("faq.heading")}
          </h2>
        </div>

        <div className="mt-16 flex flex-col gap-4">
          {faqItems.map((item, index) => (
            <FAQItem
              key={item.key}
              item={item}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex((current) => (current === index ? null : index))}
            />
          ))}
        </div>

        <RiskDisclosure />
      </div>
    </section>
  );
}
