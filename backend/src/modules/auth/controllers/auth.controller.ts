import type { Request, Response } from "express";

import { login as loginService } from "../services/auth.service";

export async function login(
  request: Request,
  response: Response,
): Promise<Response> {
  const result = await loginService(request.body);

  return response.status(200).json(result);
}