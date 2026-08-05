import { prisma } from "../../../database/prisma";
import { TransactionType } from "../../../generated/prisma/client";

interface CreateTransactionData {
  userId: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
}

interface UpdateTransactionData {
  title?: string;
  amount?: number;
  category?: string;
}

export function findUserById(userId: string) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
}

export function createTransaction(
  data: CreateTransactionData,
) {
  return prisma.transaction.create({
    data,
  });
}

export function listTransactions(userId: string) {
  return prisma.transaction.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export function findTransactionById(
  transactionId: string,
  userId: string,
) {
  return prisma.transaction.findFirst({
    where: {
      id: transactionId,
      userId,
    },
  });
}

export function updateTransaction(
  transactionId: string,
  data: UpdateTransactionData,
) {
  return prisma.transaction.update({
    where: {
      id: transactionId,
    },
    data,
  });
}

export function deleteTransaction(transactionId: string) {
  return prisma.transaction.delete({
    where: {
      id: transactionId,
    },
  });
}