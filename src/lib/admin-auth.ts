import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      session: null,
      response: NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        {
          status: 401,
        }
      ),
    };
  }

  if (session.user.role !== "ADMIN") {
    return {
      session: null,
      response: NextResponse.json(
        {
          success: false,
          message: "Forbidden.",
        },
        {
          status: 403,
        }
      ),
    };
  }

  return {
    session,
    response: null,
  };
}