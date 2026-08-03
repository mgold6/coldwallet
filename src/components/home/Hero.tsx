import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-black pt-32 pb-24">
      {/* Background Glow */}
      <div className="absolute left-1/2 top-0 h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[160px]" />

      <div className="relative mx-auto max-w-7xl px-8">

        <div className="mx-auto max-w-4xl text-center">

          <span className="inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-sm font-medium text-blue-300">
            Secure • Learn • Organize
          </span>

          <h1 className="mt-8 text-6xl font-extrabold leading-tight text-white md:text-7xl">
            Protect Your
            <span className="block text-blue-500">
              Digital Assets
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-8 text-gray-400">
            ColdWallet empowers individuals to securely manage cryptocurrency,
            organize portfolios, learn blockchain technology, and build
            confidence through security-focused education.
          </p>

          <div className="mt-12 flex flex-col justify-center gap-5 sm:flex-row">
            <Button>
              Get Started
            </Button>

            <Button variant="secondary">
              Learn More
            </Button>
          </div>

        </div>

      </div>
    </section>
  );
}