import { Request, Response } from "express";
import { createUser, getUsers } from "../services/user.service";

export function createUserController(req: Request, res: Response) {
  const { name, email } = req.body;

  const user = createUser(name, email);

  return res.status(201).json(user);
}

export function listUsersController(_req: Request, res: Response) {
  const users = getUsers();

  return res.status(200).json(users);
}