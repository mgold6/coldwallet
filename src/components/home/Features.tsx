export default function Features() {
  const features = [
    {
      title: "Cold Wallet Security",
      description:
        "Learn industry best practices for keeping your digital assets offline and protected.",
      icon: "🔒",
    },
    {
      title: "Portfolio Tracking",
      description:
        "Organize your cryptocurrency holdings with a clean dashboard.",
      icon: "📊",
    },
    {
      title: "Blockchain Education",
      description:
        "Guides, tutorials, and resources for beginners and professionals.",
      icon: "📚",
    },
    {
      title: "Compliance",
      description:
        "Stay informed about regulations and digital asset compliance.",
      icon: "⚖️",
    },
  ];

  return (
    <section className="bg-black py-24">
      <div className="mx-auto max-w-7xl px-8">
        <h2 className="mb-4 text-center text-5xl font-bold text-white">
          Why ColdWallet?
        </h2>

        <p className="mx-auto mb-16 max-w-2xl text-center text-lg text-gray-400">
          Everything you need to learn, organize, and secure your digital assets.
        </p>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-gray-800 bg-gray-900/50 p-8 transition hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20"
            >
              <div className="mb-6 text-5xl">{feature.icon}</div>

              <h3 className="mb-4 text-2xl font-semibold text-white">
                {feature.title}
              </h3>

              <p className="text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}