import { Router } from "express";

import { ensureAuthenticated } from "../../../middlewares/auth.middleware";
import {
  createTransaction,
  listTransactions,
} from "../controllers/transaction.controller";

const transactionRoutes = Router();

transactionRoutes.use(ensureAuthenticated);

transactionRoutes.post("/", createTransaction);
transactionRoutes.get("/", listTransactions);

export default transactionRoutes;