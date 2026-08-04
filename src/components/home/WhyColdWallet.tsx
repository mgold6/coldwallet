import { Card, CardContent } from "@/components/ui/card";
import SectionTitle from "@/components/ui/SectionTitle";
import {
  FaShieldAlt,
  FaChartPie,
  FaGraduationCap,
  FaBalanceScale,
} from "react-icons/fa";

export default function WhyColdWallet() {
  const features = [
    {
      icon: <FaShieldAlt className="text-5xl text-blue-500" />,
      title: "Enterprise Security",
      description:
        "Learn best practices for protecting your cryptocurrency and digital assets with security-first guidance.",
    },
    {
      icon: <FaChartPie className="text-5xl text-blue-500" />,
      title: "Portfolio Organization",
      description:
        "Keep your wallets, assets, and investments organized with an intuitive platform.",
    },
    {
      icon: <FaGraduationCap className="text-5xl text-blue-500" />,
      title: "Learning Center",
      description:
        "Master blockchain technology, cold wallets, private keys, and crypto security through guided learning.",
    },
    {
      icon: <FaBalanceScale className="text-5xl text-blue-500" />,
      title: "Compliance Resources",
      description:
        "Access educational resources and compliance information to stay informed as regulations evolve.",
    },
  ];

  return (
    <section className="bg-[#05070D] py-28">
      <div className="mx-auto max-w-7xl px-8">

        <SectionTitle
          badge="WHY COLDWALLET"
          title="Built Around Security & Education"
          description="ColdWallet combines education, organization, and security tools into one modern platform designed to help users confidently manage their digital assets."
        />

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title}>
              <div className="mb-6">
                {feature.icon}
              </div>

              <h3 className="mb-4 text-2xl font-bold text-white">
                {feature.title}
              </h3>

              <p className="leading-7 text-gray-400">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
}