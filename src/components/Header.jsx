import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { OPEN_APP_URL } from "../config/links";
import useAuth from "../hooks/useAuth";
import useProfile from "../hooks/useProfile";
import { supabase } from "../lib/supabaseClient";

const STAFF_ROLES = ["support", "admin"];

const NAV_STRUCTURE = [
  { type: "link", key: "home", to: "/", end: true },
  { type: "link", key: "about", to: "/about" },
  {
    type: "group",
    key: "howItWorks",
    items: [
      { key: "howItWorks", to: "/how-it-works" },
      { key: "staking", to: "/staking" },
      { key: "fund", to: "/fund" },
    ],
  },
  {
    type: "group",
    key: "technology",
    items: [
      { key: "technology", to: "/technology" },
      { key: "security", to: "/security" },
      { key: "token", to: "/token" },
    ],
  },
  {
    type: "group",
    key: "ecosystem",
    items: [
      { key: "bonuses", to: "/bonuses" },
      { key: "levels", to: "/levels" },
      { key: "ecosystem", to: "/ecosystem" },
      { key: "roadmap", to: "/roadmap" },
    ],
  },
  { type: "link", key: "faq", to: "/faq" },
  { type: "link", key: "support", to: "/support" },
];

function OpenAppButton({ className = "" }) {
  const { t } = useTranslation();
  return (
    <a
      href={OPEN_APP_URL}
      aria-disabled="true"
      title={t("common.comingSoon")}
      onClick={(e) => e.preventDefault()}
      className={`inline-flex cursor-not-allowed items-center justify-center rounded-md bg-gold-primary px-4 py-2 text-sm font-semibold text-bg-primary transition-colors hover:bg-gold-light ${className}`}
    >
      {t("header.openApp")}
    </a>
  );
}

function HeaderAuthLinks({ className = "" }) {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const { profile } = useProfile();
  const isStaff = Boolean(profile && STAFF_ROLES.includes(profile.role));

  if (loading) return null;

  if (user) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {isStaff && (
          <Link
            to="/admin"
            className="whitespace-nowrap text-sm text-text-dim transition-colors hover:text-text-main"
          >
            {t("header.admin")}
          </Link>
        )}
        <Link
          to="/my-tickets"
          className="whitespace-nowrap text-sm text-text-dim transition-colors hover:text-text-main"
        >
          {t("header.myTickets")}
        </Link>
        <span className="max-w-[10rem] truncate text-sm text-text-dim" title={user.email}>
          {user.email}
        </span>
        <button
          type="button"
          onClick={() => supabase.auth.signOut()}
          className="text-sm text-text-dim transition-colors hover:text-text-main"
        >
          {t("header.signOut")}
        </button>
      </div>
    );
  }

  return (
    <Link
      to="/login"
      className={`whitespace-nowrap text-sm text-text-dim transition-colors hover:text-text-main ${className}`}
    >
      {t("header.login")}
    </Link>
  );
}

function DesktopNavGroup({ group, isActive }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const closeTimeout = useRef(null);

  const openNow = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setOpen(true);
  };
  const closeSoon = () => {
    closeTimeout.current = setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => () => closeTimeout.current && clearTimeout(closeTimeout.current), []);

  return (
    <div className="relative" onMouseEnter={openNow} onMouseLeave={closeSoon}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className={`flex items-center gap-1 whitespace-nowrap text-sm transition-colors hover:text-text-main ${
          isActive ? "text-gold-primary" : "text-text-dim"
        }`}
      >
        {t(`header.nav.groups.${group.key}`)}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          strokeWidth={2}
        />
      </button>

      <div
        className={`absolute left-1/2 top-full z-50 mt-3 w-72 -translate-x-1/2 rounded-md border border-border-default bg-bg-secondary/95 p-2 shadow-lg backdrop-blur-md transition-all duration-150 ${
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
        }`}
      >
        {group.items.map((item) => (
          <NavLink
            key={item.key}
            to={item.to}
            onClick={() => setOpen(false)}
            className={({ isActive: itemActive }) =>
              `block rounded-sm px-3 py-2.5 text-sm transition-colors hover:bg-gold-primary/10 hover:text-gold-light ${
                itemActive ? "text-gold-primary" : "text-text-dim"
              }`
            }
          >
            {t(`header.nav.items.${item.key}`)}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

function MobileNavGroup({ group, isActive, onNavigate }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-4 text-base transition-colors ${
          isActive ? "text-gold-primary" : "text-text-dim"
        }`}
      >
        {t(`header.nav.groups.${group.key}`)}
        <ChevronDown
          className={`h-4 w-4 flex-shrink-0 transition-transform duration-300 ${
            open ? "rotate-180 text-gold-primary" : ""
          }`}
          strokeWidth={2}
        />
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="mt-3 flex flex-col gap-3 border-l border-border-default pl-4">
            {group.items.map((item) => (
              <NavLink
                key={item.key}
                to={item.to}
                end={item.to === "/"}
                onClick={onNavigate}
                className={({ isActive: itemActive }) =>
                  `text-sm transition-colors hover:text-text-main ${
                    itemActive ? "text-gold-primary" : "text-text-muted"
                  }`
                }
              >
                {t(`header.nav.items.${item.key}`)}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navLinkClassName = ({ isActive }) =>
    `whitespace-nowrap text-sm transition-colors hover:text-text-main ${
      isActive ? "text-gold-primary" : "text-text-dim"
    }`;

  const mobileNavLinkClassName = ({ isActive }) =>
    `text-base transition-colors hover:text-text-main ${
      isActive ? "text-gold-primary" : "text-text-dim"
    }`;

  const isGroupActive = (group) => group.items.some((item) => item.to === location.pathname);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "border-border-default bg-bg-secondary/90 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-xl font-bold tracking-tight text-text-main">
          {t("header.logo")}
        </Link>

        <nav className="hidden items-center gap-5 xl:flex">
          {NAV_STRUCTURE.map((entry) =>
            entry.type === "link" ? (
              <NavLink key={entry.key} to={entry.to} end={entry.end} className={navLinkClassName}>
                {t(`header.nav.${entry.key}`)}
              </NavLink>
            ) : (
              <DesktopNavGroup key={entry.key} group={entry} isActive={isGroupActive(entry)} />
            ),
          )}
        </nav>

        <div className="hidden items-center gap-4 xl:flex">
          <HeaderAuthLinks />
          <LanguageSwitcher />
          <OpenAppButton />
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={t("common.toggleMenu")}
          aria-expanded={menuOpen}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border-default text-text-main xl:hidden"
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
        <div className="max-h-[calc(100vh-72px)] overflow-y-auto border-t border-border-default bg-bg-secondary/95 px-6 py-6 backdrop-blur-md xl:hidden">
          <nav className="flex flex-col gap-5">
            {NAV_STRUCTURE.map((entry) =>
              entry.type === "link" ? (
                <NavLink
                  key={entry.key}
                  to={entry.to}
                  end={entry.end}
                  onClick={() => setMenuOpen(false)}
                  className={mobileNavLinkClassName}
                >
                  {t(`header.nav.${entry.key}`)}
                </NavLink>
              ) : (
                <MobileNavGroup
                  key={entry.key}
                  group={entry}
                  isActive={isGroupActive(entry)}
                  onNavigate={() => setMenuOpen(false)}
                />
              ),
            )}
          </nav>
          <div className="mt-6 flex flex-col gap-4">
            <HeaderAuthLinks />
            <div className="flex items-center justify-between">
              <LanguageSwitcher />
              <OpenAppButton />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
