import { AppError } from "../../../errors/app-error";
import { TransactionType } from "../../../generated/prisma/client";

import {
  createTransaction as createTransactionRepository,
  deleteTransaction as deleteTransactionRepository,
  findTransactionById as findTransactionByIdRepository,
  findUserById,
  getTransactionSummary as getTransactionSummaryRepository,
  listPaginatedTransactions as listPaginatedTransactionsRepository,
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

interface ListPaginatedTransactionsFilters {
  userId: string;
  type?: string;
  search?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  page?: string;
  limit?: string;
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

export async function listPaginatedTransactions({
  userId,
  type,
  search,
  category,
  startDate,
  endDate,
  page = "1",
  limit = "5",
}: ListPaginatedTransactionsFilters) {
  const parsedPage = Number(page);
  const parsedLimit = Number(limit);

  if (
    !Number.isInteger(parsedPage) ||
    parsedPage < 1
  ) {
    throw new AppError(
      "A página deve ser um número inteiro maior que zero",
    );
  }

  if (
    !Number.isInteger(parsedLimit) ||
    parsedLimit < 1 ||
    parsedLimit > 50
  ) {
    throw new AppError(
      "O limite deve ser um número inteiro entre 1 e 50",
    );
  }

  if (
    type &&
    type !== "income" &&
    type !== "expense"
  ) {
    throw new AppError(
      "O tipo deve ser income ou expense",
    );
  }

  let parsedStartDate: Date | undefined;
  let parsedEndDate: Date | undefined;

  if (startDate) {
    parsedStartDate = new Date(
      `${startDate}T00:00:00.000Z`,
    );

    if (Number.isNaN(parsedStartDate.getTime())) {
      throw new AppError(
        "A data inicial é inválida",
      );
    }
  }

  if (endDate) {
    parsedEndDate = new Date(
      `${endDate}T23:59:59.999Z`,
    );

    if (Number.isNaN(parsedEndDate.getTime())) {
      throw new AppError(
        "A data final é inválida",
      );
    }
  }

  if (
    parsedStartDate &&
    parsedEndDate &&
    parsedStartDate > parsedEndDate
  ) {
    throw new AppError(
      "A data inicial não pode ser posterior à data final",
    );
  }

  const skip = (parsedPage - 1) * parsedLimit;

  let transactionType:
    | TransactionType
    | undefined;

  if (type === "income") {
    transactionType = TransactionType.INCOME;
  }

  if (type === "expense") {
    transactionType = TransactionType.EXPENSE;
  }

  const { transactions, total } =
    await listPaginatedTransactionsRepository({
      userId,
      type: transactionType,
      search: search?.trim() || undefined,
      category: category?.trim() || undefined,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      skip,
      take: parsedLimit,
    });

  return {
    data: transactions,
    pagination: {
      page: parsedPage,
      limit: parsedLimit,
      total,
      totalPages: Math.ceil(
        total / parsedLimit,
      ),
    },
  };
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

  const normalizedTransactionId =
    transactionId.trim();

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

function calculateSummaryTotals(
  groupedTransactions: Awaited<
    ReturnType<typeof getTransactionSummaryRepository>
  >,
) {
  let income = 0;
  let expense = 0;

  for (const group of groupedTransactions) {
    const total = Number(group._sum.amount ?? 0);

    if (group.type === TransactionType.INCOME) {
      income = total;
    }

    if (group.type === TransactionType.EXPENSE) {
      expense = total;
    }
  }

  return {
    income,
    expense,
    balance: income - expense,
  };
}

function calculatePercentageVariation(
  currentValue: number,
  previousValue: number,
) {
  if (previousValue === 0) {
    return currentValue === 0 ? 0 : 100;
  }

  const variation =
    ((currentValue - previousValue) /
      Math.abs(previousValue)) *
    100;

  return Number(variation.toFixed(2));
}

export async function getTransactionSummary(
  userId: string,
  month?: string,
) {
  if (!month) {
    const groupedTransactions =
      await getTransactionSummaryRepository(userId);

    const totals = calculateSummaryTotals(
      groupedTransactions,
    );

    return {
      ...totals,
      month: null,
      previousMonth: null,
      variation: null,
    };
  }

  const validMonthFormat =
    /^\d{4}-(0[1-9]|1[0-2])$/.test(month);

  if (!validMonthFormat) {
    throw new AppError(
      "O mês deve estar no formato AAAA-MM",
    );
  }

  const [year, monthNumber] = month
    .split("-")
    .map(Number);

  const currentStartDate = new Date(
    Date.UTC(year, monthNumber - 1, 1),
  );

  const currentEndDate = new Date(
    Date.UTC(year, monthNumber, 1),
  );

  const previousStartDate = new Date(
    Date.UTC(year, monthNumber - 2, 1),
  );

  const previousEndDate = currentStartDate;

  const previousMonthValue = [
    previousStartDate.getUTCFullYear(),
    String(
      previousStartDate.getUTCMonth() + 1,
    ).padStart(2, "0"),
  ].join("-");

  const [
    currentGroupedTransactions,
    previousGroupedTransactions,
  ] = await Promise.all([
    getTransactionSummaryRepository(
      userId,
      currentStartDate,
      currentEndDate,
    ),
    getTransactionSummaryRepository(
      userId,
      previousStartDate,
      previousEndDate,
    ),
  ]);

  const currentTotals = calculateSummaryTotals(
    currentGroupedTransactions,
  );

  const previousTotals = calculateSummaryTotals(
    previousGroupedTransactions,
  );

  return {
    ...currentTotals,
    month,
    previousMonth: {
      ...previousTotals,
      month: previousMonthValue,
    },
    variation: {
      income: calculatePercentageVariation(
        currentTotals.income,
        previousTotals.income,
      ),
      expense: calculatePercentageVariation(
        currentTotals.expense,
        previousTotals.expense,
      ),
      balance: calculatePercentageVariation(
        currentTotals.balance,
        previousTotals.balance,
      ),
    },
  };
}