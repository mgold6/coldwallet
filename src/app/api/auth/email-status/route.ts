import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = String(body.email || "")
      .trim()
      .toLowerCase();

    if (!email) {
      return NextResponse.json(
        {
          exists: false,
          emailVerified: false,
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
        emailVerified: true,
      },
    });

    if (!user) {
      return NextResponse.json({
        exists: false,
        emailVerified: false,
      });
    }

    return NextResponse.json({
      exists: true,
      emailVerified: Boolean(
        user.emailVerified
      ),
    });
  } catch (error) {
    console.error(
      "EMAIL STATUS ERROR:",
      error
    );

    return NextResponse.json(
      {
        exists: false,
        emailVerified: false,
      },
      {
        status: 500,
      }
    );
  }
}
