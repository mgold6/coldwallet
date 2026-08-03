import Link from "next/link";

export default function QuickActions() {
  return (
    <div className="rounded-2xl border border-gray-800 bg-[#111827] p-6">

      <h2 className="mb-6 text-2xl font-semibold text-white">
        Quick Actions
      </h2>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <Link
          href="/dashboard/portfolio"
          className="rounded-xl bg-blue-600 p-5 text-center font-semibold transition hover:bg-blue-700"
        >
          Add Asset
        </Link>

        <Link
          href="/dashboard/wallets"
          className="rounded-xl bg-cyan-600 p-5 text-center font-semibold transition hover:bg-cyan-700"
        >
          Connect Wallet
        </Link>

        <Link
          href="/dashboard/markets"
          className="rounded-xl bg-purple-600 p-5 text-center font-semibold transition hover:bg-purple-700"
        >
          Live Markets
        </Link>

        <Link
          href="/learn"
          className="rounded-xl bg-green-600 p-5 text-center font-semibold transition hover:bg-green-700"
        >
          Learning Center
        </Link>

      </div>

    </div>
  );
}