import Navbar from "@/components/Navbar";
export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
<Navbar />

      {/* Hero Section */}
      <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">

        <h1 className="text-5xl font-bold md:text-7xl">
          Protect Your Digital Assets
          <br />
          With Knowledge
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-gray-400">
          Learn cryptocurrency security, organize your digital asset
          portfolio, and explore educational resources designed to help
          you understand blockchain technology with confidence.
        </p>

        <div className="mt-8 flex gap-4">

          <button className="rounded-xl bg-blue-500 px-6 py-3 font-semibold hover:bg-blue-600">
            Start Learning
          </button>

          <button className="rounded-xl border border-gray-700 px-6 py-3 font-semibold hover:bg-gray-900">
            Explore Resources
          </button>

        </div>

      </section>


      {/* Features */}
      <section className="px-6 py-20">

        <h2 className="mb-12 text-center text-4xl font-bold">
          Learn. Organize. Protect.
        </h2>


        <div className="grid gap-8 md:grid-cols-3">

          <div className="rounded-2xl bg-gray-900 p-8">
            <h3 className="text-xl font-bold">
              Cold Wallet Education
            </h3>

            <p className="mt-3 text-gray-400">
              Learn best practices for offline storage,
              hardware wallets, and digital asset security.
            </p>
          </div>


          <div className="rounded-2xl bg-gray-900 p-8">

            <h3 className="text-xl font-bold">
              Portfolio Organization
            </h3>

            <p className="mt-3 text-gray-400">
              Track and organize your digital assets
              with simple portfolio management tools.
            </p>

          </div>


          <div className="rounded-2xl bg-gray-900 p-8">

            <h3 className="text-xl font-bold">
              Blockchain Compliance
            </h3>

            <p className="mt-3 text-gray-400">
              Explore educational information about
              blockchain records and compliance topics.
            </p>

          </div>

        </div>

      </section>


      {/* Security Section */}

      <section className="bg-gray-950 px-6 py-20 text-center">

        <h2 className="text-4xl font-bold">
          Security Starts With Knowledge
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-gray-400">
          Understand how to protect your accounts,
          organize your information, and make informed
          decisions about digital assets.
        </p>

      </section>


    </main>
  );
}