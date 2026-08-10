import "dotenv/config";

import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";

import { env } from "../config/env";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error(
      "JWT_SECRET não foi definida",
    );
  }

  return secret;
}

const jwtSecret = getJwtSecret();

export function createAccessToken(
  userId: string,
) {
  const options: SignOptions = {
    subject: userId,
    expiresIn:
      env.jwtExpiresIn as SignOptions["expiresIn"],
  };

  return jwt.sign({}, jwtSecret, options);
}

export function verifyAccessToken(
  token: string,
) {
  return jwt.verify(token, jwtSecret);
}