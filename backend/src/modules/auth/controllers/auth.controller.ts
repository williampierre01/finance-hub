import type { Request, Response } from "express";

import {
  getAuthenticatedUser,
  login as loginService,
} from "../services/auth.service";

export async function login(
  request: Request,
  response: Response,
): Promise<Response> {
  const result = await loginService(request.body);

  return response.status(200).json(result);
}

export async function me(
  request: Request,
  response: Response,
): Promise<Response> {
  const userId = response.locals.userId as string;

  const user = await getAuthenticatedUser(userId);

  return response.status(200).json(user);
}