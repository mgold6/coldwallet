"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface TwoFactorToggleProps {
  enabled: boolean;
}

type SetupResponse = {
  secret?: string;
  qrCode?: string;
  error?: string;
};

type StatusResponse = {
  success?: boolean;
  enabled?: boolean;
  error?: string;
};

export default function TwoFactorToggle({
  enabled,
}: TwoFactorToggleProps) {
  const [active, setActive] = useState(enabled);
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);

  const [setup, setSetup] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [showSecret, setShowSecret] = useState(false);

  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchStatus() {
      try {
        const response = await fetch("/api/security/2fa", {
          method: "GET",
          cache: "no-store",
        });

        const data: StatusResponse = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Unable to load 2FA status."
          );
        }

        if (!cancelled) {
          setActive(data.enabled === true);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Unable to load 2FA status:",
            error
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingStatus(false);
        }
      }
    }

    void fetchStatus();

    return () => {
      cancelled = true;
    };
  }, []);

  async function startSetup() {
    setLoading(true);
    setMessage("");
    setCopied(false);

    try {
      const response = await fetch("/api/security/2fa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "setup",
        }),
      });

      const data: SetupResponse =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to start 2FA setup."
        );
      }

      setQrCode(data.qrCode || "");
      setSecret(data.secret || "");
      setShowSecret(false);
      setSetup(true);
      setCode("");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to start 2FA setup."
      );
    } finally {
      setLoading(false);
    }
  }

  async function copySecret() {
    if (!secret) {
      return;
    }

    try {
      await navigator.clipboard.writeText(secret);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setMessage(
        "Unable to copy the setup key. Please copy it manually."
      );
    }
  }

  async function verifySetup() {
    if (!/^\d{6}$/.test(code)) {
      setMessage(
        "Enter the 6-digit verification code from Google Authenticator."
      );
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/security/2fa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "verify",
          code,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Invalid verification code."
        );
      }

      setActive(true);
      setSetup(false);
      setQrCode("");
      setSecret("");
      setShowSecret(false);
      setCode("");
      setCopied(false);

      setMessage(
        "Two-factor authentication enabled successfully."
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to verify the code."
      );
    } finally {
      setLoading(false);
    }
  }

  async function disableTwoFactor() {
    const confirmed = window.confirm(
      "Are you sure you want to disable two-factor authentication?"
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/security/2fa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "disable",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to disable 2FA."
        );
      }

      setActive(false);
      setSetup(false);
      setQrCode("");
      setSecret("");
      setShowSecret(false);
      setCode("");
      setCopied(false);

      setMessage(
        "Two-factor authentication has been disabled."
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to disable 2FA."
      );
    } finally {
      setLoading(false);
    }
  }

  if (loadingStatus) {
    return (
      <div className="rounded-xl bg-slate-950 p-4">
        <p className="text-sm text-slate-400">
          Checking two-factor authentication status...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!active && !setup && (
        <div className="flex flex-col gap-4 rounded-xl bg-slate-950 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-white">
              Protect your account
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Add an extra layer of protection
              with Google Authenticator.
            </p>
          </div>

          <button
            type="button"
            onClick={startSetup}
            disabled={loading}
            className="rounded-full bg-cyan-500 px-5 py-2 text-sm font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Setting up..."
              : "Enable 2FA"}
          </button>
        </div>
      )}

      {setup && (
        <div className="rounded-2xl bg-slate-950 p-5 sm:p-6">
          <h3 className="text-lg font-semibold text-white sm:text-xl">
            Set up Google Authenticator
          </h3>

          <div className="mt-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
            <p className="text-sm font-semibold text-cyan-300">
              Google Authenticator is recommended
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Open Google Authenticator on your
              phone, tap{" "}
              <strong className="text-slate-300">
                +
              </strong>{" "}
              button, choose{" "}
              <strong className="text-slate-300">
                Scan a QR code
              </strong>
              , and scan the ColdWallet QR code
              below.
            </p>
          </div>

          <div className="mt-5 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-sm font-semibold text-white">
              Setup instructions
            </p>

            <ol className="mt-3 space-y-2 text-sm leading-6 text-slate-400">
              <li>
                <span className="font-semibold text-cyan-400">
                  1.
                </span>{" "}
                Open Google Authenticator.
              </li>

              <li>
                <span className="font-semibold text-cyan-400">
                  2.
                </span>{" "}
                Tap the{" "}
                <strong className="text-slate-300">
                  +
                </strong>{" "}
                button.
              </li>

              <li>
                <span className="font-semibold text-cyan-400">
                  3.
                </span>{" "}
                Select{" "}
                <strong className="text-slate-300">
                  Scan a QR code
                </strong>
                .
              </li>

              <li>
                <span className="font-semibold text-cyan-400">
                  4.
                </span>{" "}
                Scan the ColdWallet QR code.
              </li>

              <li>
                <span className="font-semibold text-cyan-400">
                  5.
                </span>{" "}
                Enter the 6-digit code shown by
                Google Authenticator.
              </li>
            </ol>
          </div>

          {qrCode && (
            <div className="mt-6">
              <p className="mb-3 text-center text-sm font-medium text-slate-300">
                Scan this QR code with Google
                Authenticator
              </p>

              <div className="flex justify-center rounded-2xl bg-white p-4 sm:p-5">
                <Image
                  src={qrCode}
                  alt="ColdWallet two-factor authentication QR code"
                  width={224}
                  height={224}
                  unoptimized
                  className="h-56 w-56 max-w-full"
                />
              </div>
            </div>
          )}

          {secret && (
            <div className="mt-5 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <button
                type="button"
                onClick={() =>
                  setShowSecret(!showSecret)
                }
                className="text-sm font-semibold text-cyan-400 transition hover:text-cyan-300"
              >
                {showSecret
                  ? "Hide setup key"
                  : "Can't scan the QR code? Show setup key"}
              </button>

              {showSecret && (
                <div className="mt-4">
                  <p className="text-sm leading-6 text-slate-400">
                    In Google Authenticator, tap{" "}
                    <strong className="text-slate-300">
                      +
                    </strong>
                    , choose{" "}
                    <strong className="text-slate-300">
                      Enter a setup key
                    </strong>
                    , enter the account name{" "}
                    <strong className="text-slate-300">
                      ColdWallet
                    </strong>
                    , and enter the key below.
                  </p>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <code className="min-w-0 flex-1 break-all rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-center text-sm font-semibold tracking-wider text-cyan-300">
                      {secret}
                    </code>

                    <button
                      type="button"
                      onClick={copySecret}
                      className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      {copied
                        ? "Copied"
                        : "Copy"}
                    </button>
                  </div>

                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    Keep this setup key private. It
                    can be used to generate your
                    authentication codes.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mt-6">
            <label
              htmlFor="two-factor-code"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Google Authenticator Code
            </label>

            <input
              id="two-factor-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(event) =>
                setCode(
                  event.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6)
                )
              }
              placeholder="000000"
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-center text-2xl tracking-[0.4em] text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={verifySetup}
              disabled={
                loading ||
                code.length !== 6
              }
              className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Verifying..."
                : "Verify & Enable"}
            </button>

            <button
              type="button"
              onClick={() => {
                setSetup(false);
                setQrCode("");
                setSecret("");
                setShowSecret(false);
                setCode("");
                setMessage("");
                setCopied(false);
              }}
              disabled={loading}
              className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {active && (
        <div className="flex flex-col gap-4 rounded-xl bg-slate-950 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-green-400" />

              <p className="font-semibold text-white">
                Two-factor authentication is enabled
              </p>
            </div>

            <p className="mt-1 text-sm text-slate-400">
              Your account has an additional
              authentication layer.
            </p>
          </div>

          <button
            type="button"
            onClick={disableTwoFactor}
            disabled={loading}
            className="rounded-full bg-red-500/10 px-5 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Updating..."
              : "Disable 2FA"}
          </button>
        </div>
      )}

      {message && (
        <div className="rounded-xl bg-slate-950 p-4 text-sm text-cyan-400">
          {message}
        </div>
      )}
    </div>
  );
}