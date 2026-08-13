"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface UserEditFormProps {
  user: {
    id: string;
    role: string;
    status: string;
    firstName?: string | null;
    lastName?: string | null;
  };
}

export default function UserEditForm({
  user,
}: UserEditFormProps) {
  const router = useRouter();

  const [role, setRole] = useState(user.role);
  const [status, setStatus] = useState(user.status);

  const [firstName, setFirstName] = useState(
    user.firstName ?? ""
  );

  const [lastName, setLastName] = useState(
    user.lastName ?? ""
  );

  const [saving, setSaving] = useState(false);
  const [resettingTwoFactor, setResettingTwoFactor] =
    useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error" | ""
  >("");

  async function saveUser() {
    setSaving(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch(
        `/api/admin/users/${user.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role,
            status,
            firstName,
            lastName,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to save user changes."
        );
      }

      setMessage(
        "User changes saved successfully."
      );
      setMessageType("success");

      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to save user changes."
      );
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  }

  async function resetTwoFactor() {
    const confirmed = window.confirm(
      "Reset this user's two-factor authentication? Their existing authenticator configuration will be removed, and they will be able to sign in with their password and set up 2FA again."
    );

    if (!confirmed) {
      return;
    }

    setResettingTwoFactor(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch(
        `/api/admin/users/${user.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "RESET_2FA",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to reset two-factor authentication."
        );
      }

      setMessage(
        "Two-factor authentication has been reset successfully. The user can now sign in with their password and configure 2FA again."
      );
      setMessageType("success");

      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to reset two-factor authentication."
      );
      setMessageType("error");
    } finally {
      setResettingTwoFactor(false);
    }
  }

  return (
    <section className="space-y-6 rounded-xl border border-slate-800 bg-slate-900 p-6">
      <div>
        <h2 className="text-xl font-semibold text-white">
          User Management
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Manage this user&apos;s profile, account status,
          role, and security recovery options.
        </p>
      </div>

      <div>
        <label className="text-sm text-slate-400">
          Role
        </label>

        <select
          value={role}
          onChange={(e) =>
            setRole(e.target.value)
          }
          className="mt-2 w-full rounded-lg bg-slate-950 p-3 text-white"
        >
          <option value="USER">
            USER
          </option>

          <option value="ADMIN">
            ADMIN
          </option>
        </select>
      </div>

      <div>
        <label className="text-sm text-slate-400">
          Status
        </label>

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
          className="mt-2 w-full rounded-lg bg-slate-950 p-3 text-white"
        >
          <option value="ACTIVE">
            ACTIVE
          </option>

          <option value="PENDING">
            PENDING
          </option>

          <option value="SUSPENDED">
            SUSPENDED
          </option>

          <option value="DISABLED">
            DISABLED
          </option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          value={firstName}
          onChange={(e) =>
            setFirstName(e.target.value)
          }
          placeholder="First Name"
          className="rounded-lg bg-slate-950 p-3 text-white outline-none focus:ring-2 focus:ring-cyan-400"
        />

        <input
          value={lastName}
          onChange={(e) =>
            setLastName(e.target.value)
          }
          placeholder="Last Name"
          className="rounded-lg bg-slate-950 p-3 text-white outline-none focus:ring-2 focus:ring-cyan-400"
        />
      </div>

      <button
        type="button"
        onClick={saveUser}
        disabled={
          saving || resettingTwoFactor
        }
        className="rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving
          ? "Saving..."
          : "Save Changes"}
      </button>

      {/* Security Recovery */}

      <div className="border-t border-slate-800 pt-6">
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
          <h3 className="text-lg font-semibold text-white">
            Security Recovery
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            If this user is unable to access their
            authenticator or complete their two-factor
            verification, an administrator can reset
            their 2FA configuration.
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            This does not change the user&apos;s password.
            Their existing 2FA secret will be removed
            and they can configure 2FA again after
            signing in.
          </p>

          <button
            type="button"
            onClick={resetTwoFactor}
            disabled={
              saving || resettingTwoFactor
            }
            className="mt-5 rounded-lg border border-red-500/40 bg-red-500/10 px-5 py-3 font-semibold text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {resettingTwoFactor
              ? "Resetting 2FA..."
              : "Reset User 2FA"}
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`rounded-lg p-4 text-sm ${
            messageType === "success"
              ? "bg-green-500/10 text-green-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {message}
        </div>
      )}
    </section>
  );
}