import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomInt } from "crypto";

import prisma from "@/lib/prisma";
import { resend, RESEND_FROM_EMAIL } from "@/lib/resend";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    } = body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Passwords do not match." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();

    if (!cleanFirstName || !cleanLastName) {
      return NextResponse.json(
        { success: false, message: "First name and last name are required." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        email: true,
        emailVerified: true,
      },
    });

    if (existingUser) {
      if (!existingUser.emailVerified) {
        return NextResponse.json(
          {
            success: false,
            message:
              "An account with this email address already exists but has not been verified. Please verify your email address to continue.",
            requiresVerification: true,
            email: normalizedEmail,
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message:
            "An account with this email address already exists. Please log in instead.",
        },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        firstName: cleanFirstName,
        lastName: cleanLastName,
        name: `${cleanFirstName} ${cleanLastName}`,
        email: normalizedEmail,
        password: hashedPassword,
        status: "ACTIVE",
      },
    });

    await prisma.portfolio.create({
      data: {
        userId: user.id,
        name: "Main Portfolio",
        isDefault: true,
        isActive: true,
      },
    });

    await prisma.portfolio.createMany({
      data: [
        {
          userId: user.id,
          name: "Investment Portfolio",
          isDefault: false,
          isActive: true,
        },
        {
          userId: user.id,
          name: "Trading Portfolio",
          isDefault: false,
          isActive: true,
        },
      ],
    });

    await prisma.verificationCode.deleteMany({
      where: {
        email: normalizedEmail,
        used: false,
      },
    });

    const code = randomInt(100000, 1000000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.verificationCode.create({
      data: {
        userId: user.id,
        email: normalizedEmail,
        code,
        expiresAt,
      },
    });

    const { error: emailError } = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: [normalizedEmail],
      subject: "Your ColdWallet verification code",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Your ColdWallet verification code</title>
          </head>
          <body style="margin:0;padding:0;background-color:#020617;font-family:Arial,Helvetica,sans-serif;color:#ffffff;">
            <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
              <div style="background-color:#0f172a;border:1px solid #1e293b;border-radius:16px;padding:40px;">
                <div style="margin-bottom:28px;color:#22d3ee;font-size:20px;font-weight:bold;">
                  ColdWallet
                </div>

                <h1 style="margin:0 0 24px;color:#ffffff;font-size:28px;line-height:1.3;">
                  Your ColdWallet verification code
                </h1>

                <p style="margin:0 0 20px;color:#cbd5e1;font-size:16px;line-height:1.6;">
                  Hi ${cleanFirstName},
                </p>

                <p style="margin:0 0 24px;color:#cbd5e1;font-size:16px;line-height:1.6;">
                  You're receiving this email because a ColdWallet account was created using this email address.
                </p>

                <p style="margin:0 0 12px;color:#cbd5e1;font-size:16px;line-height:1.6;">
                  Your ColdWallet verification code is:
                </p>

                <div style="margin:20px 0 28px;padding:22px;background-color:#020617;border:1px solid #164e63;border-radius:12px;text-align:center;">
                  <div style="margin-bottom:8px;color:#67e8f9;font-size:11px;font-weight:bold;letter-spacing:2px;">
                    VERIFICATION CODE
                  </div>
                  <div style="color:#22d3ee;font-size:36px;font-weight:bold;letter-spacing:8px;">
                    ${code}
                  </div>
                </div>

                <p style="margin:0 0 20px;color:#cbd5e1;font-size:16px;line-height:1.6;">
                  Enter this code on the ColdWallet verification page to confirm your email address.
                </p>

                <p style="margin:0 0 24px;color:#94a3b8;font-size:14px;line-height:1.6;">
                  This code expires in 10 minutes.
                </p>

                <div style="margin:24px 0;padding:18px;background-color:#111827;border-left:3px solid #22d3ee;">
                  <p style="margin:0 0 8px;color:#ffffff;font-size:14px;font-weight:bold;">
                    Security notice:
                  </p>
                  <p style="margin:0;color:#94a3b8;font-size:14px;line-height:1.6;">
                    ColdWallet will never ask you to share your password, private keys, recovery phrase, or verification code.
                  </p>
                </div>

                <p style="margin:24px 0;color:#64748b;font-size:13px;line-height:1.6;">
                  If you did not create a ColdWallet account, you can safely ignore this email.
                </p>

                <p style="margin:32px 0 0;color:#ffffff;font-size:15px;font-weight:bold;">
                  ColdWallet
                </p>
                <p style="margin:4px 0 0;color:#64748b;font-size:13px;">
                  Secure Digital Asset Platform
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (emailError) {
      console.error("RESEND EMAIL ERROR:", emailError);

      return NextResponse.json(
        {
          success: false,
          message:
            "Your account was created, but we could not send the verification email. Please request a new verification code.",
          requiresVerification: true,
          email: normalizedEmail,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Account created successfully. A verification code has been sent to your email.",
        requiresVerification: true,
        email: normalizedEmail,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Registration failed.",
      },
      { status: 500 }
    );
  }
}