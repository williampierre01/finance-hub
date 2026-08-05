import { Router } from "express";

import { ensureAuthenticated } from "../../../middlewares/auth.middleware";
import {
  createTransaction,
  deleteTransaction,
  getTransactionById,
  listTransactions,
  updateTransaction,
} from "../controllers/transaction.controller";

const transactionRoutes = Router();

transactionRoutes.use(ensureAuthenticated);

transactionRoutes.post("/", createTransaction);
transactionRoutes.get("/", listTransactions);
transactionRoutes.get("/:id", getTransactionById);
transactionRoutes.patch("/:id", updateTransaction);
transactionRoutes.delete("/:id", deleteTransaction);

export default transactionRoutes;