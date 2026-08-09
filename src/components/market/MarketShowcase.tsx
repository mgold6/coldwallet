import { TrendingUp } from "lucide-react";

const stocks = [
  {
    symbol: "GOOG",
    price: "$234.67",
    volume: "$2.9B vol",
    change: "+11.26%",
  },
  {
    symbol: "NFLX",
    price: "$79.80",
    volume: "$3.5B vol",
    change: "+5.21%",
  },
  {
    symbol: "PLTR",
    price: "$187.20",
    volume: "$8.6B vol",
    change: "+3.08%",
  },
  {
    symbol: "COIN",
    price: "$274.20",
    volume: "$1.8B vol",
    change: "+2.44%",
  },
];

export default function MarketShowcase() {
  return (
    <section className="relative py-24">

      <div className="mx-auto max-w-7xl px-6">

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#111827] shadow-2xl">

          <div className="grid lg:grid-cols-2">


            {/* STOCK MARKET CARD */}

            <div className="p-8 lg:p-12">

              <div className="mb-8 flex items-center justify-between">

                <h2 className="text-3xl font-bold text-white">
                  STOCKS
                </h2>

                <TrendingUp className="text-green-400" />

              </div>


              <div className="space-y-4">

                {stocks.map((stock) => (

                  <div
                    key={stock.symbol}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 p-5"
                  >

                    <div>

                      <h3 className="text-xl font-bold text-white">
                        {stock.symbol}
                      </h3>

                      <p className="text-sm text-slate-400">
                        {stock.volume}
                      </p>

                    </div>


                    <div className="text-right">

                      <p className="font-semibold text-white">
                        {stock.price}
                      </p>

                      <p className="text-sm text-green-400">
                        ↗ {stock.change}
                      </p>

                    </div>


                  </div>

                ))}

              </div>

            </div>



            {/* TEXT */}

            <div className="flex flex-col justify-center bg-[#151a33] p-8 lg:p-16">

              <h2 className="text-5xl font-bold leading-tight text-white">

                Trade stocks
                <span className="block">
                  around the clock
                </span>

              </h2>


              <p className="mt-6 text-lg leading-8 text-slate-300">

                Get 24/7 access to thousands of stocks and pay zero
                commission. Now available to all U.S. traders.

              </p>


              <button className="mt-8 w-fit rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white hover:bg-blue-500">

                Start Trading

              </button>


            </div>


          </div>

        </div>

      </div>

    </section>
  );
}