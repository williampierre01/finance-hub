import { AppError } from "../../../errors/app-error";
import {
  Transaction,
  TransactionType,
} from "../types/transaction";

interface CreateTransactionData {
  userId: string;
  title: string;
  amount: number;
  type: string;
  category: string;
}

const transactions: Transaction[] = [];

export function createTransaction(
  data: CreateTransactionData
): Transaction {
  const { userId, title, amount, type, category } = data;

  if (!userId || !userId.trim()) {
    throw new AppError("O usuário é obrigatório");
  }

  if (!title || !title.trim()) {
    throw new AppError("O título é obrigatório");
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new AppError("O valor deve ser maior que zero");
  }

  if (type !== "income" && type !== "expense") {
    throw new AppError(
      "O tipo deve ser income ou expense"
    );
  }

  if (!category || !category.trim()) {
    throw new AppError("A categoria é obrigatória");
  }

  const transaction: Transaction = {
    id: crypto.randomUUID(),
    userId: userId.trim(),
    title: title.trim(),
    amount,
    type: type as TransactionType,
    category: category.trim(),
    createdAt: new Date().toISOString(),
  };

  transactions.push(transaction);

  return transaction;
}

export function listTransactions(): Transaction[] {
  return transactions;
}