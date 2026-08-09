import {
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="py-32">

      <div className="mx-auto max-w-7xl px-6">

        <div
          className="
            relative
            overflow-hidden
            rounded-[40px]
            border
            border-blue-500/30
            bg-gradient-to-br
            from-blue-600/20
            via-[#111827]
            to-purple-600/20
            p-12
            text-center
            shadow-2xl
            md:p-20
          "
        >

          <div className="absolute inset-0 bg-blue-500/5 blur-3xl" />


          <div className="relative">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10">

              <ShieldCheck className="h-8 w-8 text-blue-400" />

            </div>


            <h2 className="mt-8 text-5xl font-bold leading-tight text-white md:text-6xl">

              Secure Your
              <span className="block text-blue-400">
                Digital Future
              </span>

            </h2>


            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-400">

              Organize your wallets, track your portfolio,
              and build confidence with security-focused
              digital asset tools.

            </p>


            <div className="mt-10 flex flex-wrap justify-center gap-4">

              <button
                className="
                  flex
                  items-center
                  gap-2
                  rounded-full
                  bg-blue-600
                  px-8
                  py-4
                  font-semibold
                  text-white
                  transition
                  hover:bg-blue-500
                "
              >
                Create Free Account

                <ArrowRight className="h-5 w-5" />

              </button>


              <button
                className="
                  rounded-full
                  border
                  border-white/20
                  bg-white/5
                  px-8
                  py-4
                  font-semibold
                  text-white
                  backdrop-blur-xl
                  transition
                  hover:bg-white/10
                "
              >
                Explore Security

              </button>

            </div>


            <p className="mt-8 text-sm text-slate-500">

              Security education • Portfolio organization • Blockchain resources

            </p>

          </div>

        </div>

      </div>

    </section>
  );
}