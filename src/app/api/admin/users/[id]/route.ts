import { NextRequest, NextResponse } from "next/server";
import { UserRole, UserStatus } from "@prisma/client";

import { requireAdmin } from "@/lib/admin-auth";
import prisma from "@/lib/prisma";
import { auditService } from "@/server/services/audit.service";

export async function PATCH(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { response } = await requireAdmin();

    if (response) {
      return response;
    }

    const { id } = await params;

    const body = await request.json();

    const {
      action,
      role,
      status,
      firstName,
      lastName,
      withdrawalsEnabled,
      manualFundsWithdrawable,
      withdrawalRestrictionMessage,
  manualFundsRestrictionMessage,
    } = body;

    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        firstName: true,
        lastName: true,
        isTwoFactorEnabled: true,
        twoFactorSecret: true,
        withdrawalsEnabled: true,
        manualFundsWithdrawable: true,
        withdrawalRestrictionMessage: true,
    manualFundsRestrictionMessage: true,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * ADMIN 2FA RECOVERY
     *
     * This allows an authorized administrator to reset
     * a user's 2FA when the user cannot complete their
     * authenticator verification.
     *
     * The user's password is NOT changed.
     */
    if (action === "RESET_2FA") {
      if (
        !existingUser.isTwoFactorEnabled &&
        !existingUser.twoFactorSecret
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Two-factor authentication is already disabled for this user.",
          },
          {
            status: 400,
          }
        );
      }

      const updatedUser = await prisma.user.update({
        where: {
          id,
        },
        data: {
          isTwoFactorEnabled: false,
          twoFactorSecret: null,
        },
        select: {
          id: true,
          email: true,
          isTwoFactorEnabled: true,
        },
      });

      await auditService.create({
        action: "ADMIN_RESET_USER_2FA",
        entity: "User",
        entityId: updatedUser.id,
        metadata:
          `Administrator reset two-factor authentication for ${updatedUser.email}.`,
      });

      if (
  manualFundsRestrictionMessage !== undefined &&
  manualFundsRestrictionMessage !==
    existingUser.manualFundsRestrictionMessage
) {
  await auditService.create({
    action: "USER_MANUAL_FUNDS_MESSAGE_CHANGED",
    entity: "User",
    entityId: updatedUser.id,
    metadata:
      `Manual funds restriction message updated for ${updatedUser.email}.`,
  });
}

return NextResponse.json({
        success: true,
        message:
          "Two-factor authentication has been reset. The user can now sign in with their password.",
        user: updatedUser,
      });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id,
      },

      data: {
        ...(role
          ? {
              role: role as UserRole,
            }
          : {}),

        ...(status
          ? {
              status: status as UserStatus,
            }
          : {}),

        ...(firstName !== undefined
          ? {
              firstName,
            }
          : {}),

        ...(lastName !== undefined
          ? {
              lastName,
            }
          : {}),

        ...(withdrawalsEnabled !== undefined
          ? {
              withdrawalsEnabled:
                Boolean(withdrawalsEnabled),
            }
          : {}),

        ...(manualFundsWithdrawable !== undefined
          ? {
              manualFundsWithdrawable:
                Boolean(manualFundsWithdrawable),
            }
          : {}),

        ...(manualFundsRestrictionMessage !== undefined
      ? {
          manualFundsRestrictionMessage:
            manualFundsRestrictionMessage === null
              ? null
              : String(
                  manualFundsRestrictionMessage
                ).trim() || null,
        }
      : {}),

    ...(withdrawalRestrictionMessage !== undefined
          ? {
              withdrawalRestrictionMessage:
                withdrawalRestrictionMessage === null
                  ? null
                  : String(
                      withdrawalRestrictionMessage
                    ).trim() || null,
            }
          : {}),
      },
    });

    if (
      role &&
      role !== existingUser.role
    ) {
      await auditService.create({
        action: "USER_ROLE_CHANGED",
        entity: "User",
        entityId: updatedUser.id,
        metadata:
          `Role changed from ${existingUser.role} to ${updatedUser.role} for ${updatedUser.email}`,
      });
    }

    if (
      status &&
      status !== existingUser.status
    ) {
      await auditService.create({
        action: "USER_STATUS_CHANGED",
        entity: "User",
        entityId: updatedUser.id,
        metadata:
          `Status changed from ${existingUser.status} to ${updatedUser.status} for ${updatedUser.email}`,
      });
    }

    if (
      firstName !== undefined ||
      lastName !== undefined
    ) {
      await auditService.create({
        action: "USER_UPDATED",
        entity: "User",
        entityId: updatedUser.id,
        metadata:
          `Profile updated for ${updatedUser.email}`,
      });
    }

    if (
      withdrawalsEnabled !== undefined &&
      Boolean(withdrawalsEnabled) !==
        existingUser.withdrawalsEnabled
    ) {
      await auditService.create({
        action: "USER_WITHDRAWAL_ACCESS_CHANGED",
        entity: "User",
        entityId: updatedUser.id,
        metadata:
          `Withdrawal access changed from ${existingUser.withdrawalsEnabled ? "enabled" : "disabled"} to ${updatedUser.withdrawalsEnabled ? "enabled" : "disabled"} for ${updatedUser.email}.`,
      });
    }

    if (
      manualFundsWithdrawable !== undefined &&
      Boolean(manualFundsWithdrawable) !==
        existingUser.manualFundsWithdrawable
    ) {
      await auditService.create({
        action: "USER_MANUAL_FUNDS_ACCESS_CHANGED",
        entity: "User",
        entityId: updatedUser.id,
        metadata:
          `Manual funds withdrawal access changed from ${existingUser.manualFundsWithdrawable ? "enabled" : "disabled"} to ${updatedUser.manualFundsWithdrawable ? "enabled" : "disabled"} for ${updatedUser.email}.`,
      });
    }

    if (
      withdrawalRestrictionMessage !== undefined &&
      withdrawalRestrictionMessage !==
        existingUser.withdrawalRestrictionMessage
    ) {
      await auditService.create({
        action: "USER_WITHDRAWAL_MESSAGE_CHANGED",
        entity: "User",
        entityId: updatedUser.id,
        metadata:
          `Withdrawal restriction message updated for ${updatedUser.email}.`,
      });
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error(
      "ADMIN USER UPDATE ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Internal server error.",
      },
      {
        status: 500,
      }
    );
  }
}
