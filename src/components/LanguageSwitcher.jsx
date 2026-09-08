import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "hy", label: "HY" },
  { code: "ru", label: "RU" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = (i18n.resolvedLanguage || i18n.language || "en").slice(0, 2);

  return (
    <div className="flex items-center rounded-md border border-border p-0.5 text-xs font-medium">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => i18n.changeLanguage(lang.code)}
          aria-pressed={current === lang.code}
          className={`rounded-sm px-2 py-1 transition-colors ${
            current === lang.code
              ? "bg-accent text-white"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
