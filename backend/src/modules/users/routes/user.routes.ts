import { Router } from "express";

import { ensureAuthenticated } from "../../../middlewares/auth.middleware";
import {
  changeUserPassword,
  createUser,
  deleteUserAccount,
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

userRoutes.delete(
  "/me",
  ensureAuthenticated,
  deleteUserAccount
);

userRoutes.get("/", listUsers);

export default userRoutes;