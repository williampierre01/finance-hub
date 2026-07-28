import { Request, Response } from "express";

import {
  createUser as createUserService,
  listUsers as listUsersService,
} from "../services/user.service";

export async function createUser(
  request: Request,
  response: Response
): Promise<Response> {
  const user = await createUserService(request.body);

  return response.status(201).json(user);
}

export async function listUsers(
  request: Request,
  response: Response
): Promise<Response> {
  const users = await listUsersService();

  return response.status(200).json(users);
}