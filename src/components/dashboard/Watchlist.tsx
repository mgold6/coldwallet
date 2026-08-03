export default function Watchlist() {
  return (
    <div className="rounded-2xl border border-gray-800 bg-[#111827] p-6">
      <h2 className="mb-6 text-2xl font-semibold text-white">
        Watchlist
      </h2>

      <div className="space-y-4">

        <div className="rounded-xl bg-[#0B0F19] p-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Bitcoin</span>
            <span className="text-green-400">$118,000</span>
          </div>
        </div>

        <div className="rounded-xl bg-[#0B0F19] p-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Ethereum</span>
            <span className="text-blue-400">$3,850</span>
          </div>
        </div>

        <div className="rounded-xl bg-[#0B0F19] p-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Solana</span>
            <span className="text-purple-400">$205</span>
          </div>
        </div>

      </div>
    </div>
  );
}