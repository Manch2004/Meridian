import { useTranslation } from "react-i18next";

// Plain emoji flags (🇬🇧🇦🇲🇷🇺) fall back to a bracketed two-letter code on
// Windows (no flag glyphs in Segoe UI Emoji), so these render as small inline
// SVGs instead — identical, crisp output on every OS/browser.
const svgProps = {
  viewBox: "0 0 60 36",
  preserveAspectRatio: "none",
  role: "img",
  "aria-hidden": "true",
  className: "block h-full w-full",
};

function FlagGB() {
  return (
    <svg {...svgProps}>
      <rect width="60" height="36" fill="#00247d" />
      <g stroke="#fff" strokeWidth="6">
        <path d="M0,0 L60,36 M60,0 L0,36" />
      </g>
      <g stroke="#cf142b" strokeWidth="2.4">
        <path d="M0,0 L60,36 M60,0 L0,36" />
      </g>
      <g stroke="#fff" strokeWidth="10">
        <path d="M30,0 V36 M0,18 H60" />
      </g>
      <g stroke="#cf142b" strokeWidth="6">
        <path d="M30,0 V36 M0,18 H60" />
      </g>
    </svg>
  );
}

function FlagAM() {
  return (
    <svg {...svgProps}>
      <rect width="60" height="12" y="0" fill="#D90012" />
      <rect width="60" height="12" y="12" fill="#0033A0" />
      <rect width="60" height="12" y="24" fill="#F2A800" />
    </svg>
  );
}

function FlagRU() {
  return (
    <svg {...svgProps}>
      <rect width="60" height="12" y="0" fill="#ffffff" />
      <rect width="60" height="12" y="12" fill="#0039A6" />
      <rect width="60" height="12" y="24" fill="#D52B1E" />
    </svg>
  );
}

const LANGUAGES = [
  { code: "en", name: "English", Flag: FlagGB },
  { code: "hy", name: "Հայերեն", Flag: FlagAM },
  { code: "ru", name: "Русский", Flag: FlagRU },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = (i18n.resolvedLanguage || i18n.language || "en").slice(0, 2);

  return (
    <div className="flex items-center gap-1.5 rounded-md border border-border-default p-1">
      {LANGUAGES.map(({ code, name, Flag }) => (
        <button
          key={code}
          type="button"
          onClick={() => i18n.changeLanguage(code)}
          aria-pressed={current === code}
          aria-label={name}
          title={name}
          className={`h-[18px] w-[26px] overflow-hidden rounded-[3px] border transition-all ${
            current === code
              ? "border-gold-primary ring-1 ring-gold-primary"
              : "border-border-default opacity-60 hover:opacity-100"
          }`}
        >
          <Flag />
        </button>
      ))}
    </div>
  );
}
