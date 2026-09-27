import type { Request, Response } from "express";

import { AppError } from "../../shared/errors/app-error.js";

import { basketService } from "../baskets/basket.service.js";
import { aidRequestSchema } from "../baskets/basket.schema.js";

import { familyService } from "./family.service.js";

export async function getMyFamily(request: Request, response: Response) {
  if (!request.auth) {
    throw new AppError("Usuário não autenticado.", 401, "UNAUTHENTICATED");
  }

  const family = await familyService.getMyProfile(request.auth.idUsuario);

  response.status(200).json({
    family,
  });
}

export async function createAidRequest(request: Request, response: Response) {
  if (!request.auth) {
    throw new AppError("Usuário não autenticado.", 401, "UNAUTHENTICATED");
  }

  const input = aidRequestSchema.parse(request.body ?? {});

  const basket = await basketService.createAidRequest(
    request.auth.idUsuario,
    input,
  );

  response.status(201).json({
    basket,
  });
}
