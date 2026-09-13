import { Navigate, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useAuth from "../hooks/useAuth";
import useProfile from "../hooks/useProfile";

const STAFF_ROLES = ["support", "admin"];

export default function RequireStaff() {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();

  if (authLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (profileLoading) return null;

  if (!profile || !STAFF_ROLES.includes(profile.role)) {
    return (
      <section className="px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            {t("admin.forbidden.heading")}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-text-secondary">
            {t("admin.forbidden.description")}
          </p>
        </div>
      </section>
    );
  }

  return <Outlet />;
}
