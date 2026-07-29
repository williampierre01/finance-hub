import { Router } from "express";

import { ensureAuthenticated } from "../../../middlewares/auth.middleware";
import {
  login,
  me,
} from "../controllers/auth.controller";

const authRoutes = Router();

authRoutes.post("/login", login);
authRoutes.get("/me", ensureAuthenticated, me);

export default authRoutes;