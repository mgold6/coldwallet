import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0B0F19] text-white">
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center">
          <h1 className="text-5xl font-bold">
            About ColdWallet
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-xl text-gray-400">
            ColdWallet is a security-first platform designed to help people at
            every stage of their cryptocurrency journey. Whether you&apos;re learning
            about blockchain for the first time or managing a growing digital
            asset portfolio, ColdWallet provides the tools and education to help
            you make informed decisions.
          </p>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-800 bg-[#111827] p-8">
            <h2 className="text-2xl font-semibold text-cyan-400">
              Our Mission
            </h2>

            <p className="mt-4 leading-8 text-gray-300">
              Empower everyone to securely learn, manage, and grow their digital
              assets through education, transparency, and modern technology.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-[#111827] p-8">
            <h2 className="text-2xl font-semibold text-cyan-400">
              Our Vision
            </h2>

            <p className="mt-4 leading-8 text-gray-300">
              Build one trusted platform where cryptocurrency education,
              portfolio management, and digital asset security come together.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-[#111827] p-8">
            <h2 className="text-2xl font-semibold text-cyan-400">
              Our Values
            </h2>

            <ul className="mt-4 space-y-3 text-gray-300">
              <li>🔐 Security First</li>
              <li>📚 Education</li>
              <li>🤝 Transparency</li>
              <li>🚀 Innovation</li>
              <li>🌍 Accessibility</li>
            </ul>
          </div>
        </div>

        <div className="mt-20 text-center">
          <Link
            href="/register"
            className="rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
          >
            Get Started
          </Link>
        </div>
      </section>
    </main>
  );
}