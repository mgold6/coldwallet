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
}

export const transactionService = new TransactionService();