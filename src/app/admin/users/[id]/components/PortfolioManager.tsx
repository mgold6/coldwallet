"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import WalletManager from "./WalletManager";

type Portfolio = {
  id: string;
  name: string;
  withdrawalsEnabled: boolean;
  withdrawalSuccessMessage: string | null;
  withdrawalErrorMessage: string | null;
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

type WithdrawalSettings = {
  enabled: boolean;
  successMessage: string;
  errorMessage: string;
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

  const [savingWithdrawalSettings, setSavingWithdrawalSettings] =
    useState<string | null>(null);

  const [name, setName] =
    useState("");

  const [selectedPortfolio, setSelectedPortfolio] =
    useState<string | null>(null);

  const [withdrawalSettings, setWithdrawalSettings] =
    useState<Record<string, WithdrawalSettings>>({});

  async function loadPortfolios() {
    setLoading(true);

    try {
      const response = await fetch(
        `/api/admin/users/${userId}/portfolios`
      );

      const json = await response.json();

      if (!json.success) {
        toast.error(
          "Unable to load portfolios."
        );
        return;
      }

      const loadedPortfolios =
        (json.portfolios ?? []) as Portfolio[];

      setPortfolios(loadedPortfolios);

      const settings: Record<
        string,
        WithdrawalSettings
      > = {};

      for (const portfolio of loadedPortfolios) {
        settings[portfolio.id] = {
          enabled:
            portfolio.withdrawalsEnabled,
          successMessage:
            portfolio.withdrawalSuccessMessage ??
            "Your withdrawal request has been submitted successfully.",
          errorMessage:
            portfolio.withdrawalErrorMessage ??
            "Withdrawals are currently unavailable for this portfolio.",
        };
      }

      setWithdrawalSettings(settings);
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed loading portfolios."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      setLoading(true);

      try {
        const response = await fetch(
          `/api/admin/users/${userId}/portfolios`
        );

        const json = await response.json();

        if (cancelled) {
          return;
        }

        if (!json.success) {
          toast.error(
            "Unable to load portfolios."
          );
          return;
        }

        const loadedPortfolios =
          (json.portfolios ?? []) as Portfolio[];

        setPortfolios(loadedPortfolios);

        const settings: Record<
          string,
          WithdrawalSettings
        > = {};

        for (const portfolio of loadedPortfolios) {
          settings[portfolio.id] = {
            enabled:
              portfolio.withdrawalsEnabled,
            successMessage:
              portfolio.withdrawalSuccessMessage ??
              "Your withdrawal request has been submitted successfully.",
            errorMessage:
              portfolio.withdrawalErrorMessage ??
              "Withdrawals are currently unavailable for this portfolio.",
          };
        }

        setWithdrawalSettings(settings);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(error);

        toast.error(
          "Failed loading portfolios."
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
      const response = await fetch(
        `/api/admin/users/${userId}/portfolios`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
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
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed creating portfolio."
      );
    } finally {
      setCreating(false);
    }
  }

  async function saveWithdrawalSettings(
    portfolioId: string
  ) {
    const settings =
      withdrawalSettings[portfolioId];

    if (!settings) {
      toast.error(
        "Withdrawal settings are not loaded."
      );

      return;
    }

    if (
      !settings.successMessage.trim()
    ) {
      toast.error(
        "Please enter a withdrawal success message."
      );

      return;
    }

    if (
      !settings.errorMessage.trim()
    ) {
      toast.error(
        "Please enter a withdrawal error message."
      );

      return;
    }

    setSavingWithdrawalSettings(
      portfolioId
    );

    try {
      const portfolio =
        portfolios.find(
          (item) =>
            item.id === portfolioId
        );

      if (!portfolio) {
        throw new Error(
          "Portfolio not found."
        );
      }

      const response = await fetch(
        `/api/admin/users/${userId}/portfolios`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            portfolioId,
            name: portfolio.name,
            withdrawalsEnabled:
              settings.enabled,
            withdrawalSuccessMessage:
              settings.successMessage.trim(),
            withdrawalErrorMessage:
              settings.errorMessage.trim(),
          }),
        }
      );

      const json =
        await response.json();

      if (!response.ok || !json.success) {
        throw new Error(
          json.message ??
            "Unable to save withdrawal settings."
        );
      }

      setPortfolios((current) =>
        current.map((item) =>
          item.id === portfolioId
            ? {
                ...item,
                withdrawalsEnabled:
                  settings.enabled,
                withdrawalSuccessMessage:
                  settings.successMessage.trim(),
                withdrawalErrorMessage:
                  settings.errorMessage.trim(),
              }
            : item
        )
      );

      toast.success(
        "Withdrawal settings saved."
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed saving withdrawal settings."
      );
    } finally {
      setSavingWithdrawalSettings(
        null
      );
    }
  }

  async function deletePortfolio(
    portfolioId: string,
    portfolioName: string
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
      const response = await fetch(
        `/api/admin/users/${userId}/portfolios`,
        {
          method: "DELETE",
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
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed deleting portfolio."
      );
    } finally {
      setDeleting(false);
    }
  }

  function updateWithdrawalSetting(
    portfolioId: string,
    field: keyof WithdrawalSettings,
    value: boolean | string
  ) {
    setWithdrawalSettings(
      (current) => ({
        ...current,
        [portfolioId]: {
          ...current[portfolioId],
          [field]: value,
        },
      })
    );
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">
          Portfolios
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Create and manage asset portfolios,
          wallets, and withdrawal permissions for
          this user.
        </p>
      </div>

      <div className="mb-6 flex gap-3">
        <Input
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          placeholder="Example: Business Assets"
          className="border-slate-700 bg-slate-950 text-white"
        />

        <Button
          onClick={createPortfolio}
          disabled={creating}
        >
          {creating
            ? "Creating..."
            : "Create Portfolio"}
        </Button>
      </div>

      <div className="space-y-4">
        {loading && (
          <p className="text-slate-400">
            Loading portfolios...
          </p>
        )}

        {!loading &&
          portfolios.length === 0 && (
            <p className="text-sm text-slate-500">
              No portfolios found.
            </p>
          )}

        {portfolios.map((portfolio) => {
          const settings =
            withdrawalSettings[
              portfolio.id
            ];

          return (
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
                    {portfolio.wallets.length}{" "}
                    wallet(s)
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    className="border-slate-700 bg-slate-900 text-white"
                    onClick={() =>
                      setSelectedPortfolio(
                        selectedPortfolio ===
                          portfolio.id
                          ? null
                          : portfolio.id
                      )
                    }
                  >
                    {selectedPortfolio ===
                    portfolio.id
                      ? "Hide Wallets"
                      : "Manage Wallets"}
                  </Button>

                  <Button
                    variant="destructive"
                    disabled={deleting}
                    onClick={() =>
                      deletePortfolio(
                        portfolio.id,
                        portfolio.name
                      )
                    }
                  >
                    {deleting
                      ? "Deleting..."
                      : "Delete"}
                  </Button>
                </div>
              </div>

              {portfolio.wallets.length >
                0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {portfolio.wallets.map(
                    (wallet) => (
                      <span
                        key={wallet.id}
                        className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-300"
                      >
                        {wallet.currency.code}
                      </span>
                    )
                  )}
                </div>
              )}

              {settings && (
                <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-5">
                  <div className="mb-4">
                    <h4 className="font-semibold text-white">
                      Withdrawal Settings
                    </h4>

                    <p className="mt-1 text-xs text-slate-500">
                      These settings apply only to this
                      portfolio.
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div className="flex items-center justify-between gap-4 rounded-lg border border-slate-800 bg-slate-950 p-4">
                      <div>
                        <p className="font-medium text-white">
                          Allow Withdrawals
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          When disabled, users assigned to
                          this portfolio cannot submit
                          withdrawals.
                        </p>
                      </div>

                      <button
                        type="button"
                        role="switch"
                        aria-checked={
                          settings.enabled
                        }
                        onClick={() =>
                          updateWithdrawalSetting(
                            portfolio.id,
                            "enabled",
                            !settings.enabled
                          )
                        }
                        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border transition ${
                          settings.enabled
                            ? "border-cyan-400 bg-cyan-500"
                            : "border-slate-600 bg-slate-700"
                        }`}
                      >
                        <span
                          className={`pointer-events-none block h-5 w-5 translate-y-0.5 rounded-full bg-white shadow transition ${
                            settings.enabled
                              ? "translate-x-5"
                              : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        Withdrawal Success Message
                      </label>

                      <Input
                        value={
                          settings.successMessage
                        }
                        onChange={(event) =>
                          updateWithdrawalSetting(
                            portfolio.id,
                            "successMessage",
                            event.target.value
                          )
                        }
                        placeholder="Your withdrawal request has been submitted successfully."
                        className="border-slate-700 bg-slate-950 text-white"
                      />

                      <p className="mt-1 text-xs text-slate-500">
                        Shown when a withdrawal is
                        successfully submitted.
                      </p>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        Withdrawal Error Message
                      </label>

                      <Input
                        value={
                          settings.errorMessage
                        }
                        onChange={(event) =>
                          updateWithdrawalSetting(
                            portfolio.id,
                            "errorMessage",
                            event.target.value
                          )
                        }
                        placeholder="Withdrawals are currently unavailable for this portfolio."
                        className="border-slate-700 bg-slate-950 text-white"
                      />

                      <p className="mt-1 text-xs text-slate-500">
                        Shown when a withdrawal cannot
                        be submitted.
                      </p>
                    </div>

                    <Button
                      onClick={() =>
                        saveWithdrawalSettings(
                          portfolio.id
                        )
                      }
                      disabled={
                        savingWithdrawalSettings ===
                        portfolio.id
                      }
                    >
                      {savingWithdrawalSettings ===
                      portfolio.id
                        ? "Saving..."
                        : "Save Withdrawal Settings"}
                    </Button>
                  </div>
                </div>
              )}

              {selectedPortfolio ===
                portfolio.id && (
                <div className="mt-6 border-t border-slate-800 pt-6">
                  <WalletManager
                    userId={userId}
                    portfolioId={portfolio.id}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
