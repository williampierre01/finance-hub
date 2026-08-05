import { AppError } from "../../../errors/app-error";
import {
  comparePassword,
  hashPassword,
} from "../../../security/password";

import {
  createUser as createUserRepository,
  findUserByEmail,
  findUserById,
  findUserWithPasswordById,
  listUsers as listUsersRepository,
  updateUser as updateUserRepository,
  updateUserPassword as updateUserPasswordRepository,
} from "../repositories/user.repository";

interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

interface UpdateUserData {
  name?: string;
  email?: string;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  passwordConfirmation: string;
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
      "A senha deve possuir pelo menos 8 caracteres"
    );
  }

  if (password.length > 72) {
    throw new AppError(
      "A senha deve possuir no máximo 72 caracteres"
    );
  }

  const normalizedEmail = email.trim().toLowerCase();

  const emailAlreadyExists = await findUserByEmail(
    normalizedEmail
  );

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

export async function updateUserProfile(
  userId: string,
  { name, email }: UpdateUserData
) {
  const currentUser = await findUserById(userId);

  if (!currentUser) {
    throw new AppError("Usuário não encontrado", 404);
  }

  if (name === undefined && email === undefined) {
    throw new AppError(
      "Informe pelo menos um campo para atualizar"
    );
  }

  const updatedData: UpdateUserData = {};

  if (name !== undefined) {
    if (!name || !name.trim()) {
      throw new AppError("O nome é obrigatório");
    }

    updatedData.name = name.trim();
  }

  if (email !== undefined) {
    if (!email || !email.trim()) {
      throw new AppError("O e-mail é obrigatório");
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailAlreadyExists = await findUserByEmail(
      normalizedEmail
    );

    if (
      emailAlreadyExists &&
      emailAlreadyExists.id !== userId
    ) {
      throw new AppError("E-mail já cadastrado", 409);
    }

    updatedData.email = normalizedEmail;
  }

  return updateUserRepository(userId, updatedData);
}

export async function changeUserPassword(
  userId: string,
  {
    currentPassword,
    newPassword,
    passwordConfirmation,
  }: ChangePasswordData
) {
  if (!currentPassword) {
    throw new AppError("Informe a senha atual");
  }

  if (!newPassword) {
    throw new AppError("Informe a nova senha");
  }

  if (!passwordConfirmation) {
    throw new AppError("Confirme a nova senha");
  }

  if (newPassword.length < 8) {
    throw new AppError(
      "A nova senha deve possuir pelo menos 8 caracteres"
    );
  }

  if (newPassword.length > 72) {
    throw new AppError(
      "A nova senha deve possuir no máximo 72 caracteres"
    );
  }

  if (newPassword !== passwordConfirmation) {
    throw new AppError(
      "A confirmação da senha não corresponde à nova senha"
    );
  }

  const user = await findUserWithPasswordById(userId);

  if (!user || !user.passwordHash) {
    throw new AppError("Usuário não encontrado", 404);
  }

  const currentPasswordMatches = await comparePassword(
    currentPassword,
    user.passwordHash
  );

  if (!currentPasswordMatches) {
    throw new AppError("A senha atual está incorreta", 401);
  }

  const newPasswordIsCurrent = await comparePassword(
    newPassword,
    user.passwordHash
  );

  if (newPasswordIsCurrent) {
    throw new AppError(
      "A nova senha deve ser diferente da senha atual"
    );
  }

  const newPasswordHash = await hashPassword(newPassword);

  return updateUserPasswordRepository(
    userId,
    newPasswordHash
  );
}

export async function listUsers() {
  return listUsersRepository();
}