import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = String(body.email || "").trim().toLowerCase();
    const code = String(body.code || "").trim();

    if (!email || !code) {
      return NextResponse.json(
        { success: false, message: "Email address and verification code are required." },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { success: false, message: "Enter a valid 6-digit verification code." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        emailVerified: true,
        role: true,
        isTwoFactorEnabled: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Account not found." },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json({
        success: true,
        message: "Your email address is already verified.",
        alreadyVerified: true,
      });
    }

    const verification = await prisma.verificationCode.findFirst({
      where: { userId: user.id, email, code, used: false },
      orderBy: { createdAt: "desc" },
    });

    if (!verification) {
      return NextResponse.json(
        { success: false, message: "Invalid verification code." },
        { status: 400 }
      );
    }

    if (verification.expiresAt.getTime() < Date.now()) {
      await prisma.verificationCode.update({
        where: { id: verification.id },
        data: { used: true },
      });

      return NextResponse.json(
        {
          success: false,
          message: "This verification code has expired. Please request a new code.",
        },
        { status: 400 }
      );
    }

    const loginToken = randomBytes(32).toString("hex");
    const loginTokenExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      }),
      prisma.verificationCode.update({
        where: { id: verification.id },
        data: { used: true },
      }),
      prisma.verificationCode.updateMany({
        where: {
          userId: user.id,
          email,
          used: false,
          id: { not: verification.id },
        },
        data: { used: true },
      }),
      prisma.verificationCode.create({
        data: {
          userId: user.id,
          email,
          code: loginToken,
          expiresAt: loginTokenExpiresAt,
          used: false,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      verified: true,
      message: "Email verified successfully.",
      loginToken,
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
        role: user.role,
        isTwoFactorEnabled: user.isTwoFactorEnabled,
      },
    });
  } catch (error) {
    console.error("EMAIL VERIFICATION ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to verify your email address.",
      },
      { status: 500 }
    );
  }
}