import { AppError } from "../../../errors/app-error";
import { comparePassword } from "../../../security/password";
import { createAccessToken } from "../../../security/token";
import { findUserByEmail } from "../../users/repositories/user.repository";

interface LoginData {
  email: string;
  password: string;
}

export async function login({
  email,
  password,
}: LoginData) {
  if (!email || !email.trim()) {
    throw new AppError("O e-mail é obrigatório");
  }

  if (!password) {
    throw new AppError("A senha é obrigatória");
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await findUserByEmail(normalizedEmail);

  if (!user || !user.passwordHash) {
    throw new AppError("E-mail ou senha inválidos", 401);
  }

  const passwordMatches = await comparePassword(
    password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    throw new AppError("E-mail ou senha inválidos", 401);
  }

  const accessToken = createAccessToken(user.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    accessToken,
  };
}