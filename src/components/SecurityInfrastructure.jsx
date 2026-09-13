import { useTranslation } from "react-i18next";
import { AlertTriangle } from "lucide-react";
import useScrollReveal from "../hooks/useScrollReveal";
import securityInfrastructure from "../data/securityInfrastructure";
import accessControlPoints from "../data/accessControlPoints";

function InfrastructureCard({ layerKey, Icon, index }) {
  const { t } = useTranslation();
  const [ref, isVisible] = useScrollReveal();

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${index * 100}ms` }}
      className={`gold-card reveal group flex flex-col items-center gap-3 p-5 text-center ${
        isVisible ? "reveal-visible" : ""
      }`}
    >
      <span className="gold-corner-dot" aria-hidden="true" />
      <div className="gold-icon-glow inline-flex h-11 w-11 items-center justify-center rounded-sm border border-gold-primary/20 bg-gold-primary/12 text-gold-primary transition-colors duration-300 group-hover:border-gold-primary/40">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <h3 className="text-sm font-semibold text-text-main">
        {t(`security.infrastructure.layers.${layerKey}`)}
      </h3>
    </div>
  );
}

function AccessControlCard({ pointKey, Icon, index }) {
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
        {t(`security.accessControl.points.${pointKey}.title`)}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-text-dim">
        {t(`security.accessControl.points.${pointKey}.description`)}
      </p>
    </div>
  );
}

function ClarifyingNote() {
  const { t } = useTranslation();
  return (
    <div className="flex items-start gap-3 rounded-md border border-border-default bg-bg-card p-5 text-sm text-text-dim">
      <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" strokeWidth={2} />
      <p>{t("security.clarifyingNote")}</p>
    </div>
  );
}

export default function SecurityInfrastructure() {
  const { t } = useTranslation();
  const [headingRef, headingVisible] = useScrollReveal();
  const [infraHeadingRef, infraHeadingVisible] = useScrollReveal();
  const [accessHeadingRef, accessHeadingVisible] = useScrollReveal();
  const [noteRef, noteVisible] = useScrollReveal();

  return (
    <section id="security" className="relative scroll-mt-20 overflow-hidden px-6 py-24 sm:py-32">
      <div className="relative mx-auto max-w-7xl">
        <div
          ref={headingRef}
          className={`reveal mx-auto max-w-2xl text-center ${headingVisible ? "reveal-visible" : ""}`}
        >
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            {t("security.heading")}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-text-secondary">{t("security.intro")}</p>
        </div>

        <div
          ref={infraHeadingRef}
          className={`reveal mx-auto mt-20 max-w-2xl text-center ${
            infraHeadingVisible ? "reveal-visible" : ""
          }`}
        >
          <h2 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            {t("security.infrastructure.heading")}
          </h2>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {securityInfrastructure.map((layer, index) => (
            <InfrastructureCard key={layer.key} layerKey={layer.key} Icon={layer.Icon} index={index} />
          ))}
        </div>

        <div
          ref={accessHeadingRef}
          className={`reveal mx-auto mt-20 max-w-2xl text-center ${
            accessHeadingVisible ? "reveal-visible" : ""
          }`}
        >
          <h2 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            {t("security.accessControl.heading")}
          </h2>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {accessControlPoints.map((point, index) => (
            <AccessControlCard key={point.key} pointKey={point.key} Icon={point.Icon} index={index} />
          ))}
        </div>

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
