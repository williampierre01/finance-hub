import { Router } from "express";
import {
  createUserController,
  listUsersController,
} from "../controllers/user.controller";

const router = Router();

router.post("/", createUserController);

router.get("/", listUsersController);

export default router;