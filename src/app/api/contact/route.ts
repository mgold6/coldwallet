import { NextResponse } from "next/server";

import {
  resend,
  RESEND_FROM_EMAIL,
} from "@/lib/resend";

const SUPPORT_EMAIL =
  "customerservice@coldwallet.ink";

export async function POST(
  request: Request
) {
  try {
    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const subject =
      typeof body.subject === "string"
        ? body.subject.trim()
        : "";

    const message =
      typeof body.message === "string"
        ? body.message.trim()
        : "";

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please complete all fields.",
        },
        { status: 400 }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Name is too long.",
        },
        { status: 400 }
      );
    }

    if (email.length > 254) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Email address is too long.",
        },
        { status: 400 }
      );
    }

    if (subject.length > 200) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Subject is too long.",
        },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Message is too long.",
        },
        { status: 400 }
      );
    }

    const emailIsValid =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
      );

    if (!emailIsValid) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    const { error } =
      await resend.emails.send({
        from: RESEND_FROM_EMAIL,
        to: [SUPPORT_EMAIL],
        replyTo: email,
        subject: `Contact Form: ${subject}`,
        text: [
          "ColdWallet Contact Form",
          "",
          `Name: ${name}`,
          `Email: ${email}`,
          `Subject: ${subject}`,
          "",
          "Message:",
          message,
        ].join("\n"),
      });

    if (error) {
      console.error(
        "CONTACT FORM EMAIL ERROR:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to send your message right now. Please try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Your message has been sent successfully.",
    });
  } catch (error) {
    console.error(
      "CONTACT FORM ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to send your message right now. Please try again.",
      },
      { status: 500 }
    );
  }
}
