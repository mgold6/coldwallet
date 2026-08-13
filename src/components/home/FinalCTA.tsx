import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[28px] border border-blue-500/30 bg-gradient-to-br from-blue-600/20 via-[#111827] to-purple-600/20 p-6 text-center shadow-2xl sm:rounded-[36px] sm:p-10 md:rounded-[40px] md:p-20">
          <div className="absolute inset-0 bg-blue-500/5 blur-3xl" />

          <div className="relative">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10 sm:h-16 sm:w-16">
              <ShieldCheck className="h-7 w-7 text-blue-400 sm:h-8 sm:w-8" />
            </div>

            <h2 className="mt-6 text-3xl font-bold leading-tight text-white sm:mt-8 sm:text-4xl md:text-6xl">
              Secure Your
              <span className="block text-blue-400">
                Digital Future
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-400 sm:mt-6 sm:text-lg sm:leading-8">
              Organize your wallets, track your portfolio, and build
              confidence with security-focused digital asset tools.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
              <Link
                href="/register"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 sm:w-auto sm:px-8 sm:py-4"
              >
                Create Free Account
                <ArrowRight className="h-5 w-5" />
              </Link>

              <Link
                href="/#security"
                className="w-full rounded-full border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white backdrop-blur-xl transition hover:bg-white/10 sm:w-auto sm:px-8 sm:py-4"
              >
                Explore Security
              </Link>
            </div>

            <p className="mt-6 text-xs leading-6 text-slate-500 sm:mt-8 sm:text-sm">
              Security education • Portfolio organization • Blockchain
              resources
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}