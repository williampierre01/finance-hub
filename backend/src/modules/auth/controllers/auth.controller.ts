import type { Request, Response } from "express";

import {
  getAuthenticatedUser,
  login as loginService,
} from "../services/auth.service";

export async function login(
  request: Request,
  response: Response
): Promise<Response> {
  const { email, password } = request.body;

  const result = await loginService({
    email,
    password,
  });

  response.cookie("financehub_token", result.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 1000 * 60 * 60 * 24,
  });

  return response.status(200).json({
    user: result.user,
  });
}

export async function me(
  request: Request,
  response: Response
): Promise<Response> {
  const userId = response.locals.userId as string;

  const user = await getAuthenticatedUser(userId);

  return response.status(200).json(user);
}

export async function logout(
  request: Request,
  response: Response
): Promise<Response> {
  response.clearCookie("financehub_token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return response.status(204).send();
}