import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = String(body.email || "")
      .trim()
      .toLowerCase();

    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required.",
        },
        {
          status: 400,
        }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        password: true,
        emailVerified: true,
        isTwoFactorEnabled: true,
      },
    });

    /*
     * Do not reveal whether an email exists when the
     * password is incorrect.
     */
    if (!user || !user.password) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        {
          status: 401,
        }
      );
    }

    const validPassword = await verifyPassword(
      password,
      user.password
    );

    if (!validPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        {
          status: 401,
        }
      );
    }

    /*
     * Existing accounts that have not verified their
     * email must verify it before they can sign in.
     */
    if (!user.emailVerified) {
      return NextResponse.json({
        success: true,
        emailVerified: false,
        requiresVerification: true,
        email: user.email,
      });
    }

    /*
     * If 2FA is enabled, the login page must request
     * the authenticator code before creating the
     * NextAuth session.
     *
     * Every login requires a fresh 2FA code.
     */
    if (user.isTwoFactorEnabled) {
      return NextResponse.json({
        success: true,
        emailVerified: true,
        requiresTwoFactor: true,
        email: user.email,
      });
    }

    /*
     * No 2FA is enabled.
     *
     * The login page can proceed with normal
     * NextAuth credential authentication.
     */
    return NextResponse.json({
      success: true,
      emailVerified: true,
      requiresTwoFactor: false,
      email: user.email,
    });
  } catch (error) {
    console.error("LOGIN CHECK ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to check your login information.",
      },
      {
        status: 500,
      }
    );
  }
}
