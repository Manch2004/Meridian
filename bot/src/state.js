import { resolveLang } from "./locales.js";

const userLang = new Map();

export function getUserLang(ctx) {
  const chatId = ctx.chat.id;
  if (userLang.has(chatId)) return userLang.get(chatId);
  const lang = resolveLang(ctx.from?.language_code);
  userLang.set(chatId, lang);
  return lang;
}

export function setUserLang(ctx, lang) {
  userLang.set(ctx.chat.id, lang);
}
