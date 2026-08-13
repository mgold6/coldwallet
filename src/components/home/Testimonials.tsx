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
    <section className="bg-[#0B0F19] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
            Trusted by Crypto Enthusiasts
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
            Whether you&apos;re just starting your crypto journey or managing
            an established portfolio, ColdWallet is built to support every step.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:mt-12 sm:gap-8 md:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className="rounded-2xl border border-gray-800 bg-[#111827] p-5 transition hover:border-cyan-500 sm:p-8"
            >
              <div className="mb-4 flex sm:mb-5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <p className="text-sm leading-7 text-gray-300 sm:text-base sm:leading-8">
                &quot;{item.review}&quot;
              </p>

              <div className="mt-6 sm:mt-8">
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