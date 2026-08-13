"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SettingKey =
  | "message_withdrawals_enabled"
  | "message_withdrawals_disabled"
  | "message_withdrawal_locked"
  | "withdrawal_insufficient_balance"
  | "manual_funds_withdrawable"
  | "message_manual_funds_not_withdrawable"
  | "message_withdrawal_declined"
  | "deposit_notification_title"
  | "deposit_notification_message"
  | "deposit_email_subject"
  | "deposit_email_message";

type Settings = Record<
  SettingKey,
  string
>;

interface SettingsFormProps {
  settings: Settings;
}

const WITHDRAWAL_MESSAGE_FIELDS: Array<{
  key: Exclude<
    SettingKey,
    | "manual_funds_withdrawable"
    | "deposit_notification_title"
    | "deposit_notification_message"
    | "deposit_email_subject"
    | "deposit_email_message"
  >;
  title: string;
  description: string;
}> = [
  {
    key: "message_withdrawals_enabled",
    title: "Withdrawals Enabled Message",
    description:
      "Shown when withdrawals are enabled and available to the user.",
  },
  {
    key: "message_withdrawals_disabled",
    title: "Withdrawals Disabled Message",
    description:
      "Default message used when withdrawals are unavailable.",
  },
  {
    key: "message_withdrawal_locked",
    title: "Withdrawal Locked Message",
    description:
      "Shown when a user's wallet is locked for withdrawals.",
  },
  {
    key: "withdrawal_insufficient_balance",
    title: "Insufficient Balance Message",
    description:
      "Shown when the requested withdrawal cannot be covered by the available balance.",
  },
  {
    key: "message_manual_funds_not_withdrawable",
    title: "Manual Funds Unavailable Message",
    description:
      "Shown when manual/internal funds are not enabled for withdrawal.",
  },
  {
    key: "message_withdrawal_declined",
    title: "Withdrawal Declined Message",
    description:
      "Default message shown after an administrator declines a withdrawal.",
  },
];

const DEPOSIT_FIELDS: Array<{
  key:
    | "deposit_notification_title"
    | "deposit_notification_message"
    | "deposit_email_subject"
    | "deposit_email_message";
  title: string;
  description: string;
  rows: number;
}> = [
  {
    key: "deposit_notification_title",
    title: "In-App Deposit Notification Title",
    description:
      "The title users see in their in-app notification.",
    rows: 2,
  },
  {
    key: "deposit_notification_message",
    title: "In-App Deposit Notification Message",
    description:
      "The message users see when a deposit notification is sent.",
    rows: 4,
  },
  {
    key: "deposit_email_subject",
    title: "Deposit Email Subject",
    description:
      "The subject line used for the deposit notification email.",
    rows: 2,
  },
  {
    key: "deposit_email_message",
    title: "Deposit Email Message",
    description:
      "The body of the deposit notification email.",
    rows: 8,
  },
];

export default function SettingsForm({
  settings,
}: SettingsFormProps) {
  const router = useRouter();

  const [values, setValues] =
    useState<Settings>(settings);

  const [status, setStatus] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  function updateValue(
    key: SettingKey,
    value: string
  ) {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function saveSetting(
    key: SettingKey,
    value: string,
    description: string
  ) {
    const response = await fetch(
      "/api/admin/settings",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          key,
          value,
          description,
        }),
      }
    );

    const data =
      await response
        .json()
        .catch(() => null);

    if (!response.ok) {
      throw new Error(
        data?.error ??
          `Unable to save ${key}.`
      );
    }
  }

  async function handleSave() {
    setSaving(true);
    setStatus("Saving settings...");

    try {
      await saveSetting(
        "message_withdrawals_enabled",
        values.message_withdrawals_enabled,
        "Message shown when withdrawals are enabled."
      );

      await saveSetting(
        "message_withdrawals_disabled",
        values.message_withdrawals_disabled,
        "Default message shown when withdrawals are unavailable."
      );

      await saveSetting(
        "message_withdrawal_locked",
        values.message_withdrawal_locked,
        "Message shown when a wallet is locked for withdrawals."
      );

      await saveSetting(
        "withdrawal_insufficient_balance",
        values.withdrawal_insufficient_balance,
        "Message shown when a withdrawal cannot be completed because of insufficient available balance."
      );

      await saveSetting(
        "manual_funds_withdrawable",
        values.manual_funds_withdrawable,
        "Controls whether manual/internal funds may be used for withdrawals."
      );

      await saveSetting(
        "message_manual_funds_not_withdrawable",
        values.message_manual_funds_not_withdrawable,
        "Message shown when manual/internal funds are not available for withdrawal."
      );

      await saveSetting(
        "message_withdrawal_declined",
        values.message_withdrawal_declined,
        "Default message shown when an administrator declines a withdrawal."
      );

      await saveSetting(
        "deposit_notification_title",
        values.deposit_notification_title,
        "Title used for deposit in-app notifications."
      );

      await saveSetting(
        "deposit_notification_message",
        values.deposit_notification_message,
        "Message used for deposit in-app notifications."
      );

      await saveSetting(
        "deposit_email_subject",
        values.deposit_email_subject,
        "Subject used for deposit notification emails."
      );

      await saveSetting(
        "deposit_email_message",
        values.deposit_email_message,
        "Body used for deposit notification emails."
      );

      setStatus(
        "Settings saved successfully."
      );

      router.refresh();
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Unable to save settings."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-bold text-white">
          Withdrawal Controls
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Manage withdrawal messages and
          manual/internal funds. Withdrawal
          availability is controlled by the
          individual user and portfolio
          settings.
        </p>

        <div className="mt-6">
          <label className="block rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <span className="block text-sm font-medium text-white">
              Manual / Internal Funds
            </span>

            <span className="mt-1 block text-xs text-slate-500">
              Allow manual/internal funds to be
              used for withdrawals.
            </span>

            <select
              value={
                values.manual_funds_withdrawable
              }
              onChange={(event) =>
                updateValue(
                  "manual_funds_withdrawable",
                  event.target.value
                )
              }
              className="mt-4 w-full rounded-xl border border-slate-800 bg-slate-900 p-3 text-white outline-none"
              disabled={saving}
            >
              <option value="false">
                Disabled
              </option>

              <option value="true">
                Enabled
              </option>
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-bold text-white">
          Withdrawal Messages
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          These messages can be edited without
          changing the application source code.
        </p>

        <div className="mt-6 space-y-5">
          {WITHDRAWAL_MESSAGE_FIELDS.map(
            (field) => (
              <div key={field.key}>
                <label
                  htmlFor={field.key}
                  className="block text-sm font-medium text-white"
                >
                  {field.title}
                </label>

                <p className="mt-1 text-xs text-slate-500">
                  {field.description}
                </p>

                <textarea
                  id={field.key}
                  value={values[field.key]}
                  onChange={(event) =>
                    updateValue(
                      field.key,
                      event.target.value
                    )
                  }
                  rows={3}
                  disabled={saving}
                  className="mt-3 w-full rounded-xl border border-slate-800 bg-slate-950 p-4 text-white outline-none focus:border-cyan-400"
                />
              </div>
            )
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-cyan-900/50 bg-slate-900 p-6">
        <h2 className="text-xl font-bold text-white">
          Deposit Notifications
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Customize the in-app and email
          notification users receive when an
          administrator sends a deposit
          notification.
        </p>

        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-sm font-medium text-cyan-300">
            Available variables
          </p>

          <p className="mt-2 text-xs leading-6 text-slate-400">
            {"{{firstName}}"} ·{" "}
            {"{{amount}}"} ·{" "}
            {"{{usdAmount}}"} ·{" "}
            {"{{currency}}"} ·{" "}
            {"{{reference}}"} ·{" "}
            {"{{walletAddress}}"} ·{" "}
            {"{{date}}"}
          </p>
        </div>

        <div className="mt-6 space-y-6">
          {DEPOSIT_FIELDS.map(
            (field) => (
              <div key={field.key}>
                <label
                  htmlFor={field.key}
                  className="block text-sm font-medium text-white"
                >
                  {field.title}
                </label>

                <p className="mt-1 text-xs text-slate-500">
                  {field.description}
                </p>

                <textarea
                  id={field.key}
                  value={values[field.key]}
                  onChange={(event) =>
                    updateValue(
                      field.key,
                      event.target.value
                    )
                  }
                  rows={field.rows}
                  disabled={saving}
                  className="mt-3 w-full rounded-xl border border-slate-800 bg-slate-950 p-4 text-white outline-none focus:border-cyan-400"
                />
              </div>
            )
          )}
        </div>
      </section>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : "Save Settings"}
        </button>

        {status && (
          <p className="text-sm text-cyan-400">
            {status}
          </p>
        )}
      </div>
    </div>
  );
}