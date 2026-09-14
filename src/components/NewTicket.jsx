import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { AlertTriangle, CheckCircle2, Paperclip, X } from "lucide-react";
import useScrollReveal from "../hooks/useScrollReveal";
import useAuth from "../hooks/useAuth";
import useProfile from "../hooks/useProfile";
import { supabase } from "../lib/supabaseClient";
import { TICKET_CATEGORIES } from "../data/ticketOptions";
import SecurityNotice from "./SecurityNotice";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MESSAGE_MIN_LENGTH = 10;
const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024;
const ALLOWED_ATTACHMENT_TYPES = ["image/png", "image/jpeg", "image/webp", "application/pdf"];

const INITIAL_FORM = {
  category: TICKET_CATEGORIES[0].value,
  meridianUsername: "",
  name: "",
  email: "",
  message: "",
  attachment: null,
};

function validateForm(form, t) {
  const errors = {};

  if (!form.email.trim()) {
    errors.email = t("myTickets.new.errors.emailRequired");
  } else if (!EMAIL_PATTERN.test(form.email.trim())) {
    errors.email = t("myTickets.new.errors.emailInvalid");
  }

  if (!form.message.trim()) {
    errors.message = t("myTickets.new.errors.messageRequired");
  } else if (form.message.trim().length < MESSAGE_MIN_LENGTH) {
    errors.message = t("myTickets.new.errors.messageTooShort", { count: MESSAGE_MIN_LENGTH });
  }

  if (form.attachment) {
    if (!ALLOWED_ATTACHMENT_TYPES.includes(form.attachment.type)) {
      errors.attachment = t("myTickets.new.errors.attachmentInvalidType");
    } else if (form.attachment.size > MAX_ATTACHMENT_SIZE) {
      errors.attachment = t("myTickets.new.errors.attachmentTooLarge");
    }
  }

  return errors;
}

function fieldClassName(hasError) {
  return `w-full rounded-md border bg-bg-secondary px-4 py-3 text-sm text-text-main placeholder:text-text-muted/70 transition-colors focus:outline-none focus:ring-1 ${
    hasError
      ? "border-red-500/50 focus:border-red-500/60 focus:ring-red-500/30"
      : "border-border-default focus:border-gold-primary/50 focus:ring-gold-primary/30"
  }`;
}

function FormField({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-text-main">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-400/90">{error}</p>}
    </div>
  );
}

async function uploadAttachment(ticketId, file) {
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const path = `${ticketId}/${Date.now()}-${safeName}`;

  const { error } = await supabase.storage.from("ticket-attachments").upload(path, file);
  if (error) return null;

  return path;
}

function TicketCreatedPanel({ ticket, isLoggedIn }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center gap-4 py-4 text-center">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold-primary/30 bg-gold-primary/12 text-gold-primary">
        <CheckCircle2 className="h-6 w-6" strokeWidth={1.75} />
      </div>
      <p className="text-sm text-text-secondary">{t("myTickets.new.success.heading")}</p>
      <p className="rounded-md border border-border-default bg-bg-secondary px-4 py-2 font-mono text-sm text-text-main">
        {ticket.id}
      </p>
      <p className="max-w-sm text-sm leading-relaxed text-text-dim">
        {isLoggedIn ? t("myTickets.new.success.loggedInNote") : t("myTickets.new.success.anonymousNote")}
      </p>
      {isLoggedIn && (
        <Link
          to={`/my-tickets/${ticket.id}`}
          className="inline-flex items-center justify-center rounded-md bg-gold-primary px-6 py-2.5 text-sm font-semibold text-bg-primary transition-colors hover:bg-gold-light"
        >
          {t("myTickets.new.success.viewTicket")}
        </Link>
      )}
    </div>
  );
}

function NewTicketForm() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { profile } = useProfile();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [createdTicket, setCreatedTicket] = useState(null);

  useEffect(() => {
    if (!user?.email) return;
    setForm((current) => ({ ...current, email: current.email || user.email }));
  }, [user]);

  useEffect(() => {
    if (!profile?.username) return;
    setForm((current) => ({ ...current, meridianUsername: current.meridianUsername || profile.username }));
  }, [profile]);

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleAttachmentChange = (event) => {
    const file = event.target.files?.[0] || null;
    setForm((current) => ({ ...current, attachment: file }));
    setErrors((current) => ({ ...current, attachment: undefined }));
  };

  const clearAttachment = () => {
    setForm((current) => ({ ...current, attachment: null }));
    setErrors((current) => ({ ...current, attachment: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateForm(form, t);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus("submitting");

    const language = (i18n.resolvedLanguage || i18n.language || "en").slice(0, 2);

    const ticketPayload = {
      user_id: user?.id ?? null,
      category: form.category,
      meridian_username: form.meridianUsername.trim() || null,
      name: form.name.trim() || null,
      email: form.email.trim(),
      language,
    };

    // Anonymous submitters have no SELECT policy on tickets (see schema.sql),
    // so .insert().select() would fail on the RETURNING clause -- go through
    // the create_anonymous_ticket RPC instead, which returns just the new id
    // without needing a broad anon SELECT policy on the whole table.
    let ticket;
    let ticketError;
    if (user) {
      ({ data: ticket, error: ticketError } = await supabase
        .from("tickets")
        .insert(ticketPayload)
        .select()
        .single());
    } else {
      const { data: newTicketId, error } = await supabase.rpc("create_anonymous_ticket", {
        p_category: ticketPayload.category,
        p_email: ticketPayload.email,
        p_meridian_username: ticketPayload.meridian_username,
        p_name: ticketPayload.name,
        p_language: ticketPayload.language,
      });
      ticket = newTicketId ? { id: newTicketId } : null;
      ticketError = error;
    }

    if (ticketError) {
      setStatus("error");
      setErrors((current) => ({ ...current, form: t("myTickets.new.errors.generic") }));
      return;
    }

    let attachmentUrl = null;
    if (form.attachment) {
      try {
        attachmentUrl = await uploadAttachment(ticket.id, form.attachment);
      } catch {
        attachmentUrl = null;
      }
    }

    const { error: messageError } = await supabase.from("ticket_messages").insert({
      ticket_id: ticket.id,
      sender_type: "user",
      message: form.message.trim(),
      attachment_url: attachmentUrl,
    });

    if (messageError) {
      setStatus("error");
      setErrors((current) => ({ ...current, form: t("myTickets.new.errors.generic") }));
      return;
    }

    setCreatedTicket(ticket);
    setStatus("success");
  };

  if (status === "success" && createdTicket) {
    return <TicketCreatedPanel ticket={createdTicket} isLoggedIn={Boolean(user)} />;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {!user && (
        <p className="text-sm text-text-dim">
          {t("myTickets.new.loginHint.text")}{" "}
          <Link to="/login" className="font-medium text-gold-primary transition-colors hover:text-gold-light">
            {t("myTickets.new.loginHint.link")}
          </Link>
        </p>
      )}

      <FormField id="ticket-category" label={t("myTickets.new.fields.category.label")}>
        <select
          id="ticket-category"
          value={form.category}
          onChange={handleChange("category")}
          className={fieldClassName(false)}
        >
          {TICKET_CATEGORIES.map((category) => (
            <option key={category.value} value={category.value}>
              {t(`myTickets.categories.${category.key}`)}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        id="ticket-meridian-username"
        label={t("myTickets.new.fields.meridianUsername.label")}
      >
        <input
          id="ticket-meridian-username"
          type="text"
          value={form.meridianUsername}
          onChange={handleChange("meridianUsername")}
          placeholder={t("myTickets.new.fields.meridianUsername.placeholder")}
          className={fieldClassName(false)}
        />
      </FormField>

      <FormField id="ticket-name" label={t("myTickets.new.fields.name.label")}>
        <input
          id="ticket-name"
          type="text"
          autoComplete="name"
          value={form.name}
          onChange={handleChange("name")}
          placeholder={t("myTickets.new.fields.name.placeholder")}
          className={fieldClassName(false)}
        />
      </FormField>

      <FormField id="ticket-email" label={t("myTickets.new.fields.email.label")} error={errors.email}>
        <input
          id="ticket-email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange("email")}
          placeholder={t("myTickets.new.fields.email.placeholder")}
          aria-invalid={Boolean(errors.email)}
          className={fieldClassName(Boolean(errors.email))}
        />
      </FormField>

      <FormField id="ticket-message" label={t("myTickets.new.fields.message.label")} error={errors.message}>
        <textarea
          id="ticket-message"
          rows={5}
          value={form.message}
          onChange={handleChange("message")}
          placeholder={t("myTickets.new.fields.message.placeholder")}
          aria-invalid={Boolean(errors.message)}
          className={`${fieldClassName(Boolean(errors.message))} resize-none`}
        />
      </FormField>

      <FormField
        id="ticket-attachment"
        label={t("myTickets.new.fields.attachment.label")}
        error={errors.attachment}
      >
        {form.attachment ? (
          <div className="flex items-center justify-between gap-3 rounded-md border border-border-default bg-bg-secondary px-4 py-3 text-sm text-text-main">
            <span className="flex min-w-0 items-center gap-2">
              <Paperclip className="h-4 w-4 flex-shrink-0 text-text-dim" strokeWidth={2} />
              <span className="truncate">{form.attachment.name}</span>
            </span>
            <button
              type="button"
              onClick={clearAttachment}
              aria-label={t("myTickets.new.fields.attachment.remove")}
              className="flex-shrink-0 text-text-dim transition-colors hover:text-text-main"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        ) : (
          <input
            id="ticket-attachment"
            type="file"
            accept={ALLOWED_ATTACHMENT_TYPES.join(",")}
            onChange={handleAttachmentChange}
            className="block w-full text-sm text-text-dim file:mr-4 file:rounded-md file:border-0 file:bg-gold-primary/12 file:px-4 file:py-2 file:text-sm file:font-medium file:text-gold-primary hover:file:bg-gold-primary/20"
          />
        )}
        <p className="mt-1.5 text-xs text-text-muted">{t("myTickets.new.fields.attachment.hint")}</p>
      </FormField>

      {errors.form && (
        <div className="flex items-start gap-2 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" strokeWidth={2} />
          <p>{errors.form}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-1 inline-flex w-full items-center justify-center rounded-md bg-gold-primary px-8 py-3 text-sm font-semibold text-bg-primary transition-colors hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? t("myTickets.new.submitting") : t("myTickets.new.submit")}
      </button>
    </form>
  );
}

export default function NewTicket() {
  const { t } = useTranslation();
  const [cardRef, cardVisible] = useScrollReveal();

  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            {t("myTickets.new.heading")}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-text-secondary">{t("myTickets.new.intro")}</p>
        </div>

        <SecurityNotice className="mt-8" />

        <div
          ref={cardRef}
          className={`gold-card reveal mt-12 p-8 sm:p-10 ${cardVisible ? "reveal-visible" : ""}`}
        >
          <span className="gold-corner-dot" aria-hidden="true" />
          <NewTicketForm />
        </div>
      </div>
    </section>
  );
}
