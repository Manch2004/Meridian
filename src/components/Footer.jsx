import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { TELEGRAM_URL, OPEN_APP_URL } from "../config/links";

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-bg-elevated/40">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="glass-card flex items-start gap-3 p-5 text-sm text-text-secondary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v.01M12 11v5" strokeLinecap="round" />
          </svg>
          <p>{t("footer.disclaimer")}</p>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-6 sm:flex-row">
          <Link to="/" className="text-lg font-bold tracking-tight text-text-primary">
            Meridian
          </Link>

          <div className="flex items-center gap-4">
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                <path d="M22 2 11 13M22 2 15 22l-4-9-9-4Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t("footer.telegram")}
            </a>

            <a
              href={OPEN_APP_URL}
              aria-disabled="true"
              title={t("common.comingSoon")}
              onClick={(e) => e.preventDefault()}
              className="cursor-not-allowed rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white opacity-80 transition-opacity hover:opacity-100"
            >
              {t("footer.openApp")}
            </a>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-text-muted sm:text-left">
          {t("footer.copyright", { year })}
        </p>
      </div>
    </footer>
  );
}
