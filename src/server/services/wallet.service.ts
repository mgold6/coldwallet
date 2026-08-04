import { UserRole } from "@prisma/client";

import { walletRepository } from "../repositories/wallet.repository";
import { portfolioRepository } from "../repositories/portfolio.repository";
import { ValidationError } from "../errors/ValidationError";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";

export class WalletService {
  async assignWallet({
    currentUserRole,
    portfolioId,
    currency,
    network,
    address,
    label,
  }: {
    currentUserRole: UserRole;

    portfolioId: string;

    currency: string;

    network?: string;

    address: string;

    label?: string;
  }) {
    // Only administrators may assign wallets.
    if (currentUserRole !== UserRole.ADMIN) {
      throw new UnauthorizedError(
        "Only administrators may assign wallet addresses."
      );
    }

    const portfolio =
      await portfolioRepository.findById(portfolioId);

    if (!portfolio) {
      throw new NotFoundError("Portfolio not found.");
    }

    const existingWallet =
      await walletRepository.findByAddress(address);

    if (existingWallet) {
      throw new ValidationError(
        "Wallet address already exists."
      );
    }

    // We will connect Currency and Network
    // in the next milestone.

    return {
      success: true,

      portfolio,

      currency,

      network,

      address,

      label,
    };
  }
}

export const walletService = new WalletService();