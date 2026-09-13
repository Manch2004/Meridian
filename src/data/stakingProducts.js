import { Infinity as InfinityIcon, CalendarDays, CalendarRange, CalendarClock } from "lucide-react";

const stakingProducts = [
  { key: "flexible", Icon: InfinityIcon, fee: 20 },
  { key: "oneDay", Icon: CalendarDays, fee: 10 },
  { key: "oneWeek", Icon: CalendarRange, fee: 5 },
  { key: "oneMonth", Icon: CalendarClock, fee: 3 },
];

export const stakingFeeExample = {
  generatedProfit: 10,
  feePercent: 10,
  meridianFee: 1,
  participantShare: 9,
};

export default stakingProducts;
