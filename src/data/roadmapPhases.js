import { Building2, Rocket, TrendingUp, Hexagon, Compass } from "lucide-react";

const roadmapPhases = [
  {
    key: "infrastructure",
    Icon: Building2,
    items: ["treasuryModel", "app", "website", "telegram", "capitalization"],
  },
  {
    key: "launch",
    Icon: Rocket,
    items: ["botActivation", "referralOnboarding", "initialStaking", "dailyWheel", "pointsLevels", "bonusEcosystem"],
  },
  {
    key: "expansion",
    Icon: TrendingUp,
    items: ["treasuryGrowth", "participantCapacity", "depositNetworks", "stakingExpansion", "transparencyReporting", "aiExpansion"],
  },
  {
    key: "web3",
    Icon: Hexagon,
    items: ["daoArchitecture", "tokenomics", "daoToken", "tokenUtility", "dropsLevels", "ecosystemAccess"],
  },
  {
    key: "ecosystem",
    Icon: Compass,
    items: ["internationalExpansion", "fintechProducts", "aiSystems", "capitalProducts", "daoDevelopment", "blockchainIntegration"],
  },
];

export default roadmapPhases;
