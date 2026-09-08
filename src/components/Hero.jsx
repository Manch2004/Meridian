import { useTranslation } from "react-i18next";
import MeridianOrb from "./graphics/MeridianOrb";
import { OPEN_APP_URL } from "../config/links";

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden pt-24">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2">
        <div className="text-center lg:text-left">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
            {t("hero.headline")}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-text-secondary lg:mx-0">
            {t("hero.subheadline")}
          </p>
          <div className="mt-10 flex justify-center lg:justify-start">
            <a
              href={OPEN_APP_URL}
              aria-disabled="true"
              title={t("common.comingSoon")}
              onClick={(e) => e.preventDefault()}
              className="inline-flex cursor-not-allowed items-center justify-center rounded-md bg-accent px-6 py-3 text-base font-semibold text-white opacity-90 transition-opacity hover:opacity-100"
            >
              {t("hero.cta")}
            </a>
          </div>
        </div>

        <div className="flex justify-center">
          <MeridianOrb size={640} speed={140} />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-2 text-text-muted">
        <span className="text-xs uppercase tracking-widest">{t("hero.scrollHint")}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 animate-bounce">
          <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
}
