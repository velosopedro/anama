import type { Request, Response } from "express";

import { AppError } from "../../shared/errors/app-error.js";

import { loginSchema, registerSchema } from "./auth.schema.js";

import { authService } from "./auth.service.js";

export async function register(request: Request, response: Response) {
  const input = registerSchema.parse(request.body);

  const result = await authService.register(input);

  response.status(201).json(result);
}

export async function login(request: Request, response: Response) {
  const input = loginSchema.parse(request.body);

  const result = await authService.login(input);

  response.status(200).json(result);
}

export async function me(request: Request, response: Response) {
  if (!request.auth) {
    throw new AppError("Usuário não autenticado.", 401, "UNAUTHENTICATED");
  }

  const user = await authService.me(request.auth.idUsuario);

  response.status(200).json({
    user,
  });
}
