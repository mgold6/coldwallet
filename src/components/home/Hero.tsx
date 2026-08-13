import Link from "next/link";
import { FaBitcoin, FaEthereum } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">

      {/* Background Glow */}

      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10 blur-3xl" />


      {/* Decorative Grid */}

      <div className="absolute inset-0 opacity-10">

        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

      </div>



      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:gap-12 sm:px-6 lg:grid-cols-2 lg:px-8">


        {/* LEFT */}

        <div>


          <span className="inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-sm font-semibold uppercase tracking-wider text-blue-400">

            Secure • Learn • Organize

          </span>



          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-7xl">

            Protect Your

            <span className="block text-blue-500">
              Digital Assets
            </span>

          </h1>



          <p className="mt-6 max-w-xl text-base leading-7 text-gray-400 sm:text-lg sm:leading-8">

            ColdWallet helps individuals organize cryptocurrency portfolios,
            learn blockchain technology, and build stronger security habits
            through education and practical digital asset tools.

          </p>



          <div className="mt-10 flex flex-col gap-4 sm:flex-row">


            <Link href="/register">

              <Button>
                Get Started
              </Button>

            </Link>



            <Link href="/about">

              <Button variant="secondary">
                Learn More
              </Button>

            </Link>


          </div>




          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-6 sm:mt-12 sm:gap-10">


            <div>

              <h3 className="text-3xl font-bold text-white">
                10K+
              </h3>

              <p className="text-gray-500">
                Future Users
              </p>

            </div>



            <div>

              <h3 className="text-3xl font-bold text-white">
                100+
              </h3>

              <p className="text-gray-500">
                Learning Articles
              </p>

            </div>



            <div>

              <h3 className="text-3xl font-bold text-white">
                24/7
              </h3>

              <p className="text-gray-500">
                Security Resources
              </p>

            </div>


          </div>


        </div>





        {/* RIGHT */}

        <div className="relative flex justify-center">


          <div className="relative w-full max-w-md rounded-3xl border border-blue-500/20 bg-[#10141F] p-5 shadow-2xl shadow-blue-500/20 sm:p-8">


            <div className="mb-6 flex items-center justify-between gap-4 sm:mb-8">


              <div>

                <p className="text-gray-400">
                  Portfolio Preview
                </p>


                <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                  ColdWallet
                </h2>

              </div>



              <div className="shrink-0 rounded-full bg-blue-600 p-3 sm:p-4">

                <FaBitcoin className="text-2xl text-white sm:text-3xl" />

              </div>


            </div>




            <div className="rounded-2xl bg-black/40 p-4 sm:p-6">


             <p className="text-sm text-gray-500">
  Portfolio Tracking
</p>

<h3 className="mt-2 break-words text-3xl font-bold text-white sm:text-4xl">
  Organize Your Assets
</h3>

<p className="mt-3 text-sm text-blue-400">
  Clear portfolio insights
</p>


            </div>




            <div className="mt-4 grid gap-3 sm:mt-5 sm:gap-4">


              <div className="rounded-2xl bg-black/40 p-4 sm:p-5">

                <p className="text-sm text-gray-500">
                  Security Status
                </p>


                <h3 className="mt-2 text-xl font-bold text-green-400">
                  Protected
                </h3>

              </div>




              <div className="rounded-2xl bg-black/40 p-5">

                <p className="text-sm text-gray-500">
                  Portfolio Organization
                </p>


                <h3 className="mt-2 text-xl font-bold text-white">
                  Optimized
                </h3>

              </div>




              <div className="rounded-2xl bg-black/40 p-5">

                <p className="text-sm text-gray-500">
                  Learning Progress
                </p>


                <h3 className="mt-2 text-xl font-bold text-white">
                  Beginner → Advanced
                </h3>

              </div>


            </div>




            <div className="absolute -right-2 -top-2 rounded-full bg-blue-600 p-3 shadow-lg shadow-blue-500/40 sm:-right-5 sm:-top-5 sm:p-4">

              <FaEthereum className="text-4xl text-white" />

            </div>


          </div>


        </div>


      </div>


    </section>
  );
}