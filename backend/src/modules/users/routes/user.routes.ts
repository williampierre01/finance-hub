import { Router } from "express";

import {
  createUser,
  listUsers,
} from "../controllers/user.controller";

const userRoutes = Router();

userRoutes.post("/", createUser);
userRoutes.get("/", listUsers);

export default userRoutes;