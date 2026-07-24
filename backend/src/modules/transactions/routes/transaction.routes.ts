import { Router } from "express";

import {
  createTransaction,
  listTransactions,
} from "../controllers/transaction.controller";

const transactionRoutes = Router();

transactionRoutes.post("/", createTransaction);
transactionRoutes.get("/", listTransactions);

export default transactionRoutes;