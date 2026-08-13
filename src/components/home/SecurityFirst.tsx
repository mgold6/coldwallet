import { Card, CardContent } from "@/components/ui/card";
import SectionTitle from "@/components/ui/SectionTitle";
import {
  FaLock,
  FaUserShield,
  FaBookOpen,
  FaWallet,
} from "react-icons/fa";

export default function SecurityFirst() {
  const securityItems = [
    {
      icon: <FaLock />,
      title: "Secure Authentication",
      description:
        "Protect your account with secure authentication and account recovery options.",
    },
    {
      icon: <FaUserShield />,
      title: "Privacy Focused",
      description:
        "Designed with privacy in mind so you stay in control of your personal information.",
    },
    {
      icon: <FaBookOpen />,
      title: "Security Education",
      description:
        "Learn how to protect wallets, seed phrases, and digital assets through practical guidance.",
    },
    {
      icon: <FaWallet />,
      title: "Portfolio Organization",
      description:
        "Organize your digital assets with clear tools designed to simplify portfolio management.",
    },
  ];

  return (
    <section className="bg-[#050816] py-16 sm:py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        <SectionTitle
          badge="SECURITY FIRST"
          title="Security is at the Core of ColdWallet"
          description="ColdWallet helps users build confidence through education, organization, and security-focused tools designed for responsible digital asset management."
        />

        <div className="mt-12 grid gap-5 sm:mt-16 sm:gap-8 md:grid-cols-2 xl:mt-20 xl:grid-cols-4">

          {securityItems.map((item) => (
            <Card
              key={item.title}
              className="
                group
                border
                border-white/10
                bg-[#111827]/70
                backdrop-blur-xl
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-blue-500/40
                hover:shadow-[0_0_40px_rgba(37,99,235,.18)]
              "
            >
              <CardContent className="p-5 sm:p-6 lg:p-8">

                <div
                  className="
                    mb-6
                    flex
                    h-14
                    w-14
                    sm:mb-8
                    sm:h-16
                    sm:w-16
                    items-center
                    justify-center
                    rounded-2xl
                    bg-blue-600/10
                    text-3xl
                    text-blue-500
                    transition
                    group-hover:scale-110
                  "
                >
                  {item.icon}
                </div>

                <h3 className="mb-3 text-xl font-semibold text-white sm:mb-4 sm:text-2xl">
                  {item.title}
                </h3>

                <p className="text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
                  {item.description}
                </p>

              </CardContent>
            </Card>
          ))}

        </div>

      </div>
    </section>
  );
}