const categories = [
  {
    title: "Crypto Basics",
    icon: "🪙",
    description:
      "Understand cryptocurrency fundamentals, digital assets, tokens, exchanges, and how blockchain technology powers the crypto ecosystem.",
    topics: [
      "What is cryptocurrency?",
      "How digital assets work",
      "Coins vs tokens",
      "Understanding crypto terminology",
    ],
  },
  {
    title: "Bitcoin & Ethereum",
    icon: "₿",
    description:
      "Explore the foundations of Bitcoin and Ethereum, the largest blockchain ecosystems powering the digital asset economy.",
    topics: [
      "Bitcoin fundamentals",
      "Ethereum and smart contracts",
      "Blockchain networks",
      "Decentralized applications",
    ],
  },
  {
    title: "Wallet Security",
    icon: "🔐",
    description:
      "Learn how cryptocurrency wallets work and how security practices help protect digital assets.",
    topics: [
      "Hot vs cold wallets",
      "Wallet protection",
      "Authentication practices",
      "Security awareness",
    ],
  },
  {
    title: "Private Keys & Seed Phrases",
    icon: "🔑",
    description:
      "Understand ownership, recovery methods, and why protecting wallet credentials is essential.",
    topics: [
      "Private keys explained",
      "Seed phrase protection",
      "Backup strategies",
      "Common security mistakes",
    ],
  },
  {
    title: "Blockchain Fundamentals",
    icon: "⛓️",
    description:
      "Learn how blockchain networks process transactions and maintain decentralized records.",
    topics: [
      "Transactions",
      "Validators",
      "Networks",
      "Consensus mechanisms",
    ],
  },
  {
    title: "Portfolio Organization",
    icon: "📊",
    description:
      "Learn how to organize digital assets and build better portfolio management habits.",
    topics: [
      "Asset tracking",
      "Wallet organization",
      "Portfolio monitoring",
      "Digital asset management",
    ],
  },
  {
    title: "Security Best Practices",
    icon: "🛡️",
    description:
      "Develop stronger security habits for managing digital assets responsibly.",
    topics: [
      "Account protection",
      "Privacy practices",
      "Security checklist",
      "Risk awareness",
    ],
  },
];

export default function LearnPage() {
  return (
    <main className="min-h-screen bg-[#070b16] py-24">
      <section className="mx-auto max-w-7xl px-6">
        {/* Hero */}

        <div className="text-center">
          <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-sm font-semibold text-blue-400">
            COLDWALLET LEARNING CENTER
          </span>

          <h1 className="mt-8 text-5xl font-bold text-white md:text-6xl">
            Learn.
            <span className="block text-blue-400">
              Understand.
            </span>
            Secure Your Digital Future.
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-400">
            Explore cryptocurrency education, blockchain fundamentals,
            wallet security, and digital asset management resources
            designed for beginners through advanced users.
          </p>
        </div>

        {/* Categories */}

        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.title}
              className="
                rounded-3xl
                border
                border-white/10
                bg-[#111827]
                p-8
                shadow-xl
                transition
                hover:-translate-y-2
                hover:border-blue-500/40
              "
            >
              <div className="text-4xl">
                {category.icon}
              </div>

              <h2 className="mt-6 text-2xl font-bold text-white">
                {category.title}
              </h2>

              <p className="mt-4 leading-7 text-slate-400">
                {category.description}
              </p>

              <ul className="mt-6 space-y-3 text-slate-300">
                {category.topics.map((topic) => (
                  <li key={topic}>
                    ✓ {topic}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className="
                  mt-8
                  rounded-xl
                  bg-blue-600
                  px-6
                  py-3
                  font-semibold
                  text-white
                  hover:bg-blue-500
                "
              >
                Explore Guide
              </button>
            </div>
          ))}
        </div>

        {/* Learning Path */}

        <div className="mt-24 rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-600/10 to-purple-600/10 p-10 text-center">
          <h2 className="text-3xl font-bold text-white">
            Learning Paths
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-black/30 p-6">
              <h3 className="text-xl font-bold text-blue-400">
                Beginner
              </h3>

              <p className="mt-3 text-slate-400">
                Crypto basics, blockchain concepts, and wallet fundamentals.
              </p>
            </div>

            <div className="rounded-2xl bg-black/30 p-6">
              <h3 className="text-xl font-bold text-blue-400">
                Intermediate
              </h3>

              <p className="mt-3 text-slate-400">
                Security practices, portfolio organization, and asset management.
              </p>
            </div>

            <div className="rounded-2xl bg-black/30 p-6">
              <h3 className="text-xl font-bold text-blue-400">
                Advanced
              </h3>

              <p className="mt-3 text-slate-400">
                Blockchain technology, networks, and advanced digital asset concepts.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}