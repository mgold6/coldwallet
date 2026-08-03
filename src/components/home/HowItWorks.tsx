export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Create Your Account",
      description:
        "Sign up securely and personalize your ColdWallet experience.",
    },
    {
      number: "02",
      title: "Organize Your Assets",
      description:
        "Track wallets, monitor your portfolio, and stay informed with market insights.",
    },
    {
      number: "03",
      title: "Learn & Protect",
      description:
        "Explore educational resources and security best practices to protect your digital assets.",
    },
  ];

  return (
    <section className="bg-[#05070D] py-24">
      <div className="mx-auto max-w-7xl px-8">

        <div className="text-center mb-16">
          <span className="rounded-full bg-blue-500/10 px-4 py-2 text-blue-400 text-sm">
            HOW IT WORKS
          </span>

          <h2 className="mt-6 text-5xl font-bold text-white">
            Three Simple Steps
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-400">
            ColdWallet makes it easy to learn, organize, and protect your cryptocurrency journey.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-3xl border border-gray-800 bg-[#10141F] p-10 transition duration-300 hover:-translate-y-2 hover:border-blue-500"
            >
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
                {step.number}
              </div>

              <h3 className="mb-4 text-2xl font-bold text-white">
                {step.title}
              </h3>

              <p className="text-gray-400 leading-7">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}