import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import { OPEN_APP_URL } from "../config/links";

const NAV_ITEMS = [
  { key: "home", to: "/" },
  { key: "about", to: "/about" },
  { key: "howItWorks", to: "/how-it-works" },
  { key: "fund", to: "/fund" },
  { key: "technology", to: "/technology" },
  { key: "roadmap", to: "/roadmap" },
  { key: "token", to: "/token" },
  { key: "faq", to: "/faq" },
];

function OpenAppButton({ className = "" }) {
  const { t } = useTranslation();
  return (
    <a
      href={OPEN_APP_URL}
      aria-disabled="true"
      title={t("common.comingSoon")}
      onClick={(e) => e.preventDefault()}
      className={`inline-flex cursor-not-allowed items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white opacity-80 transition-opacity hover:opacity-100 ${className}`}
    >
      {t("header.openApp")}
    </a>
  );
}

export default function Header() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinkClassName = ({ isActive }) =>
    `whitespace-nowrap text-sm transition-colors hover:text-text-primary ${
      isActive ? "text-accent" : "text-text-secondary"
    }`;

  const mobileNavLinkClassName = ({ isActive }) =>
    `text-base transition-colors hover:text-text-primary ${
      isActive ? "text-accent" : "text-text-secondary"
    }`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "border-border bg-bg/90 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-xl font-bold tracking-tight text-text-primary">
          {t("header.logo")}
        </Link>

        <nav className="hidden items-center gap-5 xl:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.key} to={item.to} end={item.to === "/"} className={navLinkClassName}>
              {t(`header.nav.${item.key}`)}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-4 xl:flex">
          <LanguageSwitcher />
          <OpenAppButton />
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={t("common.toggleMenu")}
          aria-expanded={menuOpen}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-text-primary xl:hidden"
        >
          {menuOpen ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-border bg-bg/95 px-6 py-6 backdrop-blur-md xl:hidden">
          <nav className="flex flex-col gap-4">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.key}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setMenuOpen(false)}
                className={mobileNavLinkClassName}
              >
                {t(`header.nav.${item.key}`)}
              </NavLink>
            ))}
          </nav>
          <div className="mt-6 flex items-center justify-between">
            <LanguageSwitcher />
            <OpenAppButton />
          </div>
        </div>
      )}
    </header>
  );
}
