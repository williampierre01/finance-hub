import { Router } from "express";

import { ensureAuthenticated } from "../../../middlewares/auth.middleware";
import {
  login,
  logout,
  me,
} from "../controllers/auth.controller";

const authRoutes = Router();

authRoutes.post("/login", login);
authRoutes.post("/logout", logout);
authRoutes.get("/me", ensureAuthenticated, me);

export default authRoutes;