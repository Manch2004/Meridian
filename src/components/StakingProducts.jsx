import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight } from "lucide-react";
import useScrollReveal from "../hooks/useScrollReveal";
import stakingProducts, { stakingFeeExample } from "../data/stakingProducts";

function ProductCard({ productKey, Icon, fee, index }) {
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
        {t(`stakingProducts.products.${productKey}.title`)}
      </h3>
      <p className="mt-1 text-xs uppercase tracking-widest text-text-dim">
        {t(`stakingProducts.products.${productKey}.period`)}
      </p>

      <div className="mt-4">
        <p className="text-xs font-medium uppercase tracking-widest text-text-dim">
          {t("stakingProducts.feeLabel")}
        </p>
        <p className="mt-1 font-mono text-2xl font-semibold text-gold-primary sm:text-3xl">{fee}%</p>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-text-dim">
        {t(`stakingProducts.products.${productKey}.note`)}
      </p>
    </div>
  );
}

function ClarifyingNote() {
  const { t } = useTranslation();
  return (
    <div className="flex items-start gap-3 rounded-md border border-border-default bg-bg-card p-5 text-sm text-text-dim">
      <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" strokeWidth={2} />
      <p>{t("stakingProducts.clarifyingNote")}</p>
    </div>
  );
}

function ExampleBlock() {
  const { t } = useTranslation();
  const { generatedProfit, feePercent, meridianFee, participantShare } = stakingFeeExample;

  return (
    <div className="gold-card p-6 sm:p-8">
      <p className="text-xs font-medium uppercase tracking-widest text-text-dim">
        {t("stakingProducts.example.heading")}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-text-secondary">
        {t("stakingProducts.example.text", { generatedProfit, feePercent, meridianFee, participantShare })}
      </p>

      <div className="mt-6 flex flex-col items-center justify-center gap-6 sm:flex-row">
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-text-dim">
            {t("stakingProducts.example.generatedProfitLabel")}
          </p>
          <p className="mt-1 font-mono text-xl font-semibold text-text-main">${generatedProfit}</p>
        </div>

        <ArrowRight className="h-5 w-5 flex-shrink-0 rotate-90 text-gold-primary sm:rotate-0" strokeWidth={2} />

        <div className="flex gap-8">
          <div className="text-center">
            <p className="text-xs uppercase tracking-widest text-text-dim">
              {t("stakingProducts.example.participantShareLabel")}
            </p>
            <p className="mt-1 font-mono text-xl font-semibold text-gold-primary">${participantShare}</p>
          </div>
          <div className="text-center">
            <p className="text-xs uppercase tracking-widest text-text-dim">
              {t("stakingProducts.example.meridianFeeLabel")}
            </p>
            <p className="mt-1 font-mono text-xl font-semibold text-text-dim">${meridianFee}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StakingProducts() {
  const { t } = useTranslation();
  const [headingRef, headingVisible] = useScrollReveal();
  const [noteRef, noteVisible] = useScrollReveal();
  const [exampleRef, exampleVisible] = useScrollReveal();
  const [closingRef, closingVisible] = useScrollReveal();

  return (
    <section id="staking-products" className="relative scroll-mt-20 overflow-hidden px-6 py-24 sm:py-32">
      <div className="relative mx-auto max-w-7xl">
        <div
          ref={headingRef}
          className={`reveal mx-auto max-w-2xl text-center ${headingVisible ? "reveal-visible" : ""}`}
        >
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            {t("stakingProducts.heading")}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-text-secondary">{t("stakingProducts.intro")}</p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stakingProducts.map((product, index) => (
            <ProductCard
              key={product.key}
              productKey={product.key}
              Icon={product.Icon}
              fee={product.fee}
              index={index}
            />
          ))}
        </div>

        <div
          ref={noteRef}
          className={`reveal mx-auto mt-10 max-w-3xl ${noteVisible ? "reveal-visible" : ""}`}
        >
          <ClarifyingNote />
        </div>

        <div
          ref={exampleRef}
          className={`reveal mx-auto mt-6 max-w-3xl ${exampleVisible ? "reveal-visible" : ""}`}
        >
          <ExampleBlock />
        </div>

        <div
          ref={closingRef}
          className={`reveal mx-auto mt-12 max-w-2xl text-center ${closingVisible ? "reveal-visible" : ""}`}
        >
          <Link
            to="/fund"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gold-primary transition-colors hover:text-gold-light"
          >
            {t("stakingProducts.closingLink")}
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  );
}
