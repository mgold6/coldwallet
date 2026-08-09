import {
  Wallet,
  BarChart3,
  History,
  ShieldCheck,
} from "lucide-react";

import SectionTitle from "@/components/ui/SectionTitle";
import { Card } from "@/components/ui/card";

export default function AssetControlSection() {
  const features = [
    {
      icon: Wallet,
      title: "Wallet Management",
      description:
        "Organize multiple digital wallets and keep your assets structured in one secure location.",
    },
    {
      icon: BarChart3,
      title: "Portfolio Tracking",
      description:
        "Monitor your cryptocurrency holdings with clear portfolio insights and performance tracking.",
    },
    {
      icon: History,
      title: "Transaction History",
      description:
        "Review wallet activity and maintain a complete record of your digital asset movements.",
    },
    {
      icon: ShieldCheck,
      title: "Security Monitoring",
      description:
        "Strengthen your protection with security tools designed around responsible asset management.",
    },
  ];

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">

        <SectionTitle
          badge="ASSET MANAGEMENT"
          title="Everything You Need to Control Your Digital Assets"
          description="ColdWallet helps you organize wallets, monitor portfolios, and understand your digital assets through a secure and intuitive platform."
        />

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <Card
                key={feature.title}
                className="
                  border-white/10
                  bg-[#111827]
                  p-8
                  transition
                  hover:-translate-y-2
                  hover:border-blue-500/40
                "
              >

                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10">
                  <Icon className="h-7 w-7 text-blue-400" />
                </div>

                <h3 className="mb-4 text-xl font-bold text-white">
                  {feature.title}
                </h3>

                <p className="leading-7 text-slate-400">
                  {feature.description}
                </p>

              </Card>
            );
          })}

        </div>

      </div>
    </section>
  );
}