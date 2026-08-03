export default function WhyColdWallet() {
  const cards = [
    {
      title: "Enterprise Security",
      description:
        "Industry best practices to help protect digital assets and sensitive wallet information.",
      icon: "🔐",
    },
    {
      title: "Portfolio Organization",
      description:
        "Keep your cryptocurrency investments organized in one secure place.",
      icon: "📊",
    },
    {
      title: "Learning Center",
      description:
        "Master blockchain, cold wallets, private keys, and cryptocurrency security.",
      icon: "📚",
    },
    {
      title: "Compliance Resources",
      description:
        "Access educational resources and compliance guidance for digital assets.",
      icon: "⚖️",
    },
  ];

  return (
    <section className="bg-[#05070D] py-28">
      <div className="mx-auto max-w-7xl px-8">

        <div className="mb-16 text-center">

          <span className="rounded-full bg-blue-500/10 px-4 py-2 text-blue-400">
            WHY CHOOSE COLDWALLET
          </span>

          <h2 className="mt-6 text-5xl font-bold text-white">
            Built Around Security & Education
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-400">
            ColdWallet helps users learn, organize, and protect digital assets
            through education, portfolio management, and security-first design.
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {cards.map((card) => (

            <div
              key={card.title}
              className="rounded-3xl border border-gray-800 bg-[#10141F] p-8 transition duration-300 hover:-translate-y-2 hover:border-blue-500"
            >

              <div className="mb-6 text-5xl">
                {card.icon}
              </div>

              <h3 className="mb-4 text-2xl font-bold text-white">
                {card.title}
              </h3>

              <p className="text-gray-400">
                {card.description}
              </p>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}