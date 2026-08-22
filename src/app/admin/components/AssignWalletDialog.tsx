"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";

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
  code: string;
  networks: Network[];
};

type Props = {
  userId: string;
  userName: string;
};

export default function AssignWalletDialog({
  userId,
  userName,
}: Props) {
  const router = useRouter();

  const [open, setOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [portfolios, setPortfolios] =
    useState<Portfolio[]>([]);

  const [currencies, setCurrencies] =
    useState<Currency[]>([]);

  const [portfolioId, setPortfolioId] =
    useState("");

  const [currencyId, setCurrencyId] =
    useState("");

  const [networkId, setNetworkId] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [generate, setGenerate] =
    useState(true);

  const selectedCurrency =
    currencies.find(
      (currency) =>
        currency.id === currencyId
    );

  /*
   * Load assignment data whenever the dialog
   * opens.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    async function loadData() {
      setLoading(true);

      try {
        const response =
          await fetch(
            `/api/admin/wallets/assignment-data?userId=${encodeURIComponent(
              userId
            )}`,
            {
              cache: "no-store",
            }
          );

        const json =
          await response.json();

        if (!response.ok || !json.success) {
          throw new Error(
            json.message ??
              "Unable to load assignment data."
          );
        }

        setPortfolios(
          json.data?.portfolios ?? []
        );

        setCurrencies(
          json.data?.currencies ?? []
        );
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed loading assignment data."
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [open, userId]);

  /*
   * Reset the network whenever the currency
   * changes so a network belonging to a
   * different currency cannot accidentally
   * be submitted.
   */
  useEffect(() => {
    setNetworkId("");
  }, [currencyId]);

  /*
   * Reset the form when the dialog closes.
   */
  useEffect(() => {
    if (open) {
      return;
    }

    setPortfolioId("");
    setCurrencyId("");
    setNetworkId("");
    setAddress("");
    setGenerate(true);
    setSubmitting(false);
  }, [open]);

  async function assignWallet() {
    if (!portfolioId) {
      toast.error(
        "Please select a portfolio."
      );
      return;
    }

    if (!currencyId) {
      toast.error(
        "Please select a currency."
      );
      return;
    }

    /*
     * Canonical currencies with network records
     * must have an explicit network selected.
     */
    if (
      selectedCurrency?.networks?.length &&
      !networkId
    ) {
      toast.error(
        "Please select a network."
      );
      return;
    }

    /*
     * When using an existing address, require
     * the address field.
     */
    if (!generate && !address.trim()) {
      toast.error(
        "Please enter a wallet address."
      );
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        portfolioId,
        currencyId,
        networkId:
          networkId || undefined,
        address:
          address.trim() ||
          undefined,
        generate,
      };

      console.log(
        "ASSIGN WALLET PAYLOAD",
        payload
      );

      const response =
        await fetch(
          "/api/admin/wallets",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(
              payload
            ),
          }
        );

      const json =
        await response.json();

      if (
        !response.ok ||
        !json.success
      ) {
        throw new Error(
          json.message ??
            "Wallet assignment failed."
        );
      }

      toast.success(
        "Wallet assigned successfully."
      );

      setOpen(false);

      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error assigning wallet."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger>
  Assign Wallet
</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Assign Wallet to {userName}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className="text-slate-400">
            Loading...
          </p>
        ) : (
          <div className="space-y-4">
            <Select
              value={portfolioId}
              onValueChange={(value) =>
                setPortfolioId(
                  value ?? ""
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select portfolio" />
              </SelectTrigger>

              <SelectContent>
                {portfolios.map(
                  (portfolio) => (
                    <SelectItem
                      key={portfolio.id}
                      value={portfolio.id}
                    >
                      {portfolio.name}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>

            <Select
              value={currencyId}
              onValueChange={(value) =>
                setCurrencyId(
                  value ?? ""
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>

              <SelectContent>
                {currencies.map(
                  (currency) => (
                    <SelectItem
                      key={currency.id}
                      value={currency.id}
                    >
                      {currency.name} (
                      {currency.code})
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>

            {selectedCurrency
              ?.networks?.length ? (
              <Select
                value={networkId}
                onValueChange={(value) =>
                  setNetworkId(
                    value ?? ""
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select network" />
                </SelectTrigger>

                <SelectContent>
                  {selectedCurrency.networks.map(
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
            ) : null}

            <Input
              placeholder="Wallet address (optional)"
              value={address}
              onChange={(event) =>
                setAddress(
                  event.target.value
                )
              }
            />

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() =>
                setGenerate(
                  (current) =>
                    !current
                )
              }
            >
              {generate
                ? "Generate Wallet"
                : "Use Existing Address"}
            </Button>

            <Button
              type="button"
              className="w-full"
              disabled={
                submitting ||
                !portfolioId ||
                !currencyId ||
                Boolean(
                  selectedCurrency
                    ?.networks?.length &&
                    !networkId
                )
              }
              onClick={
                assignWallet
              }
            >
              {submitting
                ? "Assigning..."
                : "Assign Wallet"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}