import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, Search, Bot } from "lucide-react";
import { SUPPORT_FAQ_CATEGORIES } from "../data/supportFaqCategories";
import { useAIChat } from "../context/AIChatContext";

const ALL_ITEMS = SUPPORT_FAQ_CATEGORIES.flatMap((category) =>
  category.items.map((itemKey) => ({ categoryKey: category.key, itemKey })),
);

function FaqCard({ item, isOpen, onToggle }) {
  const { t } = useTranslation();
  const question = t(`support.faq.categories.${item.categoryKey}.items.${item.itemKey}.question`);
  const answer = t(`support.faq.categories.${item.categoryKey}.items.${item.itemKey}.answer`);

  return (
    <div className={`gold-card overflow-hidden ${isOpen ? "is-active" : ""}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left"
      >
        <span>
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gold-primary/80">
            {t(`myTickets.categories.${item.categoryKey}`)}
          </span>
          <span className="text-base font-semibold text-text-main">{question}</span>
        </span>
        <ChevronDown
          className={`mt-1 h-5 w-5 flex-shrink-0 transition-all duration-300 ${
            isOpen ? "rotate-180 text-gold-primary" : "text-text-dim"
          }`}
          strokeWidth={1.75}
        />
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-5 text-sm leading-relaxed text-text-dim">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function SupportFaq() {
  const { t } = useTranslation();
  const { setOpen: setChatOpen } = useAIChat();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openKey, setOpenKey] = useState(null);

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return ALL_ITEMS.filter((item) => {
      if (activeCategory !== "all" && item.categoryKey !== activeCategory) return false;
      if (!normalizedQuery) return true;

      const question = t(`support.faq.categories.${item.categoryKey}.items.${item.itemKey}.question`);
      const answer = t(`support.faq.categories.${item.categoryKey}.items.${item.itemKey}.answer`);
      return (
        question.toLowerCase().includes(normalizedQuery) || answer.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [query, activeCategory, t]);

  return (
    <div>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-dim"
          strokeWidth={2}
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("support.faq.searchPlaceholder")}
          className="w-full rounded-md border border-border-default bg-bg-secondary py-3 pl-11 pr-4 text-sm text-text-main placeholder:text-text-muted/70 transition-colors focus:border-gold-primary/50 focus:outline-none focus:ring-1 focus:ring-gold-primary/30"
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveCategory("all")}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
            activeCategory === "all"
              ? "border-gold-primary/40 bg-gold-primary/12 text-gold-primary"
              : "border-border-default bg-bg-secondary text-text-dim hover:text-text-main"
          }`}
        >
          {t("support.faq.allCategories")}
        </button>
        {SUPPORT_FAQ_CATEGORIES.map((category) => (
          <button
            key={category.key}
            type="button"
            onClick={() => setActiveCategory(category.key)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              activeCategory === category.key
                ? "border-gold-primary/40 bg-gold-primary/12 text-gold-primary"
                : "border-border-default bg-bg-secondary text-text-dim hover:text-text-main"
            }`}
          >
            {t(`myTickets.categories.${category.key}`)}
          </button>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-4">
        {visibleItems.length === 0 && (
          <p className="px-2 py-8 text-center text-sm text-text-muted">{t("support.faq.noResults")}</p>
        )}

        {visibleItems.map((item) => {
          const compositeKey = `${item.categoryKey}.${item.itemKey}`;
          return (
            <FaqCard
              key={compositeKey}
              item={item}
              isOpen={openKey === compositeKey}
              onToggle={() => setOpenKey((current) => (current === compositeKey ? null : compositeKey))}
            />
          );
        })}
      </div>

      <div className="mt-10 flex justify-center">
        <button
          type="button"
          onClick={() => setChatOpen(true)}
          className="inline-flex items-center gap-2 rounded-md border border-gold-primary/30 bg-gold-primary/12 px-6 py-3 text-sm font-semibold text-gold-primary transition-colors hover:bg-gold-primary/20"
        >
          <Bot className="h-4 w-4" strokeWidth={2} />
          {t("support.faq.askAi")}
        </button>
      </div>
    </div>
  );
}
