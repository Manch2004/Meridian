import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, AlertTriangle, CheckCircle2, Ticket } from "lucide-react";
import useScrollReveal from "../hooks/useScrollReveal";
import SecurityNotice from "./SecurityNotice";
import { TELEGRAM_URL, SUPPORT_FORM_ENDPOINT } from "../config/links";

const MESSAGE_MIN_LENGTH = 10;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INITIAL_FORM = { name: "", email: "", message: "" };

function validateForm(form, t) {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = t("support.form.errors.nameRequired");
  }

  if (!form.email.trim()) {
    errors.email = t("support.form.errors.emailRequired");
  } else if (!EMAIL_PATTERN.test(form.email.trim())) {
    errors.email = t("support.form.errors.emailInvalid");
  }

  if (!form.message.trim()) {
    errors.message = t("support.form.errors.messageRequired");
  } else if (form.message.trim().length < MESSAGE_MIN_LENGTH) {
    errors.message = t("support.form.errors.messageTooShort", { count: MESSAGE_MIN_LENGTH });
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

function ContactForm() {
  const { t } = useTranslation();
  const [form, setForm] = useState(INITIAL_FORM);
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

    try {
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("email", form.email.trim());
      formData.append("message", form.message.trim());

      const response = await fetch(SUPPORT_FORM_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      if (!response.ok) throw new Error("Form submission failed");

      setForm(INITIAL_FORM);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold-primary/30 bg-gold-primary/12 text-gold-primary">
          <CheckCircle2 className="h-6 w-6" strokeWidth={1.75} />
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-text-main">{t("support.form.success")}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="text-sm font-medium text-gold-primary transition-colors hover:text-gold-light"
        >
          {t("support.form.sendAnother")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <FormField id="support-name" label={t("support.form.fields.name.label")} error={errors.name}>
        <input
          id="support-name"
          type="text"
          autoComplete="name"
          value={form.name}
          onChange={handleChange("name")}
          placeholder={t("support.form.fields.name.placeholder")}
          aria-invalid={Boolean(errors.name)}
          className={fieldClassName(Boolean(errors.name))}
        />
      </FormField>

      <FormField id="support-email" label={t("support.form.fields.email.label")} error={errors.email}>
        <input
          id="support-email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange("email")}
          placeholder={t("support.form.fields.email.placeholder")}
          aria-invalid={Boolean(errors.email)}
          className={fieldClassName(Boolean(errors.email))}
        />
      </FormField>

      <FormField id="support-message" label={t("support.form.fields.message.label")} error={errors.message}>
        <textarea
          id="support-message"
          rows={5}
          value={form.message}
          onChange={handleChange("message")}
          placeholder={t("support.form.fields.message.placeholder")}
          aria-invalid={Boolean(errors.message)}
          className={`${fieldClassName(Boolean(errors.message))} resize-none`}
        />
      </FormField>

      {status === "error" && (
        <div className="flex flex-col gap-2 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" strokeWidth={2} />
            <p>{t("support.form.error")}</p>
          </div>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-shrink-0 items-center gap-1 pl-6 text-xs font-medium text-red-200 underline decoration-red-300/40 underline-offset-2 transition-colors hover:text-red-100 sm:pl-0"
          >
            {t("support.telegram.link")}
          </a>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-1 inline-flex w-full items-center justify-center rounded-md bg-gold-primary px-8 py-3 text-sm font-semibold text-bg-primary transition-colors hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? t("support.form.sending") : t("support.form.submit")}
      </button>
    </form>
  );
}

export default function Support() {
  const { t } = useTranslation();
  const [introRef, introVisible] = useScrollReveal();
  const [ticketCtaRef, ticketCtaVisible] = useScrollReveal();
  const [formRef, formVisible] = useScrollReveal();
  const [telegramRef, telegramVisible] = useScrollReveal();

  return (
    <section id="support" className="scroll-mt-20 px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl">
        <div ref={introRef} className={`reveal text-center ${introVisible ? "reveal-visible" : ""}`}>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            {t("support.heading")}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-text-secondary">{t("support.intro")}</p>
        </div>

        <SecurityNotice className="mt-8" />

        <div
          ref={ticketCtaRef}
          className={`reveal mt-12 flex flex-col items-center gap-4 rounded-md border border-border-default bg-bg-card px-6 py-5 text-center sm:flex-row sm:justify-between sm:text-left ${
            ticketCtaVisible ? "reveal-visible" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-sm border border-gold-primary/20 bg-gold-primary/12 text-gold-primary">
              <Ticket className="h-4 w-4" strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-main">{t("support.ticketCta.prompt")}</p>
              <p className="text-xs text-text-dim">{t("support.ticketCta.description")}</p>
            </div>
          </div>

          <Link
            to="/my-tickets/new"
            className="inline-flex flex-shrink-0 items-center gap-1.5 text-sm font-medium text-gold-primary transition-colors hover:text-gold-light"
          >
            {t("support.ticketCta.link")}
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
          </Link>
        </div>

        <div
          ref={formRef}
          className={`gold-card reveal mt-16 p-8 sm:p-10 ${formVisible ? "reveal-visible" : ""}`}
        >
          <span className="gold-corner-dot" aria-hidden="true" />
          <ContactForm />
        </div>

        <div
          ref={telegramRef}
          className={`reveal mt-8 flex flex-col items-center gap-4 rounded-md border border-border-default bg-bg-card px-6 py-5 text-center sm:flex-row sm:justify-between sm:text-left ${
            telegramVisible ? "reveal-visible" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-sm border border-gold-primary/20 bg-gold-primary/12 text-gold-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                <path d="M22 2 11 13M22 2 15 22l-4-9-9-4Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-text-main">{t("support.telegram.prompt")}</p>
              <p className="text-xs text-text-dim">{t("support.telegram.description")}</p>
            </div>
          </div>

          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-shrink-0 items-center gap-1.5 text-sm font-medium text-gold-primary transition-colors hover:text-gold-light"
          >
            {t("support.telegram.link")}
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
          </a>
        </div>

        <p className="mt-8 text-center text-sm text-text-muted">
          <Link
            to="/faq"
            className="inline-flex items-center gap-1.5 text-gold-primary transition-colors hover:text-gold-light"
          >
            {t("support.faqNote")}
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
          </Link>
        </p>
      </div>
    </section>
  );
}
