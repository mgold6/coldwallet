export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-black pt-32 pb-24">
      {/* Background Glow */}
      <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-8">

        <div className="mx-auto max-w-4xl text-center">

          <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-sm text-blue-300">
            Secure • Learn • Organize
          </span>

          <h1 className="mt-8 text-6xl font-extrabold leading-tight text-white md:text-7xl">
            Protect Your
            <span className="block text-blue-500">
              Digital Assets
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-8 text-gray-400">
            ColdWallet helps individuals securely manage cryptocurrency,
            organize portfolios, understand blockchain technology,
            and learn industry best practices for protecting digital assets.
          </p>

          <div className="mt-12 flex flex-col justify-center gap-5 sm:flex-row">

            <button className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold transition hover:bg-blue-700">
              Get Started
            </button>

            <button className="rounded-xl border border-gray-700 px-8 py-4 text-lg font-semibold transition hover:border-blue-500">
              Learn More
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}