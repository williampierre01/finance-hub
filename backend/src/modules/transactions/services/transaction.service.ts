import { TransactionType } from "../../../generated/prisma/client";
import { AppError } from "../../../errors/app-error";

import {
  createTransaction as createTransactionRepository,
  findUserById,
  listTransactions as listTransactionsRepository,
} from "../repositories/transaction.repository";

interface CreateTransactionData {
  userId: string;
  title: string;
  amount: number;
  type: string;
  category: string;
}

export async function createTransaction(
  data: CreateTransactionData
) {
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
    throw new AppError("O tipo deve ser income ou expense");
  }

  if (!category || !category.trim()) {
    throw new AppError("A categoria é obrigatória");
  }

  const normalizedUserId = userId.trim();

  const userExists = await findUserById(normalizedUserId);

  if (!userExists) {
    throw new AppError("Usuário não encontrado", 404);
  }

  return createTransactionRepository({
    userId: normalizedUserId,
    title: title.trim(),
    amount,
    type:
      type === "income"
        ? TransactionType.INCOME
        : TransactionType.EXPENSE,
    category: category.trim(),
  });
}

export async function listTransactions() {
  return listTransactionsRepository();
}