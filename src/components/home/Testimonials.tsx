import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Michael R.",
    title: "Long-Term Crypto Investor",
    review:
      "ColdWallet provides a clean interface that makes it easy to track my portfolio and stay informed without feeling overwhelmed.",
  },
  {
    name: "Sarah T.",
    title: "Blockchain Enthusiast",
    review:
      "The educational content and security guidance gave me the confidence to manage my digital assets more effectively.",
  },
  {
    name: "David L.",
    title: "Portfolio Manager",
    review:
      "Having market insights and portfolio tools together in one place makes ColdWallet a valuable daily resource.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-[#0B0F19] py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">
          <h2 className="text-4xl font-bold text-white">
            Trusted by Crypto Enthusiasts
          </h2>

          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Whether you're just starting your crypto journey or managing an
            established portfolio, ColdWallet is built to support every step.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className="rounded-2xl border border-gray-800 bg-[#111827] p-8 transition hover:border-cyan-500"
            >
              <div className="mb-5 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <p className="leading-8 text-gray-300">
                "{item.review}"
              </p>

              <div className="mt-8">
                <h3 className="font-semibold text-white">
                  {item.name}
                </h3>

                <p className="text-sm text-cyan-400">
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}