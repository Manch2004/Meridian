export const KEYWORDS = {
  whatIsMeridian: [
    "что такое meridian", "meridian это", "о проекте", "о фонде", "что за проект",
    "what is meridian", "about meridian", "what's meridian", "tell me about",
    "ինչ է meridian", "մերիդիան ինչ", "նախագծի մասին",
  ],
  howItWorks: [
    "как это работает", "как работает", "как устроен", "принцип работы",
    "how it works", "how does it work", "how does meridian work",
    "ինչպես է աշխատում", "աշխատանքի սկզբունք",
  ],
  treasury: [
    "treasury", "трежери", "казначейств", "арбитраж", "стратеги", "p2p", "трейдинг",
    "arbitrage", "strategy", "strategies", "trading",
    "արբիտրաժ", "ռազմավարություն",
  ],
  staking: [
    "стейкинг", "staking", "стейк", "комисси", "процент", "доходность",
    "stake", "fee", "fees", "profit share",
    "ստեյքինգ", "վճար",
  ],
  deposits: [
    "депозит", "ввод средств", "вывод средств", "usdt", "trc20", "пополнить", "снять",
    "deposit", "withdraw", "withdrawal",
    "ավանդ", "դուրսբերում",
  ],
  bonuses: [
    "бонус", "wheel", "колесо", "реферал", "пригласи",
    "bonus", "referral", "invite",
    "բոնուս", "ռեֆերալ",
  ],
  levels: [
    "уровень", "поинт", "points", "level", "bronze", "silver", "gold", "platinum", "obsidian",
    "մակարդակ",
  ],
  token: [
    "токен", "dao", "fund unit",
    "token",
    "տոկեն",
  ],
  roadmap: [
    "дорожная карта", "роадмап", "roadmap", "план развития", "фаза",
    "phase",
    "ուղի",
  ],
  security: [
    "безопасност", "мультиподпис", "кошел",
    "security", "wallet", "multisig",
    "անվտանգություն", "դրամապանակ",
  ],
  risks: [
    "риск", "гаранти",
    "risk", "guarantee",
    "ռիսկ",
  ],
  contact: [
    "связаться", "поддержк", "контакт", "оператор", "человек",
    "contact", "support", "human", "team",
    "կապ", "թիմ",
  ],
};

export function matchSection(text) {
  const normalized = text.toLowerCase();
  for (const [sectionId, keywords] of Object.entries(KEYWORDS)) {
    if (keywords.some((kw) => normalized.includes(kw))) return sectionId;
  }
  return null;
}
