import { useTranslation } from "react-i18next";
import { ShieldAlert } from "lucide-react";

export default function SecurityNotice({ className = "" }) {
  const { t } = useTranslation();

  return (
    <div
      className={`flex items-start gap-3 rounded-md border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200 ${className}`}
    >
      <ShieldAlert className="mt-0.5 h-4 w-4 flex-shrink-0" strokeWidth={2} />
      <p>{t("common.securityWarning")}</p>
    </div>
  );
}
