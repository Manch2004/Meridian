import "dotenv/config";
import { Telegraf } from "telegraf";
import { getLocale, SECTION_IDS } from "./src/locales.js";
import { getUserLang, setUserLang } from "./src/state.js";
import { mainMenuKeyboard, sectionKeyboard, languageKeyboard } from "./src/menu.js";
import { matchSection } from "./src/keywords.js";

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error("BOT_TOKEN is not set. Copy .env.example to .env and fill it in.");
  process.exit(1);
}

const bot = new Telegraf(token);

async function sendMenu(ctx, lang, { edit = false } = {}) {
  const t = getLocale(lang);
  const payload = { parse_mode: "Markdown", ...mainMenuKeyboard(lang) };
  if (edit) {
    await ctx.editMessageText(t.menuTitle, payload).catch(() => ctx.reply(t.menuTitle, payload));
  } else {
    await ctx.reply(t.menuTitle, payload);
  }
}

async function sendSection(ctx, lang, sectionId, { edit = false } = {}) {
  const t = getLocale(lang);
  const section = t.sections[sectionId];
  if (!section) return sendMenu(ctx, lang, { edit });
  const text = `${section.title}\n\n${section.body}`;
  const payload = { parse_mode: "Markdown", ...sectionKeyboard(lang) };
  if (edit) {
    await ctx.editMessageText(text, payload).catch(() => ctx.reply(text, payload));
  } else {
    await ctx.reply(text, payload);
  }
}

async function sendLanguageMenu(ctx, lang, { edit = false } = {}) {
  const t = getLocale(lang);
  const payload = { parse_mode: "Markdown", ...languageKeyboard() };
  if (edit) {
    await ctx.editMessageText(t.langPrompt, payload).catch(() => ctx.reply(t.langPrompt, payload));
  } else {
    await ctx.reply(t.langPrompt, payload);
  }
}

bot.start(async (ctx) => {
  const lang = getUserLang(ctx);
  const t = getLocale(lang);
  await ctx.reply(t.welcome, { parse_mode: "Markdown" });
  await sendMenu(ctx, lang);
});

bot.command("menu", async (ctx) => sendMenu(ctx, getUserLang(ctx)));
bot.command("lang", async (ctx) => sendLanguageMenu(ctx, getUserLang(ctx)));

bot.action("menu", async (ctx) => {
  await ctx.answerCbQuery();
  await sendMenu(ctx, getUserLang(ctx), { edit: true });
});

bot.action("langmenu", async (ctx) => {
  await ctx.answerCbQuery();
  await sendLanguageMenu(ctx, getUserLang(ctx), { edit: true });
});

bot.action(/^lang:(ru|en|hy)$/, async (ctx) => {
  const lang = ctx.match[1];
  setUserLang(ctx, lang);
  await ctx.answerCbQuery(getLocale(lang).langSet);
  await sendMenu(ctx, lang, { edit: true });
});

bot.action(/^section:(.+)$/, async (ctx) => {
  const sectionId = ctx.match[1];
  await ctx.answerCbQuery();
  if (!SECTION_IDS.includes(sectionId)) return;
  await sendSection(ctx, getUserLang(ctx), sectionId, { edit: true });
});

bot.on("new_chat_members", async (ctx) => {
  const lang = getUserLang(ctx);
  const t = getLocale(lang);
  for (const member of ctx.message.new_chat_members) {
    const name = member.first_name ?? member.username ?? "";
    await ctx.reply(`${t.welcome}${name ? `\n\n👋 ${name}` : ""}`, { parse_mode: "Markdown" });
  }
});

bot.on("text", async (ctx) => {
  const lang = getUserLang(ctx);
  const sectionId = matchSection(ctx.message.text);
  if (sectionId) {
    await sendSection(ctx, lang, sectionId);
  } else {
    await ctx.reply(getLocale(lang).notFound);
    await sendMenu(ctx, lang);
  }
});

bot.launch();
console.log("Meridian bot is running...");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
