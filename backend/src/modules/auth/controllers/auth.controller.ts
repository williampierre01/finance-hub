import type {
  CookieOptions,
  Request,
  Response,
} from "express";

import { env } from "../../../config/env";
import {
  getAuthenticatedUser,
  login as loginService,
} from "../services/auth.service";

const authCookieName = "financehub_token";

const authCookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: env.isProduction
    ? "none"
    : "lax",
  secure: env.isProduction,
  path: "/",
};

export async function login(
  request: Request,
  response: Response,
): Promise<Response> {
  const { email, password } = request.body;

  const result = await loginService({
    email,
    password,
  });

  response.cookie(
    authCookieName,
    result.accessToken,
    {
      ...authCookieOptions,
      maxAge: 1000 * 60 * 60 * 24,
    },
  );

  return response.status(200).json({
    user: result.user,
  });
}

export async function me(
  request: Request,
  response: Response,
): Promise<Response> {
  const userId =
    response.locals.userId as string;

  const user =
    await getAuthenticatedUser(userId);

  return response.status(200).json(user);
}

export async function logout(
  request: Request,
  response: Response,
): Promise<Response> {
  response.clearCookie(
    authCookieName,
    authCookieOptions,
  );

  return response.status(204).send();
}