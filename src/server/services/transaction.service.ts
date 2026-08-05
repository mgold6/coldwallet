import { transactionRepository } from "../repositories/transaction.repository";

export class TransactionService {
  async getAllTransactions() {
    return transactionRepository.list();
  }

  async getTransactionById(id: string) {
    return transactionRepository.findById(id);
  }

  async getPendingTransactions() {
    return transactionRepository.findPending();
  }

  async getWalletTransactions(walletId: string) {
    return transactionRepository.findByWallet(walletId);
  }

  async getStats() {
    const transactions = await transactionRepository.list();

    return {
      total: transactions.length,

      pending: transactions.filter(
        (transaction) => transaction.status === "PENDING"
      ).length,

      processing: transactions.filter(
        (transaction) => transaction.status === "PROCESSING"
      ).length,

      completed: transactions.filter(
        (transaction) => transaction.status === "COMPLETED"
      ).length,

      failed: transactions.filter(
        (transaction) => transaction.status === "FAILED"
      ).length,

      cancelled: transactions.filter(
        (transaction) => transaction.status === "CANCELLED"
      ).length,
    };
  }
}

export const transactionService = new TransactionService();