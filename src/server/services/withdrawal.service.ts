import { withdrawalRepository } from "@/server/repositories/withdrawal.repository";

export class WithdrawalService {
  async getWithdrawals() {
    return withdrawalRepository.list();
  }

  async getWithdrawal(id: string) {
    return withdrawalRepository.findById(id);
  }

  async getStats() {
    const [
      totalWithdrawals,
      approvedWithdrawals,
      pendingWithdrawals,
      processedWithdrawals,
    ] = await Promise.all([
      withdrawalRepository.count(),
      withdrawalRepository.approvedCount(),
      withdrawalRepository.pendingCount(),
      withdrawalRepository.processedCount(),
    ]);

    return {
      totalWithdrawals,
      approvedWithdrawals,
      pendingWithdrawals,
      processedWithdrawals,
    };
  }
}

export const withdrawalService =
  new WithdrawalService();