"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface PortfolioChartProps {
  data: {
    date: string;
    value: number;
  }[];
}

export default function PortfolioChart({
  data,
}: PortfolioChartProps) {
  return (
    <section className="rounded-2xl border border-gray-800 bg-[#111827] p-6 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Portfolio Performance
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Portfolio value over time
          </p>
        </div>

        <div className="flex gap-2">
          <button className="rounded-lg bg-cyan-500 px-3 py-1 text-sm font-medium text-black">
            All
          </button>
        </div>
      </div>

      <div className="mt-8 h-80">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-cyan-500/30 bg-[#0B0F19]">
            <p className="text-gray-400">
              No portfolio history yet.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
              />

              <YAxis
                tick={{ fontSize: 12 }}
              />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="value"
                stroke="#22D3EE"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}