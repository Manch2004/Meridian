import { useTranslation } from "react-i18next";
import { AlertTriangle } from "lucide-react";
import useScrollReveal from "../hooks/useScrollReveal";
import useCountUp from "../hooks/useCountUp";
import { fundStats } from "../data/fundDemoData";
import FundChart from "./FundChart";

const STATS = [
  { key: "unitPrice", value: fundStats.unitPrice, formatter: (v) => `$${v.toFixed(2)}` },
  {
    key: "fundValue",
    value: fundStats.fundValue,
    formatter: (v) => `$${Math.round(v).toLocaleString("en-US")}`,
  },
  {
    key: "totalUnits",
    value: fundStats.totalUnits,
    formatter: (v) => Math.round(v).toLocaleString("en-US"),
  },
  { key: "activeSince", value: null, formatter: null },
];

function DemoDataBadge({ size = "md" }) {
  const { t } = useTranslation();
  const isSmall = size === "sm";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-md border border-border-default bg-bg-card font-medium text-text-dim ${
        isSmall ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-sm"
      }`}
    >
      <AlertTriangle className={isSmall ? "h-3.5 w-3.5 flex-shrink-0" : "h-4 w-4 flex-shrink-0"} strokeWidth={2} />
      {t("fund.demoData")}
    </span>
  );
}

function StatCard({ statKey, value, formatter, index }) {
  const { t } = useTranslation();
  const [ref, isVisible] = useScrollReveal();
  const animated = useCountUp(typeof value === "number" ? value : 0, { start: isVisible });

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${index * 120}ms` }}
      className={`gold-card reveal p-6 ${isVisible ? "reveal-visible" : ""}`}
    >
      <p className="text-xs font-medium uppercase tracking-widest text-text-dim">
        {t(`fund.stats.${statKey}.label`)}
      </p>
      <p className="mt-3 font-mono text-2xl font-semibold text-gold-primary sm:text-3xl">
        {typeof value === "number" ? formatter(animated) : t(`fund.stats.${statKey}.value`)}
      </p>
    </div>
  );
}

export default function Fund() {
  const { t } = useTranslation();
  const [headingRef, headingVisible] = useScrollReveal();

  return (
    <section id="fund" className="relative scroll-mt-20 overflow-hidden px-6 py-24 sm:py-32">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl">
        <div
          ref={headingRef}
          className={`reveal mx-auto max-w-2xl text-center ${headingVisible ? "reveal-visible" : ""}`}
        >
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            {t("fund.heading")}
          </h2>
          <div className="mt-5 flex justify-center">
            <DemoDataBadge />
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, index) => (
            <StatCard
              key={stat.key}
              statKey={stat.key}
              value={stat.value}
              formatter={stat.formatter}
              index={index}
            />
          ))}
        </div>

        <div className="mt-16">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-text-primary">{t("fund.chartTitle")}</h3>
            <DemoDataBadge size="sm" />
          </div>
          <div className="rounded-md border border-border-default p-4 sm:p-6">
            <FundChart />
          </div>
        </div>
      </div>
    </section>
  );
}
