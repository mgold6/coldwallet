import { FaBitcoin, FaEthereum } from "react-icons/fa";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-black pt-36 pb-28">
      {/* Background Glow */}
      <div className="absolute left-1/2 top-10 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[180px]" />

      {/* Decorative Grid */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-8 lg:grid-cols-2">

        {/* LEFT SIDE */}
        <div>

          <span className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-sm font-semibold uppercase tracking-wider text-blue-400">
            Secure • Learn • Organize
          </span>

          <h1 className="mt-8 text-6xl font-extrabold leading-tight text-white md:text-7xl">
            Protect Your
            <span className="block text-blue-500">
              Digital Assets
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-xl leading-8 text-gray-400">
            ColdWallet helps individuals organize cryptocurrency portfolios,
            learn blockchain technology, and build better security habits
            through education and practical tools.
          </p>

          <div className="mt-12 flex flex-col gap-5 sm:flex-row">
            <Button>
              Get Started
            </Button>

            <Button variant="secondary">
              Learn More
            </Button>
          </div>

          <div className="mt-16 flex gap-10">

            <div>
              <h3 className="text-3xl font-bold text-white">
                10K+
              </h3>

              <p className="text-gray-500">
                Future Users
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-white">
                100+
              </h3>

              <p className="text-gray-500">
                Learning Articles
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-white">
                24/7
              </h3>

              <p className="text-gray-500">
                Security Resources
              </p>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="relative flex justify-center">

          <div className="relative w-full max-w-md rounded-3xl border border-blue-500/20 bg-[#10141F] p-10 shadow-2xl shadow-blue-500/20">

            <div className="mb-8 flex items-center justify-between">

              <div>

                <p className="text-gray-400">
                  Platform Preview
                </p>

                <h2 className="mt-2 text-3xl font-bold text-white">
                  ColdWallet
                </h2>

              </div>

              <div className="rounded-full bg-blue-600 p-4">
                <FaBitcoin className="text-3xl text-white" />
              </div>

            </div>

            <div className="space-y-5">

              <div className="rounded-2xl bg-black/40 p-5">
                <p className="text-sm text-gray-500">
                  Security Score
                </p>

                <h3 className="mt-2 text-2xl font-bold text-green-400">
                  Excellent
                </h3>
              </div>

              <div className="rounded-2xl bg-black/40 p-5">
                <p className="text-sm text-gray-500">
                  Portfolio Organization
                </p>

                <h3 className="mt-2 text-xl font-bold text-white">
                  Ready
                </h3>
              </div>

              <div className="rounded-2xl bg-black/40 p-5">
                <p className="text-sm text-gray-500">
                  Learning Progress
                </p>

                <h3 className="mt-2 text-xl font-bold text-white">
                  Beginner → Advanced
                </h3>
              </div>

            </div>

            <div className="absolute -right-6 -top-6 rounded-full bg-blue-600 p-5 shadow-lg shadow-blue-500/40">
              <FaEthereum className="text-4xl text-white" />
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}