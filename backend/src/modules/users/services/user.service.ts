import { AppError } from "../../../errors/app-error";
import { User } from "../types/user";

const users: User[] = [];

export function createUser(name: string, email: string): User {
  if (!name || !name.trim()) {
    throw new AppError("O nome é obrigatório");
  }

  if (!email || !email.trim()) {
    throw new AppError("O e-mail é obrigatório");
  }

  const normalizedEmail = email.trim().toLowerCase();

  const emailAlreadyExists = users.some(
    (user) => user.email === normalizedEmail
  );

  if (emailAlreadyExists) {
    throw new AppError("E-mail já cadastrado", 409);
  }

  const user: User = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
  };

  users.push(user);

  return user;
}

export function getUsers(): User[] {
  return users;
}