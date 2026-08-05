import { Request, Response } from "express";

import {
  changeUserPassword as changeUserPasswordService,
  createUser as createUserService,
  listUsers as listUsersService,
  updateUserProfile as updateUserProfileService,
} from "../services/user.service";

export async function createUser(
  request: Request,
  response: Response
): Promise<Response> {
  const user = await createUserService(request.body);

  return response.status(201).json(user);
}

export async function updateUserProfile(
  request: Request,
  response: Response
): Promise<Response> {
  const userId = response.locals.userId as string;

  const updatedUser = await updateUserProfileService(
    userId,
    request.body
  );

  return response.status(200).json(updatedUser);
}

export async function changeUserPassword(
  request: Request,
  response: Response
): Promise<Response> {
  const userId = response.locals.userId as string;

  await changeUserPasswordService(
    userId,
    request.body
  );

  response.clearCookie("financehub_token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return response.status(204).send();
}

export async function listUsers(
  request: Request,
  response: Response
): Promise<Response> {
  const users = await listUsersService();

  return response.status(200).json(users);
}