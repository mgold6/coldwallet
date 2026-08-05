import { depositRepository } from "@/server/repositories/deposit.repository";

export class DepositService {
  async getDeposits() {
    return depositRepository.list();
  }

  async getDeposit(id: string) {
    return depositRepository.findById(id);
  }

  async getStats() {
    const [totalDeposits, confirmedDeposits, pendingDeposits] =
      await Promise.all([
        depositRepository.count(),
        depositRepository.confirmedCount(),
        depositRepository.pendingCount(),
      ]);

    return {
      totalDeposits,
      confirmedDeposits,
      pendingDeposits,
    };
  }
}

export const depositService = new DepositService();