import { Router } from "express";

import authRoutes from "../modules/auth/routes/auth.routes";
import transactionRoutes from "../modules/transactions/routes/transaction.routes";
import userRoutes from "../modules/users/routes/user.routes";
import healthRoutes from "./health.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/health", healthRoutes);
router.use("/users", userRoutes);
router.use("/transactions", transactionRoutes);

export default router;