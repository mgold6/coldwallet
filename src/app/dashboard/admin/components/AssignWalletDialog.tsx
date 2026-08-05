"use client";



import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";



import {

  Dialog,

  DialogContent,

  DialogDescription,

  DialogHeader,

  DialogTitle,

  DialogTrigger,

} from "@/components/ui/dialog";



import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";



import {

  Select,

  SelectContent,

  SelectItem,

  SelectTrigger,

  SelectValue,

} from "@/components/ui/select";



type Portfolio = {

  id: string;

  name: string;

};



type Network = {

  id: string;

  name: string;

};



type Currency = {

  id: string;

  name: string;

  networks: Network[];

};



type AssignWalletDialogProps = {

  userId: string;

  userName: string;

};



export default function AssignWalletDialog({

  userId,

  userName,

}: AssignWalletDialogProps) {
    const router = useRouter();

  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);
const [submitting, setSubmitting] = useState(false);


  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);

  const [currencies, setCurrencies] = useState<Currency[]>([]);



  const [portfolioId, setPortfolioId] = useState("");

  const [currencyId, setCurrencyId] = useState("");

  const [networkId, setNetworkId] = useState("");



  const [address, setAddress] = useState("");

  const [label, setLabel] = useState("");



  const selectedCurrency = useMemo(

    () => currencies.find((c) => c.id === currencyId),

    [currencies, currencyId]

  );



  const networks = selectedCurrency?.networks ?? [];



 useEffect(() => {
  if (!open) return;

  async function loadData() {
    setLoading(true);

    try {
      const response = await fetch(
        `/api/admin/wallets/assignment-data?userId=${userId}`
      );

      const json = await response.json();

      if (!json.success) {
        toast.error("Unable to load wallet assignment data.");
        return;
      }

      setPortfolios(json.data.portfolios);
      setCurrencies(json.data.currencies);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load assignment data.");
    } finally {
      setLoading(false);
    }
  }

  loadData();
}, [open, userId]);

async function handleSubmit() {
  if (!portfolioId) {
    toast.error("Please select a portfolio.");
    return;
  }

  if (!currencyId) {
    toast.error("Please select a currency.");
    return;
  }

  if (!address.trim()) {
    toast.error("Please enter a wallet address.");
    return;
  }

  setSubmitting(true);

  try {
    const response = await fetch("/api/admin/wallets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        portfolioId,
        currencyId,
        networkId: networkId || undefined,
        address: address.trim(),
        label: label.trim() || undefined,
      }),
    });

    const json = await response.json();

    if (!response.ok || !json.success) {
      toast.error(json.message ?? "Unable to assign wallet.");
      return;
    }

    toast.success("Wallet assigned successfully.");

    setPortfolioId("");
    setCurrencyId("");
    setNetworkId("");
    setAddress("");
    setLabel("");

    setOpen(false);

    router.refresh();
  } catch (error) {
    console.error(error);
    toast.error("An unexpected error occurred.");
  } finally {
    setSubmitting(false);
  }
}

  return (

    <Dialog open={open} onOpenChange={setOpen}>

      <DialogTrigger

        render={<Button size="sm">Assign Wallet</Button>}

      />



      <DialogContent className="sm:max-w-xl">

        <DialogHeader>

          <DialogTitle>Assign Wallet</DialogTitle>



          <DialogDescription>

            Assign a cryptocurrency wallet to{" "}

            <strong>{userName}</strong>.

          </DialogDescription>

        </DialogHeader>



        <div className="space-y-6">

          <div className="space-y-2">

            <Label>Portfolio</Label>



            <Select

              value={portfolioId}

              onValueChange={(value) => setPortfolioId(value ?? "")}

            >

              <SelectTrigger>

                <SelectValue placeholder="Select portfolio" />

              </SelectTrigger>



              <SelectContent>

                {portfolios.map((portfolio) => (

                  <SelectItem

                    key={portfolio.id}

                    value={portfolio.id}

                  >

                    {portfolio.name}

                  </SelectItem>

                ))}

              </SelectContent>

            </Select>

          </div>



          <div className="space-y-2">

            <Label>Currency</Label>



            <Select

              value={currencyId}

              onValueChange={(value) => {

                setCurrencyId(value ?? "");

                setNetworkId("");

              }}

            >

              <SelectTrigger>

                <SelectValue placeholder="Select currency" />

              </SelectTrigger>



              <SelectContent>

                {currencies.map((currency) => (

                  <SelectItem

                    key={currency.id}

                    value={currency.id}

                  >

                    {currency.name}

                  </SelectItem>

                ))}

              </SelectContent>

            </Select>

          </div>



          <div className="space-y-2">

            <Label>Network</Label>



            <Select

              value={networkId}

              onValueChange={(value) => setNetworkId(value ?? "")}

            >

              <SelectTrigger>

                <SelectValue placeholder="Select network" />

              </SelectTrigger>



              <SelectContent>

                {networks.map((network) => (

                  <SelectItem

                    key={network.id}

                    value={network.id}

                  >

                    {network.name}

                  </SelectItem>

                ))}

              </SelectContent>

            </Select>

          </div>



          <div className="space-y-2">

            <Label>Wallet Address</Label>



            <Input

              value={address}

              onChange={(e) => setAddress(e.target.value)}

              placeholder="Enter wallet address"

            />

          </div>



          <div className="space-y-2">

            <Label>Wallet Label</Label>



            <Input

              value={label}

              onChange={(e) => setLabel(e.target.value)}

              placeholder="Primary BTC Wallet"

            />

          </div>



          <div className="flex justify-end">

           <Button
  type="button"
  disabled={loading || submitting}
  onClick={handleSubmit}
>
  {loading
    ? "Loading..."
    : submitting
    ? "Assigning..."
    : "Assign Wallet"}
</Button>

          </div>

        </div>

      </DialogContent>

    </Dialog>

  );

}