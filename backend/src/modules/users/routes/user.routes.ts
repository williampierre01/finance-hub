import { Router } from "express";

import { ensureAuthenticated } from "../../../middlewares/auth.middleware";
import {
  changeUserPassword,
  createUser,
  listUsers,
  updateUserProfile,
} from "../controllers/user.controller";

const userRoutes = Router();

userRoutes.post("/", createUser);

userRoutes.patch(
  "/me/password",
  ensureAuthenticated,
  changeUserPassword
);

userRoutes.patch(
  "/me",
  ensureAuthenticated,
  updateUserProfile
);

userRoutes.get("/", listUsers);

export default userRoutes;