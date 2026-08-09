"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

const data = [
  { day: "1", value: 610000 },
  { day: "5", value: 640000 },
  { day: "10", value: 675000 },
  { day: "15", value: 720000 },
  { day: "20", value: 760000 },
  { day: "25", value: 830000 },
  { day: "30", value: 894790 },
];

export default function PortfolioChart() {
  return (
    <div className="h-72 w-full rounded-2xl bg-[#0B1220] p-5">

      <ResponsiveContainer width="100%" height="100%">

        <AreaChart data={data}>

          <defs>

            <linearGradient
              id="portfolioGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="#2563EB"
                stopOpacity={0.55}
              />

              <stop
                offset="95%"
                stopColor="#2563EB"
                stopOpacity={0}
              />

            </linearGradient>

          </defs>

          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "#94A3B8",
              fontSize: 12,
            }}
          />

          <Tooltip
            cursor={{
              stroke: "#3B82F6",
              strokeWidth: 1,
            }}
            contentStyle={{
              background: "#0F172A",
              border: "1px solid #1E293B",
              borderRadius: 12,
              color: "#fff",
            }}
            formatter={(value) => [
  `$${Number(value ?? 0).toLocaleString()}`,
  "Value",
]}
          />

          <Area
            type="monotone"
            dataKey="value"
            stroke="#3B82F6"
            strokeWidth={3}
            fill="url(#portfolioGradient)"
          />

        </AreaChart>

      </ResponsiveContainer>

    </div>
  );
}