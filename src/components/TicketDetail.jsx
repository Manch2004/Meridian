import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Copy, Check } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { categoryTranslationKey } from "../data/ticketOptions";
import TicketStatusBadge from "./TicketStatusBadge";
import TicketMessageThread from "./TicketMessageThread";
import TicketReplyForm from "./TicketReplyForm";
import SecurityNotice from "./SecurityNotice";

function TicketIdBadge({ ticketId }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ticketId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-md border border-border-default bg-bg-secondary px-4 py-3">
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-text-dim">
          {t("myTickets.detail.idLabel")}
        </p>
        <p className="mt-0.5 truncate font-mono text-sm text-text-main">{ticketId}</p>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={t("myTickets.detail.copyId")}
        title={t("myTickets.detail.copyId")}
        className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-md border border-gold-primary/30 bg-gold-primary/12 px-3 py-1.5 text-xs font-medium text-gold-primary transition-colors hover:bg-gold-primary/20"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5" strokeWidth={2} />
            {t("myTickets.detail.copied")}
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" strokeWidth={2} />
            {t("myTickets.detail.copyId")}
          </>
        )}
      </button>
    </div>
  );
}

export default function TicketDetail() {
  const { t, i18n } = useTranslation();
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(undefined);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(false);

  const loadTicket = useCallback(async () => {
    const [{ data: ticketData, error: ticketError }, { data: messageData, error: messageError }] =
      await Promise.all([
        supabase.from("tickets").select("*").eq("id", ticketId).maybeSingle(),
        supabase
          .from("ticket_messages")
          .select("*")
          .eq("ticket_id", ticketId)
          .order("created_at", { ascending: true }),
      ]);

    if (ticketError || messageError) {
      setError(true);
      return;
    }

    setTicket(ticketData);
    setMessages(messageData || []);
  }, [ticketId]);

  useEffect(() => {
    loadTicket();
  }, [loadTicket]);

  const locale = i18n.resolvedLanguage || i18n.language || "en";

  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl">
        <Link
          to="/my-tickets"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gold-primary transition-colors hover:text-gold-light"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
          {t("myTickets.detail.back")}
        </Link>

        {error && (
          <div className="mt-8 flex items-start gap-2 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" strokeWidth={2} />
            <p>{t("myTickets.detail.error")}</p>
          </div>
        )}

        {!error && ticket === undefined && (
          <p className="mt-8 text-center text-sm text-text-muted">{t("myTickets.detail.loading")}</p>
        )}

        {!error && ticket === null && (
          <p className="mt-8 text-center text-sm text-text-muted">{t("myTickets.detail.notFound")}</p>
        )}

        {!error && ticket && (
          <>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                {t(`myTickets.categories.${categoryTranslationKey(ticket.category)}`)}
              </h1>
              <TicketStatusBadge status={ticket.status} />
            </div>
            <p className="mt-1 text-xs text-text-muted">
              {new Date(ticket.created_at).toLocaleDateString(locale, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>

            <TicketIdBadge ticketId={ticket.id} />

            <TicketMessageThread messages={messages} locale={locale} />

            <SecurityNotice className="mt-6" />

            <TicketReplyForm
              ticketId={ticket.id}
              senderType="user"
              onSent={loadTicket}
              placeholder={t("myTickets.detail.replyPlaceholder")}
              errorText={t("myTickets.detail.replyError")}
              sendLabel={t("myTickets.detail.reply")}
              sendingLabel={t("myTickets.detail.sending")}
            />
          </>
        )}
      </div>
    </section>
  );
}
