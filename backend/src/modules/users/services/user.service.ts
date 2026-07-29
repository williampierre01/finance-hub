import { AppError } from "../../../errors/app-error";
import { hashPassword } from "../../../security/password";

import {
  createUser as createUserRepository,
  findUserByEmail,
  listUsers as listUsersRepository,
} from "../repositories/user.repository";

interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

export async function createUser({
  name,
  email,
  password,
}: CreateUserData) {
  if (!name || !name.trim()) {
    throw new AppError("O nome é obrigatório");
  }

  if (!email || !email.trim()) {
    throw new AppError("O e-mail é obrigatório");
  }

  if (!password) {
    throw new AppError("A senha é obrigatória");
  }

  if (password.length < 8) {
    throw new AppError(
      "A senha deve possuir pelo menos 8 caracteres",
    );
  }

  if (password.length > 72) {
    throw new AppError(
      "A senha deve possuir no máximo 72 caracteres",
    );
  }

  const normalizedEmail = email.trim().toLowerCase();

  const emailAlreadyExists = await findUserByEmail(normalizedEmail);

  if (emailAlreadyExists) {
    throw new AppError("E-mail já cadastrado", 409);
  }

  const passwordHash = await hashPassword(password);

  return createUserRepository({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
  });
}

export async function listUsers() {
  return listUsersRepository();
}