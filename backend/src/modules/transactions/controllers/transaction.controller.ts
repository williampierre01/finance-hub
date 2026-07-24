import { Request, Response } from "express";

import {
  createTransaction as createTransactionService,
  listTransactions as listTransactionsService,
} from "../services/transaction.service";

export function createTransaction(
  request: Request,
  response: Response
): Response {
  const transaction = createTransactionService(request.body);

  return response.status(201).json(transaction);
}

export function listTransactions(
  request: Request,
  response: Response
): Response {
  const transactions = listTransactionsService();

  return response.status(200).json(transactions);
}