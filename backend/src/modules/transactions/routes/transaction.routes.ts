import { Router } from "express";

import { ensureAuthenticated } from "../../../middlewares/auth.middleware";
import {
  createTransaction,
  getTransactionById,
  listTransactions,
} from "../controllers/transaction.controller";

const transactionRoutes = Router();

transactionRoutes.use(ensureAuthenticated);

transactionRoutes.post("/", createTransaction);
transactionRoutes.get("/", listTransactions);
transactionRoutes.get("/:id", getTransactionById);

export default transactionRoutes;