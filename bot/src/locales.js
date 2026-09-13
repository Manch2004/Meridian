import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, "..", "locales");

export const SUPPORTED_LANGS = ["ru", "en", "hy"];
export const DEFAULT_LANG = "ru";

const locales = Object.fromEntries(
  SUPPORTED_LANGS.map((lang) => [
    lang,
    JSON.parse(readFileSync(path.join(localesDir, `${lang}.json`), "utf8")),
  ]),
);

export function getLocale(lang) {
  return locales[SUPPORTED_LANGS.includes(lang) ? lang : DEFAULT_LANG];
}

export function resolveLang(telegramLanguageCode) {
  const code = (telegramLanguageCode ?? "").slice(0, 2).toLowerCase();
  return SUPPORTED_LANGS.includes(code) ? code : DEFAULT_LANG;
}

export const SECTION_IDS = Object.keys(locales[DEFAULT_LANG].sections);
