import {
  ShieldCheck,
  Wallet,
  ChartNoAxesCombined,
  LockKeyhole,
} from "lucide-react";

export default function ProductShowcase() {
  return (
    <section className="py-28">
      <div className="mx-auto max-w-7xl px-6">

        {/* First Showcase */}

        <div className="grid items-center gap-16 lg:grid-cols-2">

          <div>

            <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-sm font-semibold tracking-wide text-blue-400">
              DIGITAL ASSET CONTROL
            </span>

            <h2 className="mt-8 text-5xl font-bold leading-tight text-white">
              Take Control of Your Digital Assets
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
              ColdWallet gives you the tools to organize wallets,
              track portfolios, and understand your digital assets
              from one secure platform.
            </p>

            <button
              className="
                mt-8
                rounded-full
                bg-blue-600
                px-8
                py-4
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
              rounded-[32px]
              border
              border-white/10
              bg-[#111827]
              p-8
              shadow-2xl
            "
          >

            <div className="rounded-3xl bg-black/40 p-6">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-slate-400">
                    Portfolio Balance
                  </p>

                  <h3 className="mt-2 text-4xl font-bold text-white">
                    $285,649,988.83
                  </h3>
                </div>

                <Wallet className="h-12 w-12 text-blue-400" />

              </div>


              <div className="mt-8 space-y-4">

                <div className="flex justify-between rounded-xl border border-white/10 p-4">
                  <span className="text-slate-300">
                    Bitcoin
                  </span>

                  <span className="font-semibold text-white">
                    $122,511,852.65
                  </span>
                </div>


                <div className="flex justify-between rounded-xl border border-white/10 p-4">
                  <span className="text-slate-300">
                    Ethereum
                  </span>

                  <span className="font-semibold text-white">
                    $94,228,654.90
                  </span>
                </div>


                <div className="flex justify-between rounded-xl border border-white/10 p-4">
                  <span className="text-slate-300">
                    Solana
                  </span>

                  <span className="font-semibold text-white">
                    $50,904,480.22
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>



        {/* Second Showcase */}

        <div className="mt-32 grid items-center gap-16 lg:grid-cols-2">

          <div className="order-2 lg:order-1">

            <div
              className="
                grid
                gap-6
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

            <h2 className="mt-8 text-5xl font-bold leading-tight text-white">
              Security Designed Around Your Digital Future
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-400">
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
    <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">

      <div className="mb-5 text-blue-400">
        {icon}
      </div>

      <h3 className="text-xl font-bold text-white">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        {text}
      </p>

    </div>
  );
}