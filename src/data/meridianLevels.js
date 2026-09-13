import { Medal, Shield, Star, Gem, Crown } from "lucide-react";

// Gold intensity escalates from Bronze (muted) to Obsidian (strongest glow).
const meridianLevels = [
  { key: "bronze", Icon: Medal, color: "var(--color-gold-dark)", borderOpacity: 35, bgOpacity: 6, glow: 0 },
  { key: "silver", Icon: Shield, color: "var(--color-gold-dark)", borderOpacity: 55, bgOpacity: 9, glow: 10 },
  { key: "gold", Icon: Star, color: "var(--color-gold-primary)", borderOpacity: 55, bgOpacity: 11, glow: 18 },
  { key: "platinum", Icon: Gem, color: "var(--color-gold-primary)", borderOpacity: 75, bgOpacity: 15, glow: 26 },
  { key: "obsidian", Icon: Crown, color: "var(--color-gold-light)", borderOpacity: 95, bgOpacity: 20, glow: 38 },
];

export default meridianLevels;
