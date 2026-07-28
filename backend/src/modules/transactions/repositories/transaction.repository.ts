import { TransactionType } from "../../../generated/prisma/client";
import { prisma } from "../../../database/prisma";

interface CreateTransactionData {
  userId: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
}

export function findUserById(userId: string) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
}

export function createTransaction(data: CreateTransactionData) {
  return prisma.transaction.create({
    data,
  });
}

export function listTransactions() {
  return prisma.transaction.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}