import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import useScrollReveal from "../hooks/useScrollReveal";
import useAuth from "../hooks/useAuth";
import { supabase } from "../lib/supabaseClient";
import { TICKET_CATEGORIES } from "../data/ticketOptions";
import SecurityNotice from "./SecurityNotice";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MESSAGE_MIN_LENGTH = 10;

function buildInitialForm(userEmail) {
  return {
    category: TICKET_CATEGORIES[0].value,
    meridianUsername: "",
    name: "",
    email: userEmail || "",
    message: "",
  };
}

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

function NewTicketForm() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState(() => buildInitialForm(user?.email));
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
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

    const { data: ticket, error: ticketError } = await supabase
      .from("tickets")
      .insert({
        user_id: user.id,
        category: form.category,
        meridian_username: form.meridianUsername.trim() || null,
        name: form.name.trim() || null,
        email: form.email.trim(),
        language,
      })
      .select()
      .single();

    if (ticketError) {
      setStatus("error");
      setErrors((current) => ({ ...current, form: t("myTickets.new.errors.generic") }));
      return;
    }

    const { error: messageError } = await supabase.from("ticket_messages").insert({
      ticket_id: ticket.id,
      sender_type: "user",
      message: form.message.trim(),
    });

    if (messageError) {
      setStatus("error");
      setErrors((current) => ({ ...current, form: t("myTickets.new.errors.generic") }));
      return;
    }

    navigate(`/my-tickets/${ticket.id}`);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
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
