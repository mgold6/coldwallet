"use client";

import { useRouter } from "next/navigation";


type Portfolio = {
  id: string;
  name: string;
  isDefault: boolean;
};


export default function PortfolioSelector({
  portfolios,
  selectedId,
}: {
  portfolios: Portfolio[];
  selectedId: string;
}) {


  const router = useRouter();



  async function selectPortfolio(
    portfolioId: string
  ) {


    await fetch(
      "/api/portfolio/select",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          portfolioId,
        }),

      }
    );


    router.refresh();

  }



  return (

    <div
      className="
      grid
      grid-cols-1
      gap-6
      md:grid-cols-3
      "
    >

      {
        portfolios.map(
          (portfolio) => (

            <button

              key={portfolio.id}

              onClick={() =>
                selectPortfolio(
                  portfolio.id
                )
              }

              className={`
                rounded-2xl
                border
                p-6
                text-left
                transition

                ${
                  selectedId === portfolio.id

                  ?

                  "border-cyan-400 bg-slate-800"

                  :

                  "border-slate-800 bg-slate-900 hover:bg-slate-800"

                }
              `}

            >


              <h3
                className="
                text-lg
                font-semibold
                text-white
                "
              >
                {portfolio.name}
              </h3>



              {
                portfolio.isDefault && (

                  <p
                    className="
                    mt-2
                    text-sm
                    text-cyan-400
                    "
                  >
                    Default Portfolio
                  </p>

                )
              }



              {
                selectedId === portfolio.id && (

                  <p
                    className="
                    mt-2
                    text-sm
                    text-green-400
                    "
                  >
                    Selected
                  </p>

                )
              }


            </button>

          )
        )
      }


    </div>

  );

}