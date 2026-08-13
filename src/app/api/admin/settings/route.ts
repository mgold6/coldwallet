import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin-auth";

import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { response } = await requireAdmin();

    if (response) {
      return response;
    }

    const body = await request.json();

    const {
      key,
      value,
      description,
    } = body;

    if (!key || !value) {
      return NextResponse.json(
        {
          error: "Key and value are required.",
        },
        {
          status: 400,
        }
      );
    }

    const setting =
      await prisma.systemSetting.upsert({
        where: {
          key,
        },

        update: {
          value,
          description,
        },

        create: {
          key,
          value,
          description,
        },
      });

    return NextResponse.json(
      {
        success: true,
        setting,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to save settings.",
      },
      {
        status: 500,
      }
    );
  }
}