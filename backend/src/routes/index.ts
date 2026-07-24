import { Router } from "express";

import healthRoutes from "./health.routes";
import userRoutes from "../modules/users/routes/user.routes";
import transactionRoutes from "../modules/transactions/routes/transaction.routes";

const router = Router();

router.use("/health", healthRoutes);
router.use("/users", userRoutes);
router.use("/transactions", transactionRoutes);

export default router;