import { prisma } from "../../../database/prisma";

interface CreateUserData {
  name: string;
  email: string;
  passwordHash: string;
}

interface UpdateUserData {
  name?: string;
  email?: string;
}

const publicUserFields = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
  updatedAt: true,
};

export function findUserById(userId: string) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: publicUserFields,
  });
}

export function findUserWithPasswordById(
  userId: string
) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      passwordHash: true,
    },
  });
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
    select: publicUserFields,
  });
}

export function updateUser(
  userId: string,
  data: UpdateUserData
) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data,
    select: publicUserFields,
  });
}

export function updateUserPassword(
  userId: string,
  passwordHash: string
) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      passwordHash,
    },
    select: publicUserFields,
  });
}

export function deleteUser(userId: string) {
  return prisma.user.delete({
    where: {
      id: userId,
    },
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