import { Request, Response } from "express";

import {
  createTransaction as createTransactionService,
  deleteTransaction as deleteTransactionService,
  getTransactionById as getTransactionByIdService,
  getTransactionMonthlyEvolution as getTransactionMonthlyEvolutionService,
  getTransactionTotalsByCategory as getTransactionTotalsByCategoryService,
  getTransactionSummary as getTransactionSummaryService,
  listPaginatedTransactions as listPaginatedTransactionsService,
  listTransactions as listTransactionsService,
  updateTransaction as updateTransactionService,
} from "../services/transaction.service";

export async function createTransaction(
  request: Request,
  response: Response,
): Promise<Response> {
  const userId = response.locals.userId as string;

  const transaction =
    await createTransactionService({
      ...request.body,
      userId,
    });

  return response.status(201).json(transaction);
}

export async function listTransactions(
  request: Request,
  response: Response,
): Promise<Response> {
  const userId = response.locals.userId as string;

  const transactions =
    await listTransactionsService(userId);

  return response.status(200).json(transactions);
}

export async function listPaginatedTransactions(
  request: Request,
  response: Response,
): Promise<Response> {
  const userId = response.locals.userId as string;

  const {
    type,
    search,
    category,
    startDate,
    endDate,
    page,
    limit,
  } = request.query;

  const result =
    await listPaginatedTransactionsService({
      userId,
      type: type as string | undefined,
      search: search as string | undefined,
      category: category as string | undefined,
      startDate: startDate as string | undefined,
      endDate: endDate as string | undefined,
      page: page as string | undefined,
      limit: limit as string | undefined,
    });

  return response.status(200).json(result);
}

export async function getTransactionById(
  request: Request,
  response: Response,
): Promise<Response> {
  const userId = response.locals.userId as string;
  const id = request.params.id as string;

  const transaction =
    await getTransactionByIdService(
      id,
      userId,
    );

  return response.status(200).json(transaction);
}

export async function updateTransaction(
  request: Request,
  response: Response,
): Promise<Response> {
  const userId = response.locals.userId as string;
  const id = request.params.id as string;

  const updatedTransaction =
    await updateTransactionService(
      id,
      userId,
      request.body,
    );

  return response
    .status(200)
    .json(updatedTransaction);
}

export async function deleteTransaction(
  request: Request,
  response: Response,
): Promise<Response> {
  const userId = response.locals.userId as string;
  const id = request.params.id as string;

  await deleteTransactionService(
    id,
    userId,
  );

  return response.status(204).send();
}

export async function getTransactionSummary(
  request: Request,
  response: Response,
): Promise<Response> {
  const userId = response.locals.userId as string;

  const month = request.query.month as
    | string
    | undefined;

  const summary =
    await getTransactionSummaryService(
      userId,
      month,
    );

  return response.status(200).json(summary);
}

export async function getTransactionTotalsByCategory(
  request: Request,
  response: Response,
): Promise<Response> {
  const userId = response.locals.userId as string;

  const { type, month } = request.query;

  const categoryTotals =
    await getTransactionTotalsByCategoryService({
      userId,
      type: type as string | undefined,
      month: month as string | undefined,
    });

  return response
    .status(200)
    .json(categoryTotals);
}

export async function getTransactionMonthlyEvolution(
  request: Request,
  response: Response,
): Promise<Response> {
  const userId = response.locals.userId as string;

  const months = request.query.months as
    | string
    | undefined;

  const evolution =
    await getTransactionMonthlyEvolutionService(
      userId,
      months,
    );

  return response.status(200).json(evolution);
}