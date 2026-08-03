export default function DashboardPreview() {
  return (
    <section className="bg-black py-24">
      <div className="mx-auto max-w-6xl px-8">

        <h2 className="mb-12 text-center text-5xl font-bold text-white">
          Dashboard Preview
        </h2>

        <div className="rounded-3xl border border-gray-800 bg-gray-900 p-10 shadow-xl">

          <div className="mb-10 flex items-center justify-between">

            <div>
              <p className="text-gray-400">
                Portfolio Balance
              </p>

              <h1 className="text-5xl font-bold text-white">
                $285,649,988
              </h1>
            </div>

            <div className="rounded-xl bg-green-500 px-5 py-2 font-bold text-black">
              +12.4%
            </div>

          </div>

          <div className="grid gap-6 md:grid-cols-3">

            <div className="rounded-xl bg-black p-6">
              <p className="text-gray-400">Bitcoin</p>
              <h3 className="mt-2 text-3xl font-bold">$120,340,876</h3>
            </div>

            <div className="rounded-xl bg-black p-6">
              <p className="text-gray-400">Ethereum</p>
              <h3 className="mt-2 text-3xl font-bold">$74,180,576</h3>
            </div>

            <div className="rounded-xl bg-black p-6">
              <p className="text-gray-400">Other Assets</p>
              <h3 className="mt-2 text-3xl font-bold">$91,128,538</h3>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}