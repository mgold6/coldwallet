export default function PortfolioChart() {
  return (
    <section className="bg-[#111827] border border-gray-800 rounded-2xl p-6 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Portfolio Performance
          </h2>

          <p className="text-gray-400 text-sm mt-1">
            Portfolio value over time
          </p>
        </div>

        <div className="flex gap-2">
          <button className="px-3 py-1 rounded-lg bg-cyan-500 text-black text-sm font-medium">
            7D
          </button>

          <button className="px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm">
            30D
          </button>

          <button className="px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm">
            90D
          </button>

          <button className="px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm">
            1Y
          </button>
        </div>
      </div>

      <div className="mt-8 h-80 rounded-xl bg-[#0B0F19] border border-dashed border-cyan-500/30 flex flex-col items-center justify-center">
        <div className="w-full px-10">
          <div className="relative h-40">
            <svg
              viewBox="0 0 600 200"
              className="w-full h-full"
              fill="none"
            >
              <path
                d="M0 170 C60 150, 120 120, 180 130 S300 70, 360 90 S480 30, 600 40"
                stroke="#22D3EE"
                strokeWidth="4"
                fill="none"
              />
            </svg>
          </div>
        </div>

        <p className="text-gray-400 mt-6">
          Interactive portfolio chart will appear here.
        </p>
      </div>
    </section>
  );
}