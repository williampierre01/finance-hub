import { prisma } from "../../../database/prisma";
import {
  Prisma,
  TransactionType,
} from "../../../generated/prisma/client";

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

interface ListPaginatedTransactionsData {
  userId: string;
  type?: TransactionType;
  search?: string;
  category?: string;
  startDate?: Date;
  endDate?: Date;
  skip: number;
  take: number;
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

export async function listPaginatedTransactions({
  userId,
  type,
  search,
  category,
  startDate,
  endDate,
  skip,
  take,
}: ListPaginatedTransactionsData) {
  const where: Prisma.TransactionWhereInput = {
    userId,
  };

  if (type) {
    where.type = type;
  }

  if (search) {
    where.title = {
      contains: search,
      mode: "insensitive",
    };
  }

  if (category) {
    where.category = {
      contains: category,
      mode: "insensitive",
    };
  }

  if (startDate || endDate) {
    where.createdAt = {
      ...(startDate
        ? {
            gte: startDate,
          }
        : {}),
      ...(endDate
        ? {
            lte: endDate,
          }
        : {}),
    };
  }

  const [transactions, total] =
    await prisma.$transaction([
      prisma.transaction.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take,
      }),
      prisma.transaction.count({
        where,
      }),
    ]);

  return {
    transactions,
    total,
  };
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