import { Markup } from "telegraf";
import { getLocale, SECTION_IDS, SUPPORTED_LANGS } from "./locales.js";

export function mainMenuKeyboard(lang) {
  const t = getLocale(lang);
  const rows = [];
  for (let i = 0; i < SECTION_IDS.length; i += 2) {
    const row = [SECTION_IDS[i], SECTION_IDS[i + 1]]
      .filter(Boolean)
      .map((id) => Markup.button.callback(t.buttons[id], `section:${id}`));
    rows.push(row);
  }
  rows.push([Markup.button.callback(t.buttons.language, "langmenu")]);
  return Markup.inlineKeyboard(rows);
}

export function sectionKeyboard(lang) {
  const t = getLocale(lang);
  return Markup.inlineKeyboard([
    [Markup.button.callback(t.buttons.menu, "menu")],
  ]);
}

export function languageKeyboard() {
  return Markup.inlineKeyboard(
    SUPPORTED_LANGS.map((code) => {
      const t = getLocale(code);
      return Markup.button.callback(`${t.meta.flag} ${t.meta.name}`, `lang:${code}`);
    }),
    { columns: 1 },
  );
}
