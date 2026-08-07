"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import WalletManager from "./WalletManager";


type Portfolio = {
  id: string;
  name: string;
  wallets: {
    id: string;
    currency: {
      code: string;
    };
  }[];
};


type Props = {
  userId: string;
};



export default function PortfolioManager({
  userId,
}: Props) {


  const [portfolios, setPortfolios] =
    useState<Portfolio[]>([]);


  const [loading, setLoading] =
    useState(false);


  const [creating, setCreating] =
    useState(false);


  const [deleting, setDeleting] =
    useState(false);


  const [name, setName] =
    useState("");


  const [selectedPortfolio, setSelectedPortfolio] =
    useState<string | null>(null);





  async function loadPortfolios() {

    setLoading(true);


    try {

      const response =
        await fetch(
          `/api/admin/users/${userId}/portfolios`
        );


      const json =
        await response.json();


      if (!json.success) {

        toast.error(
          "Unable to load portfolios."
        );

        return;

      }


      setPortfolios(
        json.portfolios
      );


    } catch(error) {

      console.error(error);

      toast.error(
        "Failed loading portfolios."
      );


    } finally {

      setLoading(false);

    }

  }






  useEffect(() => {

    loadPortfolios();

  }, [userId]);







  async function createPortfolio() {


    if (!name.trim()) {

      toast.error(
        "Enter a portfolio name."
      );

      return;

    }



    setCreating(true);



    try {


      const response =
        await fetch(
          `/api/admin/users/${userId}/portfolios`,
          {

            method:"POST",

            headers:{
              "Content-Type":
                "application/json",
            },

            body:JSON.stringify({

              name,

            }),

          }
        );



      const json =
        await response.json();



      if (!json.success) {

        toast.error(
          json.message ??
          "Unable to create portfolio."
        );

        return;

      }



      toast.success(
        "Portfolio created successfully."
      );


      setName("");

      await loadPortfolios();



    } catch(error) {


      console.error(error);


      toast.error(
        "Failed creating portfolio."
      );


    } finally {

      setCreating(false);

    }


  }








  async function deletePortfolio(
    portfolioId:string,
    portfolioName:string
  ) {


    const confirmed =
      window.confirm(
        `Delete ${portfolioName}? This will remove the portfolio and all wallets inside it.`
      );



    if (!confirmed) {

      return;

    }



    setDeleting(true);



    try {


      const response =
        await fetch(
          `/api/admin/users/${userId}/portfolios`,
          {

            method:"DELETE",

            headers:{
              "Content-Type":
                "application/json",
            },

            body:JSON.stringify({

              portfolioId,

            }),

          }
        );



      const json =
        await response.json();



      if (!json.success) {

        toast.error(
          json.message ??
          "Unable to delete portfolio."
        );

        return;

      }



      toast.success(
        "Portfolio deleted."
      );


      setSelectedPortfolio(null);

      await loadPortfolios();



    } catch(error) {


      console.error(error);


      toast.error(
        "Failed deleting portfolio."
      );


    } finally {

      setDeleting(false);

    }


  }







  return (

    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">


      <div className="mb-6">

        <h2 className="text-xl font-semibold text-white">
          Portfolios
        </h2>


        <p className="mt-1 text-sm text-slate-400">
          Create and manage asset portfolios for this user.
        </p>

      </div>





      <div className="mb-6 flex gap-3">


        <Input

          value={name}

          onChange={(event)=>
            setName(event.target.value)
          }

          placeholder="Example: Business Assets"

          className="bg-slate-950 border-slate-700 text-white"

        />



        <Button
          onClick={createPortfolio}
          disabled={creating}
        >

          {creating
            ? "Creating..."
            : "Create Portfolio"
          }

        </Button>


      </div>






      <div className="space-y-4">


        {loading && (

          <p className="text-slate-400">
            Loading portfolios...
          </p>

        )}




        {portfolios.map((portfolio)=>(


          <div
            key={portfolio.id}
            className="rounded-lg border border-slate-800 bg-slate-950 p-5"
          >


            <div className="flex items-center justify-between gap-4">


              <div>

                <h3 className="text-lg font-semibold text-white">
                  {portfolio.name}
                </h3>


                <p className="text-sm text-slate-400">
                  {portfolio.wallets.length} wallet(s)
                </p>

              </div>





              <div className="flex gap-2">


                <Button

                  variant="outline"

                  className="border-slate-700 bg-slate-900 text-white"

                  onClick={()=>
                    setSelectedPortfolio(
                      selectedPortfolio === portfolio.id
                      ? null
                      : portfolio.id
                    )
                  }

                >

                  {selectedPortfolio === portfolio.id
                    ? "Hide Wallets"
                    : "Manage Wallets"
                  }

                </Button>





                <Button

                  variant="destructive"

                  disabled={deleting}

                  onClick={()=>
                    deletePortfolio(
                      portfolio.id,
                      portfolio.name
                    )
                  }

                >

                  {deleting
                    ? "Deleting..."
                    : "Delete"
                  }

                </Button>


              </div>


            </div>







            {portfolio.wallets.length > 0 && (

              <div className="mt-4 flex flex-wrap gap-2">


                {portfolio.wallets.map((wallet)=>(

                  <span

                    key={wallet.id}

                    className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-300"

                  >

                    {wallet.currency.code}

                  </span>


                ))}


              </div>

            )}







            {selectedPortfolio === portfolio.id && (

              <div className="mt-6 border-t border-slate-800 pt-6">


                <WalletManager

                  userId={userId}

                  portfolioId={portfolio.id}

                />


              </div>

            )}



          </div>


        ))}


      </div>


    </div>

  );

}