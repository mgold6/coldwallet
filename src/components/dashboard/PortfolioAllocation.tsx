"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PortfolioAllocationProps {
  data: {
    name: string;
    value: number;
  }[];
}

const COLORS = [
  "#22D3EE",
  "#3B82F6",
  "#8B5CF6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
  "#14B8A6",
  "#84CC16",
  "#F97316",
];

export default function PortfolioAllocation({
  data,
}: PortfolioAllocationProps) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-[#111827] p-6">
      <h2 className="text-2xl font-semibold text-white">
        Portfolio Allocation
      </h2>

      <p className="mt-1 text-sm text-gray-400">
        Asset distribution across your wallets
      </p>

      <div className="mt-6 h-72">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-cyan-500/30 bg-[#0B0F19]">
            <p className="text-gray-400">
              No assets available.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                outerRadius={95}
                label
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {data.length > 0 && (
        <div className="mt-6 space-y-2">
          {data.map((asset, index) => (
            <div
              key={asset.name}
              className="flex items-center justify-between rounded-lg bg-[#0B0F19] px-4 py-2"
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor:
                      COLORS[index % COLORS.length],
                  }}
                />

                <span className="font-medium text-white">
                  {asset.name}
                </span>
              </div>

              <span className="text-gray-300">
                {asset.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}