import { useTranslation } from "react-i18next";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { fundUnitPriceHistory } from "../data/fundDemoData";

function ChartTooltip({ active, payload, label }) {
  const { t } = useTranslation();
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="gold-card px-3 py-2 text-sm shadow-lg">
      <p className="text-text-dim">{label}</p>
      <p className="mt-1 font-mono text-text-main">
        {t("fund.chartTooltipUnitPrice")}:{" "}
        <span className="text-gold-primary">${payload[0].value.toFixed(2)}</span>
      </p>
    </div>
  );
}

export default function FundChart() {
  const { t } = useTranslation();

  const chartData = fundUnitPriceHistory.map((point) => ({
    ...point,
    label: t(`fund.months.${point.monthKey}`),
  }));

  return (
    <div className="h-72 w-full sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 12, left: -8, bottom: 0 }}>
          <CartesianGrid stroke="#272b322e" vertical={false} />
          <XAxis
            dataKey="label"
            stroke="#272b321a"
            tick={{ fill: "#9a9fa8", fontSize: 12, fontFamily: "Inter, sans-serif" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#272b321a"
            tick={{ fill: "#9a9fa8", fontSize: 12, fontFamily: "JetBrains Mono, monospace" }}
            tickLine={false}
            axisLine={false}
            domain={["dataMin - 0.02", "dataMax + 0.02"]}
            tickFormatter={(value) => `$${value.toFixed(2)}`}
            width={56}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#c9a2274d", strokeWidth: 1 }} />
          <Line
            type="monotone"
            dataKey="unitPrice"
            stroke="#c9a227"
            strokeWidth={2}
            dot={{ r: 3, fill: "#c9a227", strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
