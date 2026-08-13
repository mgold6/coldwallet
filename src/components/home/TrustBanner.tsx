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
    <section className="py-16 sm:py-20 lg:py-24">

      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        <div className="rounded-[28px] border border-white/10 bg-[#111827] p-5 shadow-xl sm:rounded-[32px] sm:p-8 lg:p-10">

          <div className="text-center">

            <span className="inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-xs font-semibold text-blue-400 sm:px-5 sm:text-sm">
              TRUST & SECURITY
            </span>

            <h2 className="mt-6 text-3xl font-bold leading-tight text-white sm:mt-8 sm:text-4xl lg:text-5xl">
              Built for Secure Digital Asset Management
            </h2>

            <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-400 sm:mt-6 sm:text-lg">
              ColdWallet combines organization, education, and
              security tools to help users confidently manage
              their digital assets.
            </p>

          </div>


          <div className="mt-10 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">

            {items.map((item) => {

              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-black/20 p-5 sm:p-6"
                >

                  <Icon className="h-8 w-8 text-blue-400" />

                  <h3 className="mt-4 text-lg font-bold text-white sm:mt-5 sm:text-xl">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base sm:leading-7">
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