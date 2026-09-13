// Values here must match the `category`/`status` CHECK constraints in
// supabase/schema.sql exactly -- they're stored in the database as-is,
// independent of the active UI language, and mapped to translation keys
// for display.

export const TICKET_CATEGORIES = [
  { value: "Account & Verification", key: "accountVerification" },
  { value: "Deposit", key: "deposit" },
  { value: "Withdrawal", key: "withdrawal" },
  { value: "Staking", key: "staking" },
  { value: "Bonuses & Points", key: "bonusesPoints" },
  { value: "Referral System", key: "referralSystem" },
  { value: "Meridian Fund", key: "meridianFund" },
  { value: "Technical Problems", key: "technicalProblems" },
  { value: "Security", key: "security" },
  { value: "Other", key: "other" },
];

export const TICKET_STATUSES = [
  { value: "Open", key: "open" },
  { value: "In Progress", key: "inProgress" },
  { value: "Waiting for User", key: "waitingForUser" },
  { value: "Resolved", key: "resolved" },
  { value: "Closed", key: "closed" },
];

export const STATUS_BADGE_CLASSES = {
  Open: "border-gold-primary/30 bg-gold-primary/12 text-gold-primary",
  "In Progress": "border-blue-500/30 bg-blue-500/10 text-blue-300",
  "Waiting for User": "border-amber-500/30 bg-amber-500/10 text-amber-300",
  Resolved: "border-green-500/30 bg-green-500/10 text-green-300",
  Closed: "border-border-default bg-bg-secondary text-text-dim",
};

export function categoryTranslationKey(value) {
  return TICKET_CATEGORIES.find((category) => category.value === value)?.key;
}

export function statusTranslationKey(value) {
  return TICKET_STATUSES.find((status) => status.value === value)?.key;
}
