import { useTranslation } from "react-i18next";

function MessageBubble({ message, locale }) {
  const { t } = useTranslation();
  const isUser = message.sender_type === "user";

  return (
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
      <div
        className={`max-w-[85%] rounded-md border px-4 py-3 text-sm leading-relaxed sm:max-w-[75%] ${
          isUser
            ? "border-gold-primary/25 bg-gold-primary/10 text-text-main"
            : "border-border-default bg-bg-secondary text-text-main"
        }`}
      >
        <p className="whitespace-pre-wrap">{message.message}</p>
      </div>
      <p className="mt-1.5 px-1 text-xs text-text-muted">
        {isUser ? t("myTickets.detail.you") : t("myTickets.detail.support")} ·{" "}
        {new Date(message.created_at).toLocaleString(locale, {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
}

export default function TicketMessageThread({ messages, locale }) {
  return (
    <div className="mt-8 flex flex-col gap-4">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} locale={locale} />
      ))}
    </div>
  );
}
