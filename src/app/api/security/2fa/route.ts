import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import {
  generateSecret,
  generateURI,
  verify,
} from "otplib";
import QRCode from "qrcode";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * GET
 *
 * Returns the current 2FA status directly from Prisma.
 */
export async function GET() {
  try {
    const session =
      await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const userId =
      session.user.id;

    if (!userId) {
      return NextResponse.json(
        {
          error:
            "Unable to identify the account.",
        },
        {
          status: 400,
        }
      );
    }

    const user =
      await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          isTwoFactorEnabled: true,
        },
      });

    if (!user) {
      return NextResponse.json(
        {
          error:
            "User account not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      enabled:
        user.isTwoFactorEnabled,
    });
  } catch (error) {
    console.error(
      "2FA STATUS ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to load two-factor authentication status.",
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * POST
 *
 * Handles:
 * - setup
 * - verify
 * - disable
 */
export async function POST(
  request: Request
) {
  try {
    const session =
      await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const userId =
      session.user.id;

    if (!userId) {
      return NextResponse.json(
        {
          error:
            "Unable to identify the account.",
        },
        {
          status: 400,
        }
      );
    }

    const body =
      await request.json();

    const action = body.action;

    const user =
      await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          email: true,
          isTwoFactorEnabled: true,
          twoFactorSecret: true,
        },
      });

    if (!user) {
      return NextResponse.json(
        {
          error:
            "User account not found.",
        },
        {
          status: 404,
        }
      );
    }

    /**
     * START 2FA SETUP
     */
    if (action === "setup") {
      if (user.isTwoFactorEnabled) {
        return NextResponse.json(
          {
            error:
              "Two-factor authentication is already enabled.",
          },
          {
            status: 400,
          }
        );
      }

      const secret =
        generateSecret();

      const otpauthUrl =
        generateURI({
          issuer: "ColdWallet",
          label: user.email,
          secret,
        });

      const qrCode =
        await QRCode.toDataURL(
          otpauthUrl
        );

      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          twoFactorSecret: secret,
        },
      });

      return NextResponse.json({
        success: true,
        qrCode,
        secret,
      });
    }

    /**
     * VERIFY 2FA SETUP
     */
    if (action === "verify") {
      const code = String(
        body.code || ""
      ).trim();

      if (!/^\d{6}$/.test(code)) {
        return NextResponse.json(
          {
            error:
              "Enter a valid 6-digit verification code.",
          },
          {
            status: 400,
          }
        );
      }

      if (!user.twoFactorSecret) {
        return NextResponse.json(
          {
            error:
              "Two-factor setup has not been started.",
          },
          {
            status: 400,
          }
        );
      }

      const result =
        await verify({
          secret:
            user.twoFactorSecret,
          token: code,
        });

      if (!result.valid) {
        return NextResponse.json(
          {
            error:
              "Invalid verification code.",
          },
          {
            status: 400,
          }
        );
      }

      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          isTwoFactorEnabled: true,
        },
      });

      return NextResponse.json({
        success: true,
        enabled: true,
      });
    }

    /**
     * DISABLE 2FA
     */
    if (action === "disable") {
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          isTwoFactorEnabled: false,
          twoFactorSecret: null,
        },
      });

      return NextResponse.json({
        success: true,
        enabled: false,
      });
    }

    return NextResponse.json(
      {
        error:
          "Invalid 2FA action.",
      },
      {
        status: 400,
      }
    );
  } catch (error) {
    console.error(
      "2FA ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to process two-factor authentication.",
      },
      {
        status: 500,
      }
    );
  }
}