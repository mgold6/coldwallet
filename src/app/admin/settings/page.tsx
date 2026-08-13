import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

import SettingsForm from "./SettingsForm";

const SETTING_KEYS = [
  "message_withdrawals_enabled",
  "message_withdrawals_disabled",
  "message_withdrawal_locked",
  "withdrawal_insufficient_balance",
  "manual_funds_withdrawable",
  "message_manual_funds_not_withdrawable",
  "message_withdrawal_declined",

  "deposit_notification_title",
  "deposit_notification_message",
  "deposit_email_subject",
  "deposit_email_message",
] as const;

const DEFAULTS: Record<
  (typeof SETTING_KEYS)[number],
  string
> = {
  message_withdrawals_enabled:
    "Withdrawals are currently available.",

  message_withdrawals_disabled:
    "Withdrawals are currently unavailable. Please contact support.",

  message_withdrawal_locked:
    "Your balance is currently locked and cannot be withdrawn at this time. Please contact support.",

  withdrawal_insufficient_balance:
    "Your withdrawal request cannot be completed at this time. Please contact support.",

  manual_funds_withdrawable:
    "false",

  message_manual_funds_not_withdrawable:
    "This balance is currently unavailable for withdrawal. Please contact support.",

  message_withdrawal_declined:
    "Your withdrawal request has been declined. Please contact support.",

  deposit_notification_title:
    "Deposit Received",

  deposit_notification_message:
    "Your wallet received a deposit of \${{usdAmount}}.",

  deposit_email_subject:
    "Deposit Received",

  deposit_email_message:
    `Hello {{firstName}},

Your wallet received a deposit of \${{usdAmount}}.

Your deposit has been credited to your account.

ColdWallet`,
};

export default async function AdminSettingsPage() {
  const session =
    await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const settings =
    await prisma.systemSetting.findMany({
      where: {
        key: {
          in: [...SETTING_KEYS],
        },
      },
    });

  const values = Object.fromEntries(
    SETTING_KEYS.map((key) => [
      key,
      settings.find(
        (setting) =>
          setting.key === key
      )?.value ?? DEFAULTS[key],
    ])
  ) as Record<
    (typeof SETTING_KEYS)[number],
    string
  >;

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-white">
          Admin Settings
        </h1>

        <p className="mt-2 text-slate-400">
          Manage application notifications,
          withdrawal messages, and
          manual/internal fund settings.
        </p>
      </section>

      <SettingsForm settings={values} />
    </div>
  );
}