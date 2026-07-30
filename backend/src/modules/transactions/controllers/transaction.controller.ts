import type { Request, Response } from "express";

import {
  createTransaction as createTransactionService,
  listTransactions as listTransactionsService,
} from "../services/transaction.service";

export async function createTransaction(
  request: Request,
  response: Response,
): Promise<Response> {
  const userId = response.locals.userId as string;

  const transaction = await createTransactionService({
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

  const transactions = await listTransactionsService(userId);

  return response.status(200).json(transactions);
}