import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Paperclip } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

const IMAGE_EXTENSION_PATTERN = /\.(png|jpe?g|webp|gif)$/i;

function Attachment({ path }) {
  const { t } = useTranslation();
  const [signedUrl, setSignedUrl] = useState(null);

  useEffect(() => {
    let cancelled = false;

    supabase.storage
      .from("ticket-attachments")
      .createSignedUrl(path, 60 * 60)
      .then(({ data }) => {
        if (!cancelled && data) setSignedUrl(data.signedUrl);
      });

    return () => {
      cancelled = true;
    };
  }, [path]);

  if (!signedUrl) return null;

  if (IMAGE_EXTENSION_PATTERN.test(path)) {
    return (
      <a href={signedUrl} target="_blank" rel="noopener noreferrer" className="mt-2 block">
        <img
          src={signedUrl}
          alt={t("myTickets.detail.attachment")}
          className="max-h-48 rounded-md border border-border-default"
        />
      </a>
    );
  }

  return (
    <a
      href={signedUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-gold-primary transition-colors hover:text-gold-light"
    >
      <Paperclip className="h-3.5 w-3.5" strokeWidth={2} />
      {t("myTickets.detail.attachment")}
    </a>
  );
}

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
        {message.attachment_url && <Attachment path={message.attachment_url} />}
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
