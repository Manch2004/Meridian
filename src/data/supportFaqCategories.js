// Support-page FAQ content, grouped by the same 10 categories used for
// support tickets (see ticketOptions.js) so a visitor who can't find an
// answer here lands in the matching ticket category. Category display names
// are intentionally NOT duplicated here -- they reuse the myTickets.categories
// translation keys already defined for tickets.

export const SUPPORT_FAQ_CATEGORIES = [
  {
    key: "accountVerification",
    items: ["howToVerify", "forgotPassword", "changeEmailUsername", "accountAccessIssue"],
  },
  {
    key: "deposit",
    items: ["howToDeposit", "depositNotShowing", "whichAssets", "minimumDeposit"],
  },
  {
    key: "withdrawal",
    items: ["howWithdrawalWorks", "withdrawalPending", "withdrawalFees", "cancelWithdrawal"],
  },
  {
    key: "staking",
    items: ["stakingProductsList", "performanceFeeMeaning", "switchStakingProduct", "stakingLossRisk"],
  },
  {
    key: "bonusesPoints",
    items: ["bonusTypes", "howPointsEarned", "meridianLevels", "dailyWheel"],
  },
  {
    key: "referralSystem",
    items: ["howReferralWorks", "referralBonusAmount", "referralNotCredited", "multipleReferrals"],
  },
  {
    key: "meridianFund",
    items: ["whatIsFund", "howPerformanceCalculated", "pastPerformanceGuarantee", "fundTransparency"],
  },
  {
    key: "technicalProblems",
    items: ["appNotLoading", "loginError", "transactionStuck", "reportBug"],
  },
  {
    key: "security",
    items: ["accountSecurityTips", "neverAskCredentials", "suspiciousActivity", "walletSecurityInfra"],
  },
  {
    key: "other",
    items: ["contactMethods", "languageSupport", "futureFeatures", "generalOther"],
  },
];
