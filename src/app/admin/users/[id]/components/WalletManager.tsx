"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


type Wallet = {
  id: string;
  address: string;
  balance: number | string;
  status: string;

  currency: {
    code: string;
    name: string;
  };

  network?: {
    name: string;
  } | null;

  key?: {
    id: string;
  } | null;
};



type Currency = {
  id: string;
  code: string;
  name: string;

  networks: {
    id: string;
    name: string;
  }[];
};



type Props = {
  userId: string;
  portfolioId: string;
};



export default function WalletManager({
  userId,
  portfolioId,
}: Props) {


  const [mode, setMode] =
    useState<"generate" | "import">("generate");


  const [wallets, setWallets] =
    useState<Wallet[]>([]);


  const [currencies, setCurrencies] =
    useState<Currency[]>([]);


  const [currencyId, setCurrencyId] =
    useState("");


  const [networkId, setNetworkId] =
    useState("");


  const [walletAddress, setWalletAddress] =
    useState("");


  const [walletLabel, setWalletLabel] =
    useState("");


  const [assigning, setAssigning] =
    useState(false);



  async function loadWallets() {

    try {

      const response =
        await fetch(
          `/api/admin/users/${userId}/portfolios/${portfolioId}/wallets`
        );


      const json =
        await response.json();


      if (json.success) {

        setWallets(
          json.wallets ?? []
        );

      }


    } catch(error) {

      console.error(error);

      toast.error(
        "Unable to load wallets."
      );

    }

  }



  async function loadCurrencies() {

    try {

      const response =
        await fetch(
          `/api/admin/wallets/assignment-data?userId=${userId}`
        );


      const json =
        await response.json();


      if (json.success) {

        setCurrencies(
          json.currencies ?? []
        );

      }


    } catch(error) {

      console.error(error);

      toast.error(
        "Unable to load currencies."
      );

    }

  }



  useEffect(() => {

    loadWallets();

    loadCurrencies();

  }, [portfolioId, userId]);



  const selectedCurrency =
    currencies.find(
      (currency) =>
        currency.id === currencyId
    );
      async function assignWallet() {

    if (!currencyId) {

      toast.error(
        "Select currency."
      );

      return;

    }


    if (mode === "import" && !walletAddress.trim()) {

      toast.error(
        "Enter wallet address."
      );

      return;

    }



    setAssigning(true);



    try {


      const body =
        mode === "generate"
          ? {

              mode: "generate",

              currencyId,

              networkId:
                networkId || undefined,

            }
          : {

              mode: "import",

              currencyId,

              networkId:
                networkId || undefined,

              address:
                walletAddress.trim(),

              label:
                walletLabel.trim() || undefined,

            };





      const response =
        await fetch(
          `/api/admin/users/${userId}/portfolios/${portfolioId}/wallets`,
          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json",

            },

            body:
              JSON.stringify(body),

          }
        );




      const json =
        await response.json();





      if (!json.success) {

        toast.error(
          json.message ??
          "Wallet assignment failed."
        );

        return;

      }




      toast.success(
        mode === "import"
          ? "Wallet imported successfully."
          : "Wallet generated successfully."
      );



      setCurrencyId("");

      setNetworkId("");

      setWalletAddress("");

      setWalletLabel("");



      await loadWallets();



    } catch(error) {


      console.error(error);


      toast.error(
        "Wallet assignment failed."
      );


    } finally {


      setAssigning(false);


    }

  }





  async function deleteWallet(
    walletId: string
  ) {


    const confirmed =
      window.confirm(
        "Delete this wallet?"
      );



    if (!confirmed) {

      return;

    }




    try {


      const response =
        await fetch(
          `/api/admin/users/${userId}/portfolios/${portfolioId}/wallets`,
          {

            method: "DELETE",

            headers: {

              "Content-Type":
                "application/json",

            },

            body:

              JSON.stringify({

                walletId,

              }),

          }
        );




      const json =
        await response.json();




      if (json.success) {


        toast.success(
          "Wallet deleted."
        );


        await loadWallets();


      }



    } catch(error) {


      console.error(error);


      toast.error(
        "Delete failed."
      );


    }

  }





  return (

    <div className="space-y-6">


      <div className="rounded-lg border border-slate-800 bg-slate-950 p-5">


        <h3 className="mb-4 text-lg font-semibold text-white">

          Assign Wallet

        </h3>



        <div className="mb-5 flex gap-3">


          <Button

            variant={
              mode === "generate"
                ? "default"
                : "outline"
            }

            onClick={() =>
              setMode("generate")
            }

          >

            Generate New Wallet

          </Button>




          <Button

            variant={
              mode === "import"
                ? "default"
                : "outline"
            }

            onClick={() =>
              setMode("import")
            }

          >

            Import Existing Address

          </Button>


        </div>





        <div className="grid gap-4 md:grid-cols-3">


          <Select
  value={currencyId || undefined}
  onValueChange={(value) => {
    if (typeof value !== "string") return;

    setCurrencyId(value);
    setNetworkId("");
  }}
>

            <SelectTrigger className="bg-slate-900 text-white">

              <SelectValue placeholder="Currency" />

            </SelectTrigger>


            <SelectContent>


              {currencies.map((currency) => (

                <SelectItem

                  key={currency.id}

                  value={currency.id}

                >

                  {currency.code}

                </SelectItem>


              ))}


            </SelectContent>


          </Select>





          <Select
  value={networkId || undefined}
  onValueChange={(value) => {
    if (typeof value !== "string") return;

    setNetworkId(value);
  }}
>

            <SelectTrigger className="bg-slate-900 text-white">

              <SelectValue placeholder="Network" />

            </SelectTrigger>


            <SelectContent>


              {selectedCurrency?.networks.map(
                (network) => (

                  <SelectItem

                    key={network.id}

                    value={network.id}

                  >

                    {network.name}

                  </SelectItem>

                )
              )}


            </SelectContent>


          </Select>
                  </div>



        {mode === "import" && (

          <div className="mt-4 grid gap-4 md:grid-cols-2">


            <Input

              value={walletAddress}

              onChange={(event) =>
                setWalletAddress(
                  event.target.value
                )
              }

              placeholder="Wallet address"

              className="
                bg-slate-900
                border-slate-700
                text-white
              "

            />



            <Input

              value={walletLabel}

              onChange={(event) =>
                setWalletLabel(
                  event.target.value
                )
              }

              placeholder="Wallet label (optional)"

              className="
                bg-slate-900
                border-slate-700
                text-white
              "

            />


          </div>

        )}






        <Button

          className="mt-5"

          onClick={assignWallet}

          disabled={assigning}

        >

          {assigning

            ? "Assigning..."

            : mode === "import"

            ? "Import Wallet"

            : "Generate Wallet"

          }


        </Button>


      </div>








      <div className="rounded-lg border border-slate-800 bg-slate-950 p-5">


        <h3 className="mb-4 text-lg font-semibold text-white">

          Wallets

        </h3>





        {wallets.length === 0 && (

          <p className="text-slate-400">

            No wallets assigned.

          </p>

        )}






        <div className="space-y-3">


          {wallets.map((wallet) => (


            <div

              key={wallet.id}

              className="
                flex
                items-center
                justify-between
                rounded-lg
                border
                border-slate-800
                p-4
              "

            >


              <div>


                <p className="font-semibold text-white">

                  {wallet.currency.code}

                </p>




                <p className="text-sm text-slate-400">

                  {wallet.network?.name ?? "-"}

                </p>




                <p className="font-mono text-xs text-slate-500">

                  {wallet.address.slice(0, 18)}...

                </p>



              </div>





              <Button

                variant="destructive"

                onClick={() =>
                  deleteWallet(wallet.id)
                }

              >

                Delete

              </Button>



            </div>


          ))}



        </div>


      </div>


    </div>

  );

}