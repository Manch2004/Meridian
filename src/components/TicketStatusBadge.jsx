import { useTranslation } from "react-i18next";
import { STATUS_BADGE_CLASSES, statusTranslationKey } from "../data/ticketOptions";

export default function TicketStatusBadge({ status }) {
  const { t } = useTranslation();
  const key = statusTranslationKey(status);

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${
        STATUS_BADGE_CLASSES[status] || STATUS_BADGE_CLASSES.Closed
      }`}
    >
      {key ? t(`myTickets.statuses.${key}`) : status}
    </span>
  );
}
