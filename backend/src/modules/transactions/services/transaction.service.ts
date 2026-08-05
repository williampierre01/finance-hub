import { AppError } from "../../../errors/app-error";
import { TransactionType } from "../../../generated/prisma/client";

import {
  createTransaction as createTransactionRepository,
  deleteTransaction as deleteTransactionRepository,
  findTransactionById as findTransactionByIdRepository,
  findUserById,
  listTransactions as listTransactionsRepository,
  updateTransaction as updateTransactionRepository,
} from "../repositories/transaction.repository";

interface CreateTransactionData {
  userId: string;
  title: string;
  amount: number;
  type: string;
  category: string;
}

interface UpdateTransactionData {
  title?: string;
  amount?: number;
  category?: string;
}

export async function createTransaction(
  data: CreateTransactionData,
) {
  const {
    userId,
    title,
    amount,
    type,
    category,
  } = data;

  if (!userId || !userId.trim()) {
    throw new AppError("O usuário é obrigatório");
  }

  if (!title || !title.trim()) {
    throw new AppError("O título é obrigatório");
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new AppError(
      "O valor deve ser maior que zero",
    );
  }

  if (type !== "income" && type !== "expense") {
    throw new AppError(
      "O tipo deve ser income ou expense",
    );
  }

  if (!category || !category.trim()) {
    throw new AppError("A categoria é obrigatória");
  }

  const normalizedUserId = userId.trim();

  const userExists = await findUserById(
    normalizedUserId,
  );

  if (!userExists) {
    throw new AppError(
      "Usuário não encontrado",
      404,
    );
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

export async function listTransactions(
  userId: string,
) {
  return listTransactionsRepository(userId);
}

export async function getTransactionById(
  transactionId: string,
  userId: string,
) {
  if (!transactionId || !transactionId.trim()) {
    throw new AppError(
      "O ID da transação é obrigatório",
    );
  }

  const transaction =
    await findTransactionByIdRepository(
      transactionId.trim(),
      userId,
    );

  if (!transaction) {
    throw new AppError(
      "Transação não encontrada",
      404,
    );
  }

  return transaction;
}

export async function updateTransaction(
  transactionId: string,
  userId: string,
  {
    title,
    amount,
    category,
  }: UpdateTransactionData,
) {
  const transaction =
    await findTransactionByIdRepository(
      transactionId,
      userId,
    );

  if (!transaction) {
    throw new AppError(
      "Transação não encontrada",
      404,
    );
  }

  if (
    title === undefined &&
    amount === undefined &&
    category === undefined
  ) {
    throw new AppError(
      "Informe pelo menos um campo para atualizar",
    );
  }

  const updatedData: UpdateTransactionData = {};

  if (title !== undefined) {
    if (!title || !title.trim()) {
      throw new AppError(
        "O título é obrigatório",
      );
    }

    updatedData.title = title.trim();
  }

  if (amount !== undefined) {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new AppError(
        "O valor deve ser maior que zero",
      );
    }

    updatedData.amount = amount;
  }

  if (category !== undefined) {
    if (!category || !category.trim()) {
      throw new AppError(
        "A categoria é obrigatória",
      );
    }

    updatedData.category = category.trim();
  }

  return updateTransactionRepository(
    transactionId,
    updatedData,
  );
}

export async function deleteTransaction(
  transactionId: string,
  userId: string,
) {
  if (!transactionId || !transactionId.trim()) {
    throw new AppError(
      "O ID da transação é obrigatório",
    );
  }

  const normalizedTransactionId = transactionId.trim();

  const transaction =
    await findTransactionByIdRepository(
      normalizedTransactionId,
      userId,
    );

  if (!transaction) {
    throw new AppError(
      "Transação não encontrada",
      404,
    );
  }

  await deleteTransactionRepository(
    normalizedTransactionId,
  );
}