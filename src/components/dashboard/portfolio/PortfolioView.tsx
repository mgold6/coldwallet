import Link from "next/link";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import {
  Plus,
  Wallet,
  BarChart3,
  BookOpen,
} from "lucide-react";

export default function PortfolioPage() {
  return (
    <div className="min-h-screen flex bg-[#0B0F19] text-white">
      <Sidebar />

      <main className="flex-1 p-8">
        <Header />

        <div className="mt-10">
          <h1 className="text-4xl font-bold">
            Portfolio
          </h1>

          <p className="mt-3 text-gray-400">
            Welcome to your portfolio dashboard. Once you add or connect
            assets, you&apos;ll be able to monitor performance, allocation,
            and market value from one secure location.
          </p>
        </div>

        {/* Summary Card */}

        <section className="mt-10 rounded-2xl border border-gray-800 bg-[#111827] p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">
                Total Portfolio Value
              </p>

              <h2 className="mt-4 text-5xl font-bold">
                $0.00
              </h2>

              <p className="mt-3 text-gray-500">
                No digital assets have been added yet.
              </p>
            </div>

            <Wallet className="h-16 w-16 text-cyan-400" />
          </div>
        </section>

        {/* Quick Actions */}

        <section className="mt-10">
          <h2 className="mb-6 text-2xl font-semibold">
            Quick Actions
          </h2>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <Link
              href="#"
              className="rounded-2xl border border-gray-800 bg-[#111827] p-6 transition hover:border-cyan-400"
            >
              <Plus className="mb-4 h-8 w-8 text-cyan-400" />

              <h3 className="text-xl font-semibold">
                Add First Asset
              </h3>

              <p className="mt-3 text-gray-400">
                Create your portfolio by adding your first cryptocurrency.
              </p>
            </Link>

            <Link
              href="/dashboard/wallets"
              className="rounded-2xl border border-gray-800 bg-[#111827] p-6 transition hover:border-cyan-400"
            >
              <Wallet className="mb-4 h-8 w-8 text-cyan-400" />

              <h3 className="text-xl font-semibold">
                Connect Wallet
              </h3>

              <p className="mt-3 text-gray-400">
                Securely connect a compatible wallet to begin tracking.
              </p>
            </Link>

            <Link
              href="/dashboard/markets"
              className="rounded-2xl border border-gray-800 bg-[#111827] p-6 transition hover:border-cyan-400"
            >
              <BarChart3 className="mb-4 h-8 w-8 text-cyan-400" />

              <h3 className="text-xl font-semibold">
                View Markets
              </h3>

              <p className="mt-3 text-gray-400">
                Monitor live cryptocurrency prices and market activity.
              </p>
            </Link>

            <Link
              href="/learn"
              className="rounded-2xl border border-gray-800 bg-[#111827] p-6 transition hover:border-cyan-400"
            >
              <BookOpen className="mb-4 h-8 w-8 text-cyan-400" />

              <h3 className="text-xl font-semibold">
                Learning Center
              </h3>

              <p className="mt-3 text-gray-400">
                Improve your blockchain knowledge and security skills.
              </p>
            </Link>
          </div>
        </section>

        {/* Empty State */}

        <section className="mt-12 rounded-2xl border border-dashed border-gray-700 p-12 text-center">
          <h2 className="text-3xl font-semibold">
            Your Portfolio is Empty
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-400">
            Start by adding your first digital asset or connecting a wallet.
            Once assets are available, ColdWallet will automatically display
            allocation, historical performance, and portfolio insights.
          </p>

          <Link
            href="#"
            className="mt-8 inline-block rounded-xl bg-blue-600 px-8 py-4 font-semibold transition hover:bg-blue-700"
          >
            Add Your First Asset
          </Link>
        </section>
      </main>
    </div>
  );
}