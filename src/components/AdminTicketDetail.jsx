import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import useAuth from "../hooks/useAuth";
import { TICKET_STATUSES, categoryTranslationKey } from "../data/ticketOptions";
import TicketMessageThread from "./TicketMessageThread";
import TicketReplyForm from "./TicketReplyForm";

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-baseline justify-between gap-4 py-1.5 text-sm">
      <span className="text-text-dim">{label}</span>
      <span className="truncate text-text-main">{value}</span>
    </div>
  );
}

export default function AdminTicketDetail() {
  const { t, i18n } = useTranslation();
  const { ticketId } = useParams();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(undefined);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [assignUpdating, setAssignUpdating] = useState(false);

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

  const handleStatusChange = async (event) => {
    const status = event.target.value;
    setStatusUpdating(true);
    const { error: updateError } = await supabase.from("tickets").update({ status }).eq("id", ticketId);
    setStatusUpdating(false);
    if (!updateError) setTicket((current) => ({ ...current, status }));
  };

  const handleAssignToggle = async () => {
    const assignedTo = ticket.assigned_to ? null : user.email;
    setAssignUpdating(true);
    const { error: updateError } = await supabase
      .from("tickets")
      .update({ assigned_to: assignedTo })
      .eq("id", ticketId);
    setAssignUpdating(false);
    if (!updateError) setTicket((current) => ({ ...current, assigned_to: assignedTo }));
  };

  const locale = i18n.resolvedLanguage || i18n.language || "en";

  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl">
        <Link
          to="/admin"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gold-primary transition-colors hover:text-gold-light"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
          {t("admin.detail.back")}
        </Link>

        {error && (
          <div className="mt-8 flex items-start gap-2 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" strokeWidth={2} />
            <p>{t("admin.detail.error")}</p>
          </div>
        )}

        {!error && ticket === undefined && (
          <p className="mt-8 text-center text-sm text-text-muted">{t("admin.detail.loading")}</p>
        )}

        {!error && ticket === null && (
          <p className="mt-8 text-center text-sm text-text-muted">{t("admin.detail.notFound")}</p>
        )}

        {!error && ticket && (
          <>
            <h1 className="mt-6 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
              {t(`myTickets.categories.${categoryTranslationKey(ticket.category)}`)}
            </h1>
            <p className="mt-1 text-xs text-text-muted">
              {new Date(ticket.created_at).toLocaleDateString(locale, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>

            <div className="mt-6 rounded-md border border-border-default bg-bg-card p-5">
              <InfoRow label={t("admin.detail.requester.name")} value={ticket.name} />
              <InfoRow label={t("admin.detail.requester.email")} value={ticket.email} />
              <InfoRow label={t("admin.detail.requester.meridianUsername")} value={ticket.meridian_username} />
              <InfoRow label={t("admin.detail.requester.language")} value={ticket.language} />
            </div>

            <div className="mt-4 flex flex-col gap-4 rounded-md border border-border-default bg-bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <label htmlFor="ticket-status" className="text-sm font-medium text-text-main">
                  {t("admin.detail.status")}
                </label>
                <select
                  id="ticket-status"
                  value={ticket.status}
                  onChange={handleStatusChange}
                  disabled={statusUpdating}
                  className="rounded-md border border-border-default bg-bg-secondary px-3 py-2 text-sm text-text-main focus:border-gold-primary/50 focus:outline-none focus:ring-1 focus:ring-gold-primary/30 disabled:opacity-60"
                >
                  {TICKET_STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>
                      {t(`myTickets.statuses.${status.key}`)}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleAssignToggle}
                disabled={assignUpdating}
                className="text-sm font-medium text-gold-primary transition-colors hover:text-gold-light disabled:opacity-60"
              >
                {ticket.assigned_to
                  ? t("admin.detail.unassign", { name: ticket.assigned_to })
                  : t("admin.detail.assignToMe")}
              </button>
            </div>

            <TicketMessageThread messages={messages} locale={locale} />

            <TicketReplyForm
              ticketId={ticket.id}
              senderType="support"
              onSent={loadTicket}
              placeholder={t("admin.detail.replyPlaceholder")}
              errorText={t("admin.detail.replyError")}
              sendLabel={t("admin.detail.reply")}
              sendingLabel={t("admin.detail.sending")}
            />
          </>
        )}
      </div>
    </section>
  );
}
