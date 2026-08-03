import Card from "@/components/ui/Card";
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
      icon: <FaLock className="text-5xl text-blue-500" />,
      title: "Secure Authentication",
      description:
        "Protect your account with secure authentication and account recovery options.",
    },
    {
      icon: <FaUserShield className="text-5xl text-blue-500" />,
      title: "Privacy Focused",
      description:
        "Designed with privacy in mind so you stay in control of your personal information.",
    },
    {
      icon: <FaBookOpen className="text-5xl text-blue-500" />,
      title: "Security Education",
      description:
        "Learn how to protect wallets, seed phrases, and digital assets through practical guidance.",
    },
    {
      icon: <FaWallet className="text-5xl text-blue-500" />,
      title: "Portfolio Organization",
      description:
        "Organize your digital assets with clear tools designed to simplify portfolio management.",
    },
  ];

  return (
    <section className="bg-[#05070D] py-28">
      <div className="mx-auto max-w-7xl px-8">

        <SectionTitle
          badge="SECURITY FIRST"
          title="Security is at the Core of ColdWallet"
          description="ColdWallet helps users build confidence through education, organization, and security-focused tools designed for responsible digital asset management."
        />

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {securityItems.map((item) => (
            <Card key={item.title}>
              <div className="mb-6">
                {item.icon}
              </div>

              <h3 className="mb-4 text-2xl font-bold text-white">
                {item.title}
              </h3>

              <p className="leading-7 text-gray-400">
                {item.description}
              </p>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
}