import {
  ShieldCheck,
  Lock,
  BookOpen,
  Globe,
} from "lucide-react";

export default function TrustBanner() {
  const items = [
    {
      icon: ShieldCheck,
      title: "Secure Protection",
      text: "Security-focused tools designed to help protect your digital assets.",
    },
    {
      icon: Lock,
      title: "Privacy Focused",
      text: "Keep control of your account information with modern privacy practices.",
    },
    {
      icon: BookOpen,
      title: "Security Education",
      text: "Learn wallet safety, private keys, and responsible asset management.",
    },
    {
      icon: Globe,
      title: "Multi-Network Support",
      text: "Manage assets across major blockchain networks.",
    },
  ];

  return (
    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <div className="rounded-[32px] border border-white/10 bg-[#111827] p-10 shadow-xl">

          <div className="text-center">

            <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-sm font-semibold text-blue-400">
              TRUST & SECURITY
            </span>

            <h2 className="mt-8 text-5xl font-bold text-white">
              Built for Secure Digital Asset Management
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-400">
              ColdWallet combines organization, education, and
              security tools to help users confidently manage
              their digital assets.
            </p>

          </div>


          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            {items.map((item) => {

              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-black/20 p-6"
                >

                  <Icon className="h-8 w-8 text-blue-400" />

                  <h3 className="mt-5 text-xl font-bold text-white">
                    {item.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-400">
                    {item.text}
                  </p>

                </div>
              );

            })}

          </div>

        </div>

      </div>

    </section>
  );
}