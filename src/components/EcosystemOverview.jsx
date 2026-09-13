import { useTranslation } from "react-i18next";
import useScrollReveal from "../hooks/useScrollReveal";
import ecosystemInterfaces from "../data/ecosystemInterfaces";
import { TELEGRAM_URL } from "../config/links";

function EcosystemCard({ interfaceKey, Icon, isCurrent, external, index }) {
  const { t } = useTranslation();
  const [ref, isVisible] = useScrollReveal();

  const className = `gold-card reveal group p-6 ${isVisible ? "reveal-visible" : ""}`;
  const style = { transitionDelay: `${index * 100}ms` };

  const body = (
    <>
      <span className="gold-corner-dot" aria-hidden="true" />
      <div className="flex items-start justify-between gap-3">
        <div className="gold-icon-glow inline-flex h-11 w-11 items-center justify-center rounded-sm border border-gold-primary/20 bg-gold-primary/12 text-gold-primary transition-colors duration-300 group-hover:border-gold-primary/40">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
        {isCurrent && (
          <span className="rounded-full border border-border-default px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-text-muted">
            {t("ecosystem.youAreHere")}
          </span>
        )}
      </div>
      <h3 className="mt-4 text-base font-semibold text-text-main">
        {t(`ecosystem.interfaces.${interfaceKey}.title`)}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-text-dim">
        {t(`ecosystem.interfaces.${interfaceKey}.description`)}
      </p>
      {external && (
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-gold-primary transition-colors group-hover:text-gold-light">
          {t("ecosystem.interfaces.telegram.link")}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            className="h-3.5 w-3.5"
          >
            <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
    </>
  );

  if (external) {
    return (
      <a
        ref={ref}
        href={TELEGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={style}
        className={className}
      >
        {body}
      </a>
    );
  }

  return (
    <div ref={ref} style={style} className={className}>
      {body}
    </div>
  );
}

function ClosingNote() {
  const { t } = useTranslation();
  const [ref, isVisible] = useScrollReveal();

  return (
    <p
      ref={ref}
      className={`reveal mx-auto mt-14 max-w-2xl text-center text-sm text-text-dim ${
        isVisible ? "reveal-visible" : ""
      }`}
    >
      {t("ecosystem.closingNote")}
    </p>
  );
}

export default function EcosystemOverview() {
  const { t } = useTranslation();
  const [headingRef, headingVisible] = useScrollReveal();

  return (
    <section id="ecosystem" className="relative scroll-mt-20 overflow-hidden px-6 py-24 sm:py-32">
      <div className="relative mx-auto max-w-7xl">
        <div
          ref={headingRef}
          className={`reveal mx-auto max-w-2xl text-center ${headingVisible ? "reveal-visible" : ""}`}
        >
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            {t("ecosystem.heading")}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-text-secondary">{t("ecosystem.intro")}</p>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
          {ecosystemInterfaces.map((item, index) => (
            <EcosystemCard
              key={item.key}
              interfaceKey={item.key}
              Icon={item.Icon}
              isCurrent={item.isCurrent}
              external={item.external}
              index={index}
            />
          ))}
        </div>

        <ClosingNote />
      </div>
    </section>
  );
}
