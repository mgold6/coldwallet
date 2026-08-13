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

type ApiResponse<T = unknown> = {
  success?: boolean;
  message?: string;
  data?: T;
  wallets?: Wallet[];
  wallet?: Wallet;
};

async function readJsonResponse<T>(
  response: Response
): Promise<ApiResponse<T>> {
  const contentType =
    response.headers.get("content-type") ?? "";

  const text = await response.text();

  if (!contentType.includes("application/json")) {
    throw new Error(
      `Server returned a non-JSON response (${response.status}).`
    );
  }

  try {
    return JSON.parse(text) as ApiResponse<T>;
  } catch {
    throw new Error(
      `Server returned invalid JSON (${response.status}).`
    );
  }
}

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

  const [loading, setLoading] =
    useState(true);

  async function loadWallets() {
    try {
      const response = await fetch(
        `/api/admin/users/${userId}/portfolios/${portfolioId}/wallets`,
        {
          cache: "no-store",
        }
      );

      const json =
        await readJsonResponse(response);

      if (!response.ok || !json.success) {
        throw new Error(
          json.message ??
            "Unable to load wallets."
        );
      }

      setWallets(json.wallets ?? []);
    } catch (error) {
      console.error(
        "LOAD WALLETS ERROR:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to load wallets."
      );
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      setLoading(true);

      try {
        const walletsResponse =
          await fetch(
            `/api/admin/users/${userId}/portfolios/${portfolioId}/wallets`,
            {
              cache: "no-store",
            }
          );

        const currenciesResponse =
          await fetch(
            `/api/admin/wallets/assignment-data?userId=${userId}`,
            {
              cache: "no-store",
            }
          );

        const walletsJson =
          await readJsonResponse(
            walletsResponse
          );

        const currenciesJson =
          await readJsonResponse<{
            portfolios: unknown[];
            currencies: Currency[];
          }>(currenciesResponse);

        if (cancelled) {
          return;
        }

        if (
          !walletsResponse.ok ||
          !walletsJson.success
        ) {
          throw new Error(
            walletsJson.message ??
              "Unable to load wallets."
          );
        }

        setWallets(
          walletsJson.wallets ?? []
        );

        if (
          !currenciesResponse.ok ||
          !currenciesJson.success
        ) {
          throw new Error(
            currenciesJson.message ??
              "Unable to load currencies."
          );
        }

        /*
         * IMPORTANT:
         *
         * The assignment-data API returns:
         *
         * {
         *   success: true,
         *   data: {
         *     portfolios: [],
         *     currencies: []
         *   }
         * }
         *
         * Therefore currencies must come from
         * currenciesJson.data.currencies.
         */
        setCurrencies(
          currenciesJson.data?.currencies ?? []
        );
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "WALLET INITIALIZATION ERROR:",
          error
        );

        toast.error(
          error instanceof Error
            ? error.message
            : "Unable to load wallet data."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    initialize();

    return () => {
      cancelled = true;
    };
  }, [portfolioId, userId]);

  const selectedCurrency =
    currencies.find(
      (currency) =>
        currency.id === currencyId
    );

  async function assignWallet() {
    if (!currencyId) {
      toast.error("Select currency.");
      return;
    }

    if (
      mode === "import" &&
      !walletAddress.trim()
    ) {
      toast.error("Enter wallet address.");
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
                walletLabel.trim() ||
                undefined,
            };

      const response = await fetch(
        `/api/admin/users/${userId}/portfolios/${portfolioId}/wallets`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const json =
        await readJsonResponse(response);

      if (
        !response.ok ||
        !json.success
      ) {
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
    } catch (error) {
      console.error(
        "WALLET ASSIGNMENT ERROR:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Wallet assignment failed."
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
      const response = await fetch(
        `/api/admin/users/${userId}/portfolios/${portfolioId}/wallets`,
        {
          method: "DELETE",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            walletId,
          }),
        }
      );

      const json =
        await readJsonResponse(response);

      if (
        !response.ok ||
        !json.success
      ) {
        toast.error(
          json.message ??
            "Delete failed."
        );

        return;
      }

      toast.success("Wallet deleted.");

      await loadWallets();
    } catch (error) {
      console.error(
        "DELETE WALLET ERROR:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Delete failed."
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
            type="button"
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
            type="button"
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

        {loading ? (
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-sm text-slate-400">
            Loading wallet options...
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <Select
                value={
                  currencyId || undefined
                }
                onValueChange={(value) => {
                  if (
                    typeof value !==
                    "string"
                  ) {
                    return;
                  }

                  setCurrencyId(value);
                  setNetworkId("");
                }}
              >
                <SelectTrigger className="bg-slate-900 text-white">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>

                <SelectContent>
                  {currencies.map(
                    (currency) => (
                      <SelectItem
                        key={currency.id}
                        value={currency.id}
                      >
                        {currency.code}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>

              <Select
                value={
                  networkId || undefined
                }
                onValueChange={(value) => {
                  if (
                    typeof value !==
                    "string"
                  ) {
                    return;
                  }

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
                  className="border-slate-700 bg-slate-900 text-white"
                />

                <Input
                  value={walletLabel}
                  onChange={(event) =>
                    setWalletLabel(
                      event.target.value
                    )
                  }
                  placeholder="Wallet label (optional)"
                  className="border-slate-700 bg-slate-900 text-white"
                />
              </div>
            )}

            <Button
              type="button"
              className="mt-5"
              onClick={assignWallet}
              disabled={assigning}
            >
              {assigning
                ? "Assigning..."
                : mode === "import"
                  ? "Import Wallet"
                  : "Generate Wallet"}
            </Button>
          </>
        )}
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
              className="flex items-center justify-between rounded-lg border border-slate-800 p-4"
            >
              <div>
                <p className="font-semibold text-white">
                  {wallet.currency.code}
                </p>

                <p className="text-sm text-slate-400">
                  {wallet.network?.name ??
                    "-"}
                </p>

                <p className="font-mono text-xs text-slate-500">
                  {wallet.address.slice(
                    0,
                    18
                  )}
                  ...
                </p>
              </div>

              <Button
                type="button"
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