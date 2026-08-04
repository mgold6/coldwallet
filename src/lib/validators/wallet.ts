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

export type AssignWalletInput =
  z.infer<typeof assignWalletSchema>;