import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import useScrollReveal from "../hooks/useScrollReveal";
import useAuth from "../hooks/useAuth";
import { supabase } from "../lib/supabaseClient";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INITIAL_FORM = { email: "", password: "" };

function validateForm(form, t) {
  const errors = {};

  if (!form.email.trim()) {
    errors.email = t("auth.login.errors.emailRequired");
  } else if (!EMAIL_PATTERN.test(form.email.trim())) {
    errors.email = t("auth.login.errors.emailInvalid");
  }

  if (!form.password) {
    errors.password = t("auth.login.errors.passwordRequired");
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

function LoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
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

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email.trim(),
      password: form.password,
    });

    if (error) {
      setStatus("error");
      setErrors((current) => ({
        ...current,
        form:
          error.message === "Invalid login credentials"
            ? t("auth.login.errors.invalidCredentials")
            : t("auth.login.errors.generic"),
      }));
      return;
    }

    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <FormField id="login-email" label={t("auth.login.fields.email.label")} error={errors.email}>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange("email")}
          placeholder={t("auth.login.fields.email.placeholder")}
          aria-invalid={Boolean(errors.email)}
          className={fieldClassName(Boolean(errors.email))}
        />
      </FormField>

      <FormField id="login-password" label={t("auth.login.fields.password.label")} error={errors.password}>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange("password")}
          placeholder={t("auth.login.fields.password.placeholder")}
          aria-invalid={Boolean(errors.password)}
          className={fieldClassName(Boolean(errors.password))}
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
        {status === "submitting" ? t("auth.login.submitting") : t("auth.login.submit")}
      </button>
    </form>
  );
}

export default function Login() {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const [cardRef, cardVisible] = useScrollReveal();

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            {t("auth.login.heading")}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-text-secondary">{t("auth.login.intro")}</p>
        </div>

        <div
          ref={cardRef}
          className={`gold-card reveal mt-12 p-8 sm:p-10 ${cardVisible ? "reveal-visible" : ""}`}
        >
          <span className="gold-corner-dot" aria-hidden="true" />
          <LoginForm />
        </div>

        <p className="mt-8 text-center text-sm text-text-muted">
          {t("auth.login.noAccount")}{" "}
          <Link to="/signup" className="font-medium text-gold-primary transition-colors hover:text-gold-light">
            {t("auth.login.signupLink")}
          </Link>
        </p>
      </div>
    </section>
  );
}
