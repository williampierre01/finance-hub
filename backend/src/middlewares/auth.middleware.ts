import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { AppError } from "../errors/app-error";
import { verifyAccessToken } from "../security/token";

const AUTH_COOKIE_NAME = "financehub_token";

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const authorizationHeader = request.headers.authorization;

  const bearerToken = authorizationHeader?.startsWith("Bearer ")
    ? authorizationHeader.slice(7).trim()
    : undefined;

  const cookieToken = request.cookies?.[AUTH_COOKIE_NAME] as
    | string
    | undefined;

  const token = bearerToken || cookieToken;

  if (!token) {
    throw new AppError(
      "Token de autenticação não informado",
      401,
    );
  }

  try {
    const decodedToken = verifyAccessToken(token);

    if (
      typeof decodedToken === "string" ||
      !decodedToken.sub
    ) {
      throw new AppError(
        "Token de autenticação inválido",
        401,
      );
    }

    response.locals.userId = decodedToken.sub;

    return next();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      "Token inválido ou expirado",
      401,
    );
  }
}