"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

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
  code: string;
  name: string;
  networks: Network[];
};

type AssignWalletDialogProps = {
  userId: string;
  userName: string;
};

const SUPPORTED_GENERATION = [
  "BTC",
  "ETH",
  "SOL",
  "XRP",
  "BNB",
  "AVAX",
  "USDT",
];

export default function AssignWalletDialog({
  userId,
  userName,
}: AssignWalletDialogProps) {
  const router = useRouter();

  const [open, setOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [walletType, setWalletType] =
    useState<
      "existing" | "generated"
    >("existing");

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

  const [label, setLabel] =
    useState("");

  const selectedPortfolio =
    useMemo(
      () =>
        portfolios.find(
          (portfolio) =>
            portfolio.id ===
            portfolioId
        ),
      [portfolios, portfolioId]
    );

  const selectedCurrency =
    useMemo(
      () =>
        currencies.find(
          (currency) =>
            currency.id ===
            currencyId
        ),
      [currencies, currencyId]
    );

  const networks =
    selectedCurrency?.networks ?? [];

  const selectedNetwork =
    useMemo(
      () =>
        networks.find(
          (network) =>
            network.id === networkId
        ),
      [networks, networkId]
    );

  const canGenerate =
    selectedCurrency
      ? SUPPORTED_GENERATION.includes(
          selectedCurrency.code
        )
      : true;

  useEffect(() => {
    if (!open) return;

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

        if (
          !response.ok ||
          !json.success
        ) {
          toast.error(
            json.message ??
              "Unable to load wallet assignment data."
          );
          return;
        }

        setPortfolios(
          json.data?.portfolios ?? []
        );

        setCurrencies(
          json.data?.currencies ?? []
        );
      } catch (error) {
        console.error(error);

        toast.error(
          "Failed to load assignment data."
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [open, userId]);

  async function handleAssignAll() {
    if (!portfolioId) {
      toast.error(
        "Please select a portfolio."
      );
      return;
    }

    setSubmitting(true);

    try {
      const response =
        await fetch(
          "/api/admin/wallets/assign-all",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              portfolioId,
            }),
          }
        );

      const json =
        await response.json();

      if (
        !response.ok ||
        !json.success
      ) {
        toast.error(
          json.message ??
            "Unable to assign wallets."
        );
        return;
      }

      toast.success(
        `Created ${
          json.created ?? 0
        } wallet(s).`
      );

      setOpen(false);

      router.refresh();
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to assign wallets."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmit() {
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

    if (
      networks.length > 0 &&
      !networkId
    ) {
      toast.error(
        "Please select a network."
      );
      return;
    }

    if (
      walletType === "generated" &&
      selectedCurrency &&
      !canGenerate
    ) {
      toast.error(
        `${selectedCurrency.code} does not support automatic generation yet.`
      );
      return;
    }

    if (
      walletType === "existing" &&
      !address.trim()
    ) {
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
        generate:
          walletType === "generated",
        address:
          walletType === "existing"
            ? address.trim()
            : undefined,
        label:
          label.trim() || undefined,
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
        toast.error(
          json.message ??
            "Unable to assign wallet."
        );
        return;
      }

      toast.success(
        "Wallet assigned successfully."
      );

      setWalletType("existing");
      setPortfolioId("");
      setCurrencyId("");
      setNetworkId("");
      setAddress("");
      setLabel("");

      setOpen(false);

      router.refresh();
    } catch (error) {
      console.error(error);

      toast.error(
        "An unexpected error occurred."
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
      <DialogTrigger
        render={
          <Button size="sm">
            Assign Wallet
          </Button>
        }
      />

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Assign Wallet
          </DialogTitle>

          <DialogDescription>
            Assign a wallet to{" "}
            <strong>{userName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div>
            <Label>
              Portfolio
            </Label>

            <Select
              value={portfolioId}
              onValueChange={(value) =>
                setPortfolioId(
                  value ?? ""
                )
              }
            >
              <SelectTrigger>
                <SelectValue>
                  {selectedPortfolio?.name ??
                    "Select portfolio"}
                </SelectValue>
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
          </div>

          <div>
            <Label>
              Wallet Type
            </Label>

            <Select
              value={walletType}
              onValueChange={(value) =>
                setWalletType(
                  value === "generated"
                    ? "generated"
                    : "existing"
                )
              }
            >
              <SelectTrigger>
                <SelectValue>
                  {walletType ===
                  "generated"
                    ? "Generate Wallet"
                    : "Existing Wallet"}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="existing">
                  Existing Wallet
                </SelectItem>

                <SelectItem value="generated">
                  Generate Wallet
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>
              Currency
            </Label>

            <Select
              value={currencyId}
              onValueChange={(value) => {
                const nextCurrencyId =
                  value ?? "";

                setCurrencyId(
                  nextCurrencyId
                );

                setNetworkId("");
              }}
            >
              <SelectTrigger>
                <SelectValue>
                  {selectedCurrency
                    ? `${selectedCurrency.name} (${selectedCurrency.code})`
                    : "Select currency"}
                </SelectValue>
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
          </div>

          <div>
            <Label>
              Network
            </Label>

            <Select
              value={networkId}
              onValueChange={(value) =>
                setNetworkId(
                  value ?? ""
                )
              }
              disabled={
                networks.length === 0
              }
            >
              <SelectTrigger>
                <SelectValue>
                  {selectedNetwork?.name ??
                    "Select network"}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                {networks.map(
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

          {walletType ===
            "existing" && (
            <div>
              <Label>
                Wallet Address
              </Label>

              <Input
                value={address}
                onChange={(event) =>
                  setAddress(
                    event.target.value
                  )
                }
                placeholder="Enter wallet address"
              />
            </div>
          )}

          {walletType ===
            "generated" &&
            selectedCurrency &&
            !canGenerate && (
            <div className="rounded-md border border-yellow-600 bg-yellow-950/40 p-3 text-sm text-yellow-300">
              Wallet generation is
              not yet supported for{" "}
              {selectedCurrency.code}.
              Please assign an
              existing wallet instead.
            </div>
          )}

          <div>
            <Label>
              Label
            </Label>

            <Input
              value={label}
              onChange={(event) =>
                setLabel(
                  event.target.value
                )
              }
              placeholder="Primary Wallet"
            />
          </div>

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={
                handleAssignAll
              }
              disabled={
                loading ||
                submitting
              }
            >
              Assign All Assets
            </Button>

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={
                loading ||
                submitting ||
                !portfolioId ||
                !currencyId ||
                (networks.length > 0 &&
                  !networkId) ||
                (walletType ===
                  "generated" &&
                  !canGenerate)
              }
            >
              {submitting
                ? "Please wait..."
                : "Assign Wallet"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}