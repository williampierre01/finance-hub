import { Request, Response } from "express";

import {
  createTransaction as createTransactionService,
  getTransactionById as getTransactionByIdService,
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