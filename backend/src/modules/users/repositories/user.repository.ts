import { prisma } from "../../../database/prisma";

interface CreateUserData {
  name: string;
  email: string;
  passwordHash: string;
}

const publicUserFields = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
  updatedAt: true,
};

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
    select: publicUserFields,
  });
}

export function listUsers() {
  return prisma.user.findMany({
    select: publicUserFields,
    orderBy: {
      createdAt: "desc",
    },
  });
}