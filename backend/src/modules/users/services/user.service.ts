import { AppError } from "../../../errors/app-error";

import {
  createUser as createUserRepository,
  findUserByEmail,
  listUsers as listUsersRepository,
} from "../repositories/user.repository";

interface CreateUserData {
  name: string;
  email: string;
}

export async function createUser({
  name,
  email,
}: CreateUserData) {
  if (!name || !name.trim()) {
    throw new AppError("O nome é obrigatório");
  }

  if (!email || !email.trim()) {
    throw new AppError("O e-mail é obrigatório");
  }

  const normalizedEmail = email.trim().toLowerCase();

  const emailAlreadyExists = await findUserByEmail(normalizedEmail);

  if (emailAlreadyExists) {
    throw new AppError("E-mail já cadastrado", 409);
  }

  return createUserRepository({
    name: name.trim(),
    email: normalizedEmail,
  });
}

export async function listUsers() {
  return listUsersRepository();
}