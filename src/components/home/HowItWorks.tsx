import Card from "@/components/ui/Card";
import SectionTitle from "@/components/ui/SectionTitle";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Create Your Account",
      description:
        "Create a secure ColdWallet account and personalize your experience.",
    },
    {
      number: "02",
      title: "Organize Your Portfolio",
      description:
        "Track your wallets, monitor your holdings, and stay informed with market insights.",
    },
    {
      number: "03",
      title: "Learn & Protect",
      description:
        "Build confidence through educational resources and security best practices.",
    },
  ];

  return (
    <section className="bg-black py-28">
      <div className="mx-auto max-w-7xl px-8">

        <SectionTitle
          badge="HOW IT WORKS"
          title="Three Simple Steps"
          description="Getting started with ColdWallet is simple. Create your account, organize your assets, and continue learning with our educational platform."
        />

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <Card key={step.number} className="text-center">

              <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold text-white">
                {step.number}
              </div>

              <h3 className="mb-4 text-2xl font-bold text-white">
                {step.title}
              </h3>

              <p className="leading-7 text-gray-400">
                {step.description}
              </p>

            </Card>
          ))}
        </div>

      </div>
    </section>
  );
}