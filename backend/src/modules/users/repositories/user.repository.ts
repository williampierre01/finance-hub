import { prisma } from "../../../database/prisma";

interface CreateUserData {
  name: string;
  email: string;
}

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export function createUser(data: CreateUserData) {
  return prisma.user.create({
    data,
  });
}

export function listUsers() {
  return prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}