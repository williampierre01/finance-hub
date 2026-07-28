import { AppError } from "../../../errors/app-error";
import { prisma } from "../../../database/prisma";

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

  const emailAlreadyExists = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (emailAlreadyExists) {
    throw new AppError("E-mail já cadastrado", 409);
  }

  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: normalizedEmail,
    },
  });

  return user;
}

export async function listUsers() {
  return prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}