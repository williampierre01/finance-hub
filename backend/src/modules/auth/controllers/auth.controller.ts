import type { Request, Response } from "express";

import {
  getAuthenticatedUser,
  login as loginService,
} from "../services/auth.service";

const AUTH_COOKIE_NAME = "financehub_token";
const ONE_DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

export async function login(
  request: Request,
  response: Response,
): Promise<Response> {
  const result = await loginService(request.body);

  response.cookie(AUTH_COOKIE_NAME, result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ONE_DAY_IN_MILLISECONDS,
  });

  return response.status(200).json({
    user: result.user,
  });
}

export async function me(
  request: Request,
  response: Response,
): Promise<Response> {
  const userId = response.locals.userId as string;

  const user = await getAuthenticatedUser(userId);

  return response.status(200).json(user);
}