import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight } from "lucide-react";
import useScrollReveal from "../hooks/useScrollReveal";
import { supabase } from "../lib/supabaseClient";
import { TICKET_STATUSES, categoryTranslationKey } from "../data/ticketOptions";
import TicketStatusBadge from "./TicketStatusBadge";

function AdminTicketRow({ ticket, locale }) {
  const { t } = useTranslation();
  const key = categoryTranslationKey(ticket.category);
  const requester = ticket.name || ticket.email || ticket.meridian_username || "—";

  return (
    <Link
      to={`/admin/${ticket.id}`}
      className="group flex items-center justify-between gap-4 border-b border-border-default px-2 py-5 transition-colors last:border-b-0 hover:bg-bg-secondary/60 sm:px-4"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-text-main">
          {key ? t(`myTickets.categories.${key}`) : ticket.category}
        </p>
        <p className="mt-1 truncate text-xs text-text-muted">
          {requester} ·{" "}
          {new Date(ticket.created_at).toLocaleDateString(locale, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
          {ticket.assigned_to && ` · ${t("admin.list.assignedTo", { name: ticket.assigned_to })}`}
        </p>
      </div>
      <div className="flex flex-shrink-0 items-center gap-3">
        <TicketStatusBadge status={ticket.status} />
        <ArrowRight
          className="h-4 w-4 text-text-muted transition-colors group-hover:text-gold-primary"
          strokeWidth={2}
        />
      </div>
    </Link>
  );
}

export default function AdminTickets() {
  const { t, i18n } = useTranslation();
  const [listRef, listVisible] = useScrollReveal();
  const [tickets, setTickets] = useState(null);
  const [error, setError] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    let cancelled = false;

    supabase
      .from("tickets")
      .select("*")
      .order("updated_at", { ascending: false })
      .then(({ data, error: fetchError }) => {
        if (cancelled) return;
        if (fetchError) {
          setError(true);
          return;
        }
        setTickets(data);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const locale = i18n.resolvedLanguage || i18n.language || "en";
  const visibleTickets =
    tickets && statusFilter !== "all" ? tickets.filter((ticket) => ticket.status === statusFilter) : tickets;

  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <div
          ref={listRef}
          className={`reveal flex flex-col gap-4 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left ${
            listVisible ? "reveal-visible" : ""
          }`}
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              {t("admin.list.heading")}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-text-secondary">{t("admin.list.intro")}</p>
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="mx-auto w-fit rounded-md border border-border-default bg-bg-secondary px-4 py-2.5 text-sm text-text-main focus:border-gold-primary/50 focus:outline-none focus:ring-1 focus:ring-gold-primary/30 sm:mx-0"
          >
            <option value="all">{t("admin.list.allStatuses")}</option>
            {TICKET_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {t(`myTickets.statuses.${status.key}`)}
              </option>
            ))}
          </select>
        </div>

        <div className="gold-card mt-12 overflow-hidden p-2 sm:p-4">
          <span className="gold-corner-dot" aria-hidden="true" />

          {error && (
            <div className="flex items-start gap-2 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" strokeWidth={2} />
              <p>{t("admin.list.error")}</p>
            </div>
          )}

          {!error && visibleTickets === null && (
            <p className="px-2 py-8 text-center text-sm text-text-muted sm:px-4">
              {t("admin.list.loading")}
            </p>
          )}

          {!error && visibleTickets !== null && visibleTickets.length === 0 && (
            <p className="px-2 py-8 text-center text-sm text-text-muted sm:px-4">
              {t("admin.list.empty")}
            </p>
          )}

          {!error &&
            visibleTickets !== null &&
            visibleTickets.length > 0 &&
            visibleTickets.map((ticket) => <AdminTicketRow key={ticket.id} ticket={ticket} locale={locale} />)}
        </div>
      </div>
    </section>
  );
}
