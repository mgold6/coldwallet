import Link from "next/link";


const stocks = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: "$0.00",
    change: "0.00%",
  },
  {
    symbol: "MSFT",
    name: "Microsoft",
    price: "$0.00",
    change: "0.00%",
  },
  {
    symbol: "NVDA",
    name: "NVIDIA",
    price: "$0.00",
    change: "0.00%",
  },
  {
    symbol: "TSLA",
    name: "Tesla",
    price: "$0.00",
    change: "0.00%",
  },
];


export default function StocksPage() {

  return (

    <div className="space-y-8">


      <section>

        <h1 className="text-3xl font-bold text-white">
          Stocks
        </h1>


        <p className="mt-2 text-slate-400">
          Track traditional markets alongside your digital assets.
        </p>


      </section>





      <section
        className="
          rounded-3xl
          border
          border-slate-800
          bg-slate-900
          p-6
        "
      >

        <div className="space-y-4">


          {stocks.map((stock) => (

            <Link

              key={stock.symbol}

              href="#"

              className="
                flex
                items-center
                justify-between
                rounded-2xl
                bg-slate-950
                p-5
                transition
                hover:bg-slate-800
              "

            >

              <div>

                <h2 className="font-bold text-white">
                  {stock.name}
                </h2>


                <p className="text-sm text-slate-400">
                  {stock.symbol}
                </p>

              </div>





              <div className="text-right">

                <p className="font-bold text-white">
                  {stock.price}
                </p>


                <p className="text-sm text-green-400">
                  {stock.change}
                </p>

              </div>


            </Link>

          ))}


        </div>


      </section>


    </div>

  );

}