"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  ShieldCheck,
  Lock,
  History,
  X,
} from "lucide-react";

type LoginRecord = {
  id: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
};

type TwoFactorStatusResponse = {
  success?: boolean;
  enabled?: boolean;
  error?: string;
};

export default function SecurityPage() {
  const [twoFactorEnabled, setTwoFactorEnabled] =
    useState(false);

  const [loginHistory, setLoginHistory] =
    useState<LoginRecord[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [twoFactorStatusLoading, setTwoFactorStatusLoading] =
    useState(true);

  const [twoFactorLoading, setTwoFactorLoading] =
    useState(false);

  const [twoFactorSetup, setTwoFactorSetup] =
    useState(false);

  const [qrCode, setQrCode] =
    useState("");

  const [verificationCode, setVerificationCode] =
    useState("");

  const [verifyingTwoFactor, setVerifyingTwoFactor] =
    useState(false);

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [changingPassword, setChangingPassword] =
    useState(false);

  async function loadTwoFactorStatus() {
    const response = await fetch(
      "/api/security/2fa",
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const data: TwoFactorStatusResponse =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
          "Unable to load two-factor authentication status."
      );
    }

    return data.enabled === true;
  }

  async function loadSecurityData() {
    const response =
      await fetch(
        "/api/security/login-history",
        {
          cache: "no-store",
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
          "Unable to load login history."
      );
    }

    return Array.isArray(data)
      ? data
      : [];
  }

  useEffect(() => {
    let cancelled = false;

    async function loadInitialSecurityData() {
      setTwoFactorStatusLoading(true);
      setLoading(true);

      const [
        twoFactorResult,
        loginHistoryResult,
      ] = await Promise.allSettled([
        loadTwoFactorStatus(),
        loadSecurityData(),
      ]);

      if (cancelled) {
        return;
      }

      if (
        twoFactorResult.status ===
        "fulfilled"
      ) {
        setTwoFactorEnabled(
          twoFactorResult.value
        );
      } else {
        console.error(
          "Unable to load 2FA status:",
          twoFactorResult.reason
        );

        toast.error(
          "Unable to load your 2FA status."
        );
      }

      if (
        loginHistoryResult.status ===
        "fulfilled"
      ) {
        setLoginHistory(
          loginHistoryResult.value
        );
      } else {
        console.error(
          "Unable to load security data:",
          loginHistoryResult.reason
        );
      }

      setTwoFactorStatusLoading(false);
      setLoading(false);
    }

    void loadInitialSecurityData();

    return () => {
      cancelled = true;
    };
  }, []);

  async function startTwoFactorSetup() {
    setTwoFactorLoading(true);

    try {
      const response =
        await fetch(
          "/api/security/2fa",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              action: "setup",
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to start 2FA setup."
        );
      }

      if (!data.qrCode) {
        throw new Error(
          "QR code was not generated."
        );
      }

      setQrCode(data.qrCode);
      setTwoFactorSetup(true);
      setVerificationCode("");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to start 2FA setup."
      );
    } finally {
      setTwoFactorLoading(false);
    }
  }

  async function verifyTwoFactor() {
    const code =
      verificationCode.trim();

    if (!/^\d{6}$/.test(code)) {
      toast.error(
        "Enter the 6-digit code from your authenticator app."
      );

      return;
    }

    setVerifyingTwoFactor(true);

    try {
      const response =
        await fetch(
          "/api/security/2fa",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              action: "verify",
              code,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to verify the 2FA code."
        );
      }

      setTwoFactorEnabled(true);
      setTwoFactorSetup(false);
      setQrCode("");
      setVerificationCode("");

      toast.success(
        "Two-factor authentication is now enabled. Your security score is 100%."
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to verify the 2FA code."
      );
    } finally {
      setVerifyingTwoFactor(false);
    }
  }

  async function disableTwoFactor() {
    const confirmed =
      window.confirm(
        "Are you sure you want to disable two-factor authentication?"
      );

    if (!confirmed) {
      return;
    }

    setTwoFactorLoading(true);

    try {
      const response =
        await fetch(
          "/api/security/2fa",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              action: "disable",
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to disable 2FA."
        );
      }

      setTwoFactorEnabled(false);
      setTwoFactorSetup(false);
      setQrCode("");
      setVerificationCode("");

      toast.success(
        "Two-factor authentication has been disabled. Your security score is now 80%."
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to disable 2FA."
      );
    } finally {
      setTwoFactorLoading(false);
    }
  }

  async function changePassword() {
    if (
      !currentPassword ||
      !newPassword
    ) {
      toast.error(
        "Enter both passwords."
      );

      return;
    }

    setChangingPassword(true);

    try {
      const response =
        await fetch(
          "/api/security/password",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              currentPassword,
              newPassword,
            }),
          }
        );

      const data =
        await response.json();

      if (data.success) {
        toast.success(
          "Password updated."
        );

        setCurrentPassword("");
        setNewPassword("");
      } else {
        toast.error(
          data.error ||
            "Password update failed."
        );
      }
    } catch {
      toast.error(
        "Password update failed."
      );
    } finally {
      setChangingPassword(false);
    }
  }

  const securityScore =
    twoFactorEnabled ? 100 : 80;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Security Center
        </h1>

        <p className="mt-2 text-slate-400">
          Manage your account protection and
          security settings.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
          <ShieldCheck className="text-cyan-400" />

          <h2 className="mt-4 text-xl font-semibold text-white">
            Security Score
          </h2>

          <p className="mt-2 text-3xl font-bold text-cyan-400">
            {twoFactorStatusLoading
              ? "..."
              : `${securityScore}%`}
          </p>

          <p className="mt-2 text-sm text-slate-400">
            {twoFactorStatusLoading
              ? "Checking your security settings..."
              : twoFactorEnabled
                ? "Your recommended security protection is enabled."
                : "Enable 2FA to bring your security score to 100%."}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
          <Lock className="text-cyan-400" />

          <h2 className="mt-4 text-xl font-semibold text-white">
            Two Factor Authentication
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            {twoFactorStatusLoading
              ? "Checking your 2FA status..."
              : twoFactorEnabled
                ? "Your account is protected with two-factor authentication."
                : "Add an extra layer of protection to your account."}
          </p>

          <button
            type="button"
            onClick={
              twoFactorEnabled
                ? disableTwoFactor
                : startTwoFactorSetup
            }
            disabled={
              twoFactorLoading ||
              twoFactorStatusLoading
            }
            className="
              mt-4
              rounded-lg
              bg-cyan-500
              px-4
              py-2
              text-sm
              font-medium
              text-black
              transition
              hover:bg-cyan-400
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {twoFactorLoading
              ? "Processing..."
              : twoFactorStatusLoading
                ? "Checking..."
                : twoFactorEnabled
                  ? "Disable 2FA"
                  : "Enable 2FA"}
          </button>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
          <History className="text-cyan-400" />

          <h2 className="mt-4 text-xl font-semibold text-white">
            Login History
          </h2>

          <p className="mt-2 text-slate-400">
            {loginHistory.length} recent sessions
          </p>
        </div>
      </div>

      {twoFactorSetup && (
        <div className="rounded-2xl border border-cyan-500/30 bg-slate-950 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Set Up Two-Factor Authentication
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Scan the QR code with your
                authenticator app, then enter
                the 6-digit verification code.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setTwoFactorSetup(false);
                setQrCode("");
                setVerificationCode("");
              }}
              className="
                rounded-lg
                p-2
                text-slate-400
                transition
                hover:bg-slate-800
                hover:text-white
              "
              aria-label="Close 2FA setup"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mt-6 flex flex-col items-center gap-6 md:flex-row md:items-start">
            {qrCode && (
              <div className="rounded-xl bg-white p-4">
                <Image
                  src={qrCode}
                  alt="Two-factor authentication QR code"
                  width={208}
                  height={208}
                  unoptimized
                  className="h-52 w-52"
                />
              </div>
            )}

            <div className="w-full max-w-md">
              <label
                htmlFor="two-factor-code"
                className="text-sm font-medium text-slate-300"
              >
                Verification Code
              </label>

              <input
                id="two-factor-code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={verificationCode}
                onChange={(event) =>
                  setVerificationCode(
                    event.target.value
                      .replace(/\D/g, "")
                      .slice(0, 6)
                  )
                }
                placeholder="Enter 6-digit code"
                className="
                  mt-2
                  w-full
                  rounded-lg
                  border
                  border-slate-700
                  bg-slate-900
                  p-3
                  text-center
                  text-xl
                  tracking-[0.4em]
                  text-white
                  outline-none
                  focus:border-cyan-400
                "
              />

              <button
                type="button"
                onClick={verifyTwoFactor}
                disabled={
                  verifyingTwoFactor ||
                  verificationCode.length !== 6
                }
                className="
                  mt-4
                  w-full
                  rounded-lg
                  bg-cyan-500
                  px-5
                  py-3
                  font-medium
                  text-black
                  transition
                  hover:bg-cyan-400
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {verifyingTwoFactor
                  ? "Verifying..."
                  : "Verify and Enable 2FA"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
        <h2 className="text-xl font-semibold text-white">
          Change Password
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <input
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(event) =>
              setCurrentPassword(
                event.target.value
              )
            }
            className="
              rounded-lg
              bg-slate-900
              p-3
              text-white
              outline-none
              focus:ring-1
              focus:ring-cyan-400
            "
          />

          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(event) =>
              setNewPassword(
                event.target.value
              )
            }
            className="
              rounded-lg
              bg-slate-900
              p-3
              text-white
              outline-none
              focus:ring-1
              focus:ring-cyan-400
            "
          />
        </div>

        <button
          type="button"
          onClick={changePassword}
          disabled={changingPassword}
          className="
            mt-5
            rounded-lg
            bg-cyan-500
            px-5
            py-2
            font-medium
            text-black
            transition
            hover:bg-cyan-400
            disabled:opacity-50
          "
        >
          {changingPassword
            ? "Updating..."
            : "Update Password"}
        </button>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
        <h2 className="text-xl font-semibold text-white">
          Recent Login Activity
        </h2>

        {loading ? (
          <p className="mt-4 text-slate-400">
            Loading...
          </p>
        ) : loginHistory.length === 0 ? (
          <p className="mt-4 text-slate-400">
            No login activity found.
          </p>
        ) : (
          <div className="mt-5 space-y-3">
            {loginHistory.map(
              (login) => (
                <div
                  key={login.id}
                  className="rounded-lg bg-slate-900 p-4"
                >
                  <p className="text-white">
                    {login.ipAddress ??
                      "Unknown IP"}
                  </p>

                  <p className="text-sm text-slate-400">
                    {new Date(
                      login.createdAt
                    ).toLocaleString()}
                  </p>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}