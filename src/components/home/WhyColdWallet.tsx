import {
  FaShieldAlt,
  FaChartPie,
  FaGraduationCap,
  FaBalanceScale,
} from "react-icons/fa";
import { Card } from "@/components/ui/card";
import SectionTitle from "@/components/ui/SectionTitle";

export default function WhyColdWallet() {
  const features = [
    {
      icon: <FaShieldAlt className="h-10 w-10 text-blue-400" />,
      title: "Enterprise Security",
      description:
        "Learn best practices for protecting your cryptocurrency and digital assets with security-first guidance.",
    },
    {
      icon: <FaChartPie className="h-10 w-10 text-blue-400" />,
      title: "Portfolio Organization",
      description:
        "Keep your wallets, assets, and investments organized with an intuitive platform.",
    },
    {
      icon: <FaGraduationCap className="h-10 w-10 text-blue-400" />,
      title: "Learning Center",
      description:
        "Master blockchain technology, cold wallets, private keys, and crypto security through guided learning.",
    },
    {
      icon: <FaBalanceScale className="h-10 w-10 text-blue-400" />,
      title: "Compliance Resources",
      description:
        "Access educational resources and compliance information to stay informed as regulations evolve.",
    },
  ];

  return (
    <section className="relative py-24" id="security">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle
          badge="WHY COLDWALLET"
          title="Built Around Security & Education"
          description="ColdWallet combines education, organization, and security tools into one modern platform designed to help users confidently manage their digital assets."
        />

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="border border-white/10 bg-[#111827] p-8 shadow-xl transition duration-300 hover:-translate-y-2 hover:border-blue-500/40"
            >
              <div className="mb-8">{feature.icon}</div>

              <h3 className="mb-4 text-2xl font-bold text-white">
                {feature.title}
              </h3>

              <p className="leading-7 text-slate-400">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}