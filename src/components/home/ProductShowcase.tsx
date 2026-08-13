import {
  ShieldCheck,
  Wallet,
  ChartNoAxesCombined,
  LockKeyhole,
} from "lucide-react";

export default function ProductShowcase() {
  return (
    <section className="py-16 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* First Showcase */}

        <div className="grid items-center gap-10 sm:gap-16 lg:grid-cols-2">

          <div>

            <span className="inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-xs font-semibold tracking-wide text-blue-400 sm:px-5 sm:text-sm">
              DIGITAL ASSET CONTROL
            </span>

            <h2 className="mt-6 text-3xl font-bold leading-tight text-white sm:mt-8 sm:text-4xl lg:text-5xl">
              Take Control of Your Digital Assets
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-400 sm:mt-6 sm:text-lg sm:leading-8">
              ColdWallet gives you the tools to organize wallets,
              track portfolios, and understand your digital assets
              from one secure platform.
            </p>

            <button
              className="
                mt-6
                w-full
                rounded-full
                bg-blue-600
                px-6
                py-3
                sm:mt-8
                sm:w-auto
                sm:px-8
                sm:py-4
                font-semibold
                text-white
                transition
                hover:bg-blue-700
              "
            >
              Explore Platform
            </button>

          </div>


          {/* Dashboard Mockup */}

          <div
            className="
              min-w-0
              rounded-[32px]
              border
              border-white/10
              bg-[#111827]
              p-4
              sm:p-8
              shadow-2xl
            "
          >

            <div className="min-w-0 rounded-3xl bg-black/40 p-4 sm:p-6">

              <div className="flex items-center justify-between gap-3">

                <div>
                  <p className="text-sm text-slate-400">
                    Portfolio Balance
                  </p>

                  <h3 className="mt-2 break-words text-2xl font-bold text-white sm:text-4xl">
                    Portfolio Tracking
                  </h3>
                </div>

                <Wallet className="h-12 w-12 text-blue-400" />

              </div>


              <div className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">

                <div className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-white/10 p-3 sm:p-4">
                  <span className="text-slate-300">
                    Bitcoin
                  </span>

                  <span className="break-words text-right font-semibold text-white">
                    Tracked Asset
                  </span>
                </div>


                <div className="flex justify-between rounded-xl border border-white/10 p-4">
                  <span className="text-slate-300">
                    Ethereum
                  </span>

                  <span className="font-semibold text-white">
                    Tracked Asset
                  </span>
                </div>


                <div className="flex justify-between rounded-xl border border-white/10 p-4">
                  <span className="text-slate-300">
                    Solana
                  </span>

                  <span className="font-semibold text-white">
                    Tracked Asset
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>



        {/* Second Showcase */}

        <div className="mt-20 grid items-center gap-10 sm:mt-32 sm:gap-16 lg:grid-cols-2">

          <div className="order-2 lg:order-1">

            <div
              className="
                grid
                gap-4
                sm:gap-6
                sm:grid-cols-2
              "
            >

              <Feature
                icon={<ShieldCheck />}
                title="Advanced Security"
                text="Protect your accounts and digital assets with security-first tools."
              />

              <Feature
                icon={<LockKeyhole />}
                title="Privacy Focused"
                text="Keep control of your information with privacy-focused design."
              />

              <Feature
                icon={<ChartNoAxesCombined />}
                title="Portfolio Insights"
                text="Understand your holdings with organized portfolio tracking."
              />

              <Feature
                icon={<Wallet />}
                title="Wallet Organization"
                text="Manage multiple wallets and supported networks easily."
              />

            </div>

          </div>


          <div className="order-1 lg:order-2">

            <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-sm font-semibold tracking-wide text-blue-400">
              SECURITY FIRST
            </span>

            <h2 className="mt-6 text-3xl font-bold leading-tight text-white sm:mt-8 sm:text-4xl lg:text-5xl">
              Security Designed Around Your Digital Future
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-400 sm:mt-6 sm:text-lg sm:leading-8">
              Learn best practices, organize your assets,
              and build confidence through education and
              security-focused technology.
            </p>

          </div>

        </div>


      </div>
    </section>
  );
}


function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111827] p-5 sm:p-6">

      <div className="mb-4 text-blue-400 sm:mb-5">
        {icon}
      </div>

      <h3 className="text-lg font-bold text-white sm:text-xl">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        {text}
      </p>

    </div>
  );
}