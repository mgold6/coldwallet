import prisma from "@/lib/prisma";

import { resend, RESEND_FROM_EMAIL } from "@/lib/resend";
import { notificationService } from "@/server/services/notification.service";

const DEFAULT_TITLE = "Deposit Received";

const DEFAULT_MESSAGE =
  "Your wallet received a deposit of {{usdAmount}}.";

const DEFAULT_EMAIL_SUBJECT =
  "Deposit Received";

const DEFAULT_EMAIL_MESSAGE = `Hello {{firstName}},

Your wallet received a deposit of {{usdAmount}}.

Your deposit has been credited to your account.

ColdWallet`;

const TEMPLATE_KEYS = {
  title: "deposit_notification_title",
  message: "deposit_notification_message",
  emailSubject: "deposit_email_subject",
  emailMessage: "deposit_email_message",
} as const;

interface DepositNotificationData {
  userId: string;
  usdAmount: number | string;
  cryptoAmount: number | string;
  currency: string;
  reference: string;
  walletAddress: string;
  date: Date;
}

interface DepositNotificationOptions {
  sendInApp?: boolean;
  sendEmail?: boolean;
}

function replaceVariables(
  template: string,
  data: DepositNotificationData,
  firstName: string
): string {
  const values: Record<string, string> = {
    firstName,
    amount: String(data.cryptoAmount),
    usdAmount: Number(data.usdAmount).toLocaleString(
      undefined,
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    ),
    currency: data.currency,
    reference: data.reference,
    walletAddress: data.walletAddress,
    date: new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(data.date),
  };

  return template.replace(
    /\{\{\s*([a-zA-Z]+)\s*\}\}/g,
    (match, key: string) =>
      values[key] ?? match
  );
}

async function getSetting(
  key: string,
  fallback: string
): Promise<string> {
  const setting =
    await prisma.systemSetting.findUnique({
      where: {
        key,
      },
      select: {
        value: true,
      },
    });

  return setting?.value?.trim() || fallback;
}

export class DepositNotificationService {
  async send(
    data: DepositNotificationData,
    options: DepositNotificationOptions = {}
  ) {
    const {
      sendInApp = true,
      sendEmail = true,
    } = options;

    if (!sendInApp && !sendEmail) {
      return;
    }

    const user =
      await prisma.user.findUnique({
        where: {
          id: data.userId,
        },
        select: {
          firstName: true,
          email: true,
        },
      });

    if (!user) {
      return;
    }

    const [
      titleTemplate,
      messageTemplate,
      emailSubjectTemplate,
      emailMessageTemplate,
    ] = await Promise.all([
      getSetting(
        TEMPLATE_KEYS.title,
        DEFAULT_TITLE
      ),
      getSetting(
        TEMPLATE_KEYS.message,
        DEFAULT_MESSAGE
      ),
      getSetting(
        TEMPLATE_KEYS.emailSubject,
        DEFAULT_EMAIL_SUBJECT
      ),
      getSetting(
        TEMPLATE_KEYS.emailMessage,
        DEFAULT_EMAIL_MESSAGE
      ),
    ]);

    const firstName =
      user.firstName?.trim() || "there";

    if (sendInApp) {
      const title = replaceVariables(
        titleTemplate,
        data,
        firstName
      );

      const message = replaceVariables(
        messageTemplate,
        data,
        firstName
      );

      await notificationService.create({
        userId: data.userId,
        type: "SUCCESS",
        title,
        message,
      });
    }

    if (sendEmail && user.email) {
      const emailSubject =
        replaceVariables(
          emailSubjectTemplate,
          data,
          firstName
        );

      const emailMessage =
        replaceVariables(
          emailMessageTemplate,
          data,
          firstName
        );

      try {
        const result = await resend.emails.send({
          from: RESEND_FROM_EMAIL,
          to: user.email,
          subject: emailSubject,
          text: emailMessage,
          html: emailMessage
            .split("\n")
            .map(
              (line) =>
                line.trim()
                  ? `<p>${line}</p>`
                  : "<br />"
            )
            .join(""),
        });

        if (result.error) {
          console.error(
            "DEPOSIT NOTIFICATION EMAIL ERROR:",
            result.error
          );
        } else {
          console.log(
            "DEPOSIT NOTIFICATION EMAIL SENT:",
            result.data
          );
        }
      } catch (error) {
        console.error(
          "DEPOSIT NOTIFICATION EMAIL EXCEPTION:",
          error
        );
      }
    }
  }
}

export const depositNotificationService =
  new DepositNotificationService();
