import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const email =
      body.email;

    if (
      !email ||
      !email.includes("@")
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid email address",
        },
        {
          status: 400,
        }
      );
    }

    const subscriber =
      await prisma.subscriber.upsert({
        where: {
          email,
        },

        update: {},

        create: {
          email,
        },
      });

    return NextResponse.json({
      success: true,
      subscriber,
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "Unable to subscribe",
      },
      {
        status: 500,
      }
    );
  }
}