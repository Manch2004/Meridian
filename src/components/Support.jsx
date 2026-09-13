import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, Ticket } from "lucide-react";
import useScrollReveal from "../hooks/useScrollReveal";
import SecurityNotice from "./SecurityNotice";
import SupportFaq from "./SupportFaq";
import { TELEGRAM_URL } from "../config/links";

export default function Support() {
  const { t } = useTranslation();
  const [introRef, introVisible] = useScrollReveal();
  const [ticketCtaRef, ticketCtaVisible] = useScrollReveal();
  const [telegramRef, telegramVisible] = useScrollReveal();

  return (
    <section id="support" className="scroll-mt-20 px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <div ref={introRef} className={`reveal text-center ${introVisible ? "reveal-visible" : ""}`}>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            {t("support.heading")}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-text-secondary">{t("support.intro")}</p>
        </div>

        <SecurityNotice className="mt-8" />

        <div className="mt-12">
          <SupportFaq />
        </div>

        <div
          ref={ticketCtaRef}
          className={`reveal mt-12 flex flex-col items-center gap-4 rounded-md border border-border-default bg-bg-card px-6 py-5 text-center sm:flex-row sm:justify-between sm:text-left ${
            ticketCtaVisible ? "reveal-visible" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-sm border border-gold-primary/20 bg-gold-primary/12 text-gold-primary">
              <Ticket className="h-4 w-4" strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-main">{t("support.ticketCta.prompt")}</p>
              <p className="text-xs text-text-dim">{t("support.ticketCta.description")}</p>
            </div>
          </div>

          <Link
            to="/my-tickets/new"
            className="inline-flex flex-shrink-0 items-center gap-1.5 text-sm font-medium text-gold-primary transition-colors hover:text-gold-light"
          >
            {t("support.ticketCta.link")}
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
          </Link>
        </div>

        <div
          ref={telegramRef}
          className={`reveal mt-8 flex flex-col items-center gap-4 rounded-md border border-border-default bg-bg-card px-6 py-5 text-center sm:flex-row sm:justify-between sm:text-left ${
            telegramVisible ? "reveal-visible" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-sm border border-gold-primary/20 bg-gold-primary/12 text-gold-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                <path d="M22 2 11 13M22 2 15 22l-4-9-9-4Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-text-main">{t("support.telegram.prompt")}</p>
              <p className="text-xs text-text-dim">{t("support.telegram.description")}</p>
            </div>
          </div>

          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-shrink-0 items-center gap-1.5 text-sm font-medium text-gold-primary transition-colors hover:text-gold-light"
          >
            {t("support.telegram.link")}
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
          </a>
        </div>

        <p className="mt-8 text-center text-sm text-text-muted">
          <Link
            to="/faq"
            className="inline-flex items-center gap-1.5 text-gold-primary transition-colors hover:text-gold-light"
          >
            {t("support.faqNote")}
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
          </Link>
        </p>
      </div>
    </section>
  );
}
