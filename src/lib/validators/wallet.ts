import { z } from "zod";

export const assignWalletSchema = z.object({
  portfolioId: z.string().min(1, "Portfolio is required"),

  currencyId: z.string().min(1, "Currency is required"),

  networkId: z.string().optional(),

  address: z
    .string()
    .trim()
    .min(10, "Wallet address is too short")
    .max(200),

  label: z
    .string()
    .trim()
    .max(100)
    .optional(),
});

export const updateWalletSchema = z.object({
  id: z.string().min(1, "Wallet ID is required"),

  label: z
    .string()
    .trim()
    .max(100)
    .optional(),

  status: z
    .enum(["ACTIVE", "DISABLED"])
    .optional(),

  assignedAt: z
    .union([
      z.coerce.date(),
      z.null(),
    ])
    .optional(),

  notes: z
    .string()
    .trim()
    .max(5000)
    .nullable()
    .optional(),
});

export type AssignWalletInput =
  z.infer<typeof assignWalletSchema>;

export type UpdateWalletInput =
  z.infer<typeof updateWalletSchema>;