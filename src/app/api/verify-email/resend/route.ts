import { NextResponse } from "next/server";
import { randomInt } from "crypto";

import prisma from "@/lib/prisma";
import { resend, RESEND_FROM_EMAIL } from "@/lib/resend";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = String(body.email || "")
      .trim()
      .toLowerCase();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email address is required.",
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
        emailVerified: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Account not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        {
          success: false,
          message: "This email address is already verified.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Invalidate any previous unused verification codes.
     */
    await prisma.verificationCode.updateMany({
      where: {
        userId: user.id,
        email,
        used: false,
      },
      data: {
        used: true,
      },
    });

    /*
     * Generate a new six-digit verification code.
     */
    const code = randomInt(100000, 1000000).toString();

    /*
     * Code remains valid for 10 minutes.
     */
    const expiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    await prisma.verificationCode.create({
      data: {
        userId: user.id,
        email,
        code,
        expiresAt,
      },
    });

    const firstName = user.firstName?.trim() || "there";

    /*
     * Send verification email through Resend.
     */
    const { error: emailError } =
      await resend.emails.send({
        from: RESEND_FROM_EMAIL,
        to: [email],
        subject: "Your ColdWallet verification code",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8" />
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
              />
              <title>Your ColdWallet verification code</title>
            </head>

            <body
              style="
                margin: 0;
                padding: 0;
                background-color: #020617;
                font-family: Arial, Helvetica, sans-serif;
                color: #ffffff;
              "
            >
              <div
                style="
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 40px 20px;
                "
              >
                <div
                  style="
                    background-color: #0f172a;
                    border: 1px solid #1e293b;
                    border-radius: 16px;
                    padding: 40px;
                  "
                >
                  <h1
                    style="
                      margin: 0 0 24px;
                      color: #ffffff;
                      font-size: 28px;
                    "
                  >
                    Your ColdWallet verification code
                  </h1>

                  <p
                    style="
                      margin: 0 0 20px;
                      color: #cbd5e1;
                      font-size: 16px;
                      line-height: 1.6;
                    "
                  >
                    Hi ${firstName},
                  </p>

                  <p
                    style="
                      margin: 0 0 24px;
                      color: #cbd5e1;
                      font-size: 16px;
                      line-height: 1.6;
                    "
                  >
                    You're receiving this email because a
                    ColdWallet account was created using this
                    email address.
                  </p>

                  <p
                    style="
                      margin: 0 0 12px;
                      color: #cbd5e1;
                      font-size: 16px;
                      line-height: 1.6;
                    "
                  >
                    Your ColdWallet verification code is:
                  </p>

                  <div
                    style="
                      margin: 20px 0 28px;
                      padding: 22px;
                      background-color: #020617;
                      border: 1px solid #164e63;
                      border-radius: 12px;
                      text-align: center;
                    "
                  >
                    <div
                      style="
                        color: #22d3ee;
                        font-size: 36px;
                        font-weight: bold;
                        letter-spacing: 8px;
                      "
                    >
                      ${code}
                    </div>
                  </div>

                  <p
                    style="
                      margin: 0 0 20px;
                      color: #cbd5e1;
                      font-size: 16px;
                      line-height: 1.6;
                    "
                  >
                    Enter this code on the ColdWallet
                    verification page to confirm your email
                    address.
                  </p>

                  <p
                    style="
                      margin: 0 0 24px;
                      color: #94a3b8;
                      font-size: 14px;
                      line-height: 1.6;
                    "
                  >
                    This code expires in 10 minutes.
                  </p>

                  <div
                    style="
                      margin: 24px 0;
                      padding: 18px;
                      background-color: #111827;
                      border-left: 3px solid #22d3ee;
                    "
                  >
                    <p
                      style="
                        margin: 0 0 8px;
                        color: #ffffff;
                        font-size: 14px;
                        font-weight: bold;
                      "
                    >
                      Security notice:
                    </p>

                    <p
                      style="
                        margin: 0;
                        color: #94a3b8;
                        font-size: 14px;
                        line-height: 1.6;
                      "
                    >
                      ColdWallet will never ask you to share
                      your password, private keys, recovery
                      phrase, or verification code.
                    </p>
                  </div>

                  <p
                    style="
                      margin: 24px 0;
                      color: #64748b;
                      font-size: 13px;
                      line-height: 1.6;
                    "
                  >
                    If you did not create a ColdWallet
                    account, you can safely ignore this email.
                  </p>

                  <p
                    style="
                      margin: 32px 0 0;
                      color: #ffffff;
                      font-size: 15px;
                      font-weight: bold;
                    "
                  >
                    ColdWallet
                  </p>

                  <p
                    style="
                      margin: 4px 0 0;
                      color: #64748b;
                      font-size: 13px;
                    "
                  >
                    Secure Digital Asset Platform
                  </p>
                </div>
              </div>
            </body>
          </html>
        `,
      });

    if (emailError) {
      console.error(
        "RESEND VERIFICATION ERROR:",
        emailError
      );

      /*
       * Invalidate the code if Resend failed so it
       * cannot be used accidentally.
       */
      await prisma.verificationCode.updateMany({
        where: {
          userId: user.id,
          email,
          code,
          used: false,
        },
        data: {
          used: true,
        },
      });

      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to send the verification email. Please try again.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "A new verification code has been sent to your email.",
    });
  } catch (error) {
    console.error(
      "RESEND VERIFICATION ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to resend the verification code.",
      },
      {
        status: 500,
      }
    );
  }
}