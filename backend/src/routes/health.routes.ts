import { Router } from "express";
import {
  healthController,
  errorTestController,
} from "../controllers/health.controller";

const router = Router();

router.get("/", healthController);
router.get("/error", errorTestController);

export default router;