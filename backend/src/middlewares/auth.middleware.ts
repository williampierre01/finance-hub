import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { AppError } from "../errors/app-error";
import { verifyAccessToken } from "../security/token";

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader) {
    throw new AppError("Token de autenticação não informado", 401);
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new AppError("Token de autenticação inválido", 401);
  }

  try {
    const decodedToken = verifyAccessToken(token);

    if (
      typeof decodedToken === "string" ||
      !decodedToken.sub
    ) {
      throw new AppError("Token de autenticação inválido", 401);
    }

    response.locals.userId = decodedToken.sub;

    return next();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Token inválido ou expirado", 401);
  }
}