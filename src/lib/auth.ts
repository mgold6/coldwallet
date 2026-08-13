import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verify } from "otplib";

import prisma from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import {
  resend,
  RESEND_FROM_EMAIL,
} from "@/lib/resend";

function getClientIp(
  headers?: Record<string, string | string[] | undefined>
): string {
  if (!headers) {
    return "unknown";
  }

  const forwardedFor =
    headers["x-forwarded-for"];

  if (forwardedFor) {
    const value = Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : forwardedFor;

    const firstIp = value
      .split(",")[0]
      ?.trim();

    if (firstIp) {
      return firstIp;
    }
  }

  const realIp =
    headers["x-real-ip"];

  if (realIp) {
    const value = Array.isArray(realIp)
      ? realIp[0]
      : realIp;

    if (value?.trim()) {
      return value.trim();
    }
  }

  const clientIp =
    headers["cf-connecting-ip"];

  if (clientIp) {
    const value = Array.isArray(clientIp)
      ? clientIp[0]
      : clientIp;

    if (value?.trim()) {
      return value.trim();
    }
  }

  return "unknown";
}

function getUserAgent(
  headers?: Record<string, string | string[] | undefined>
): string {
  if (!headers) {
    return "unknown";
  }

  const userAgent =
    headers["user-agent"];

  if (!userAgent) {
    return "unknown";
  }

  const value = Array.isArray(userAgent)
    ? userAgent[0]
    : userAgent;

  return value?.trim() || "unknown";
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },

        remember: {
          label: "Remember Me",
          type: "text",
        },

        twoFactorCode: {
          label: "2FA Code",
          type: "text",
        },
      },

      async authorize(credentials, req) {
        if (
          !credentials?.email ||
          !credentials?.password
        ) {
          return null;
        }

        const email =
          credentials.email
            .toLowerCase()
            .trim();

        const user =
          await prisma.user.findUnique({
            where: {
              email,
            },
          });

        if (!user) {
          return null;
        }

        if (!user.password) {
          throw new Error(
            "This account does not have a password."
          );
        }

        const validPassword =
          await verifyPassword(
            credentials.password,
            user.password
          );

        if (!validPassword) {
          return null;
        }

        /*
         * Email verification is required
         * before login.
         */
        if (!user.emailVerified) {
          throw new Error(
            "EMAIL_NOT_VERIFIED"
          );
        }

        /*
         * If 2FA is enabled, a valid
         * authenticator code is required.
         */
        if (user.isTwoFactorEnabled) {
          const twoFactorCode =
            String(
              credentials.twoFactorCode || ""
            ).trim();

          if (
            !/^\d{6}$/.test(
              twoFactorCode
            )
          ) {
            throw new Error(
              "TWO_FACTOR_REQUIRED"
            );
          }

          if (!user.twoFactorSecret) {
            throw new Error(
              "Two-factor authentication is enabled, but the authenticator setup is incomplete."
            );
          }

          const result =
            await verify({
              secret:
                user.twoFactorSecret,
              token: twoFactorCode,
            });

          if (!result.valid) {
            throw new Error(
              "INVALID_TWO_FACTOR_CODE"
            );
          }
        }

        /*
         * Capture the connection information
         * only after password, email verification,
         * and 2FA have all succeeded.
         *
         * The raw IP and user-agent are stored in
         * LoginHistory for administrative/security
         * purposes.
         */
        const ipAddress =
          getClientIp(req.headers);

        const userAgent =
          getUserAgent(req.headers);

        try {
          await prisma.loginHistory.create({
            data: {
              userId: user.id,
              ipAddress,
              userAgent,
              success: true,
            },
          });
        } catch (error) {
          /*
           * Login-history failure should not prevent
           * an otherwise valid user from signing in.
           */
          console.error(
            "LOGIN HISTORY RECORDING ERROR:",
            error
          );
        }

        return {
          id: user.id,
          email: user.email,
          name:
            `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
          role: user.role,
          isTwoFactorEnabled:
            user.isTwoFactorEnabled,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({
      token,
      user,
    }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isTwoFactorEnabled =
          user.isTwoFactorEnabled;
      }

      return token;
    },

    async session({
      session,
      token,
    }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role =
          token.role;
        session.user.isTwoFactorEnabled =
          token.isTwoFactorEnabled;
      }

      return session;
    },
  },

  events: {
    async signIn({ user }) {
      if (!user.id || !user.email) {
        return;
      }

      /*
       * Send a security notification after
       * successful authentication.
       *
       * LoginHistory is already recorded inside
       * authorize(), so we do NOT create another
       * LoginHistory record here.
       */
      try {
        await resend.emails.send({
          from: RESEND_FROM_EMAIL,
          to: user.email,
          subject:
            "Successful ColdWallet Login",
          html: `
            <div
              style="
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #111827;
                max-width: 600px;
                margin: 0 auto;
                padding: 24px;
              "
            >
              <h2 style="color: #111827;">
                Successful login to your ColdWallet account
              </h2>

              <p>
                Hello ${user.name || "there"},
              </p>

              <p>
                Your ColdWallet account was successfully
                signed in.
              </p>

              <p>
                If this was you, no action is required.
              </p>

              <p>
                If you did not authorize this login,
                please secure your account immediately
                by changing your password and reviewing
                your security settings.
              </p>

              <p
                style="
                  margin-top: 24px;
                  color: #6b7280;
                  font-size: 13px;
                "
              >
                ColdWallet Security
              </p>
            </div>
          `,
        });
      } catch (error) {
        /*
         * Email delivery failure should not
         * invalidate a successful login.
         */
        console.error(
          "SUCCESSFUL LOGIN SECURITY EMAIL ERROR:",
          error
        );
      }
    },
  },
};