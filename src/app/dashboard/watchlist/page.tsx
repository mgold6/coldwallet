const watchlist = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    type: "Crypto",
    price: "$0.00",
    change: "0.00%",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    type: "Crypto",
    price: "$0.00",
    change: "0.00%",
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    type: "Stock",
    price: "$0.00",
    change: "0.00%",
  },
  {
    symbol: "NVDA",
    name: "NVIDIA",
    type: "Stock",
    price: "$0.00",
    change: "0.00%",
  },
];


export default function WatchlistPage() {

  return (

    <div className="space-y-8">


      <section>

        <h1 className="text-3xl font-bold text-white">
          Watchlist
        </h1>


        <p className="mt-2 text-slate-400">
          Track your favorite digital assets and markets.
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


          {watchlist.map((asset)=>(

            <div

              key={asset.symbol}

              className="
                flex
                items-center
                justify-between
                rounded-2xl
                bg-slate-950
                p-5
              "

            >

              <div>

                <h2 className="font-bold text-white">
                  {asset.name}
                </h2>


                <p className="text-sm text-slate-400">
                  {asset.symbol} · {asset.type}
                </p>

              </div>



              <div className="text-right">

                <p className="font-bold text-white">
                  {asset.price}
                </p>


                <p className="text-sm text-green-400">
                  {asset.change}
                </p>

              </div>


            </div>

          ))}


        </div>


      </section>


    </div>

  );

}