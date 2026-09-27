import type { Request, Response } from "express";

import { z } from "zod";

import { basketService } from "./basket.service.js";

const basketParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export async function listActiveBaskets(_request: Request, response: Response) {
  const baskets = await basketService.listActive();

  response.status(200).json({
    baskets,
  });
}

export async function listCatalogItems(_request: Request, response: Response) {
  const items = await basketService.listCatalog();

  response.status(200).json({
    items,
  });
}

export async function getBasket(request: Request, response: Response) {
  const { id } = basketParamsSchema.parse(request.params);

  const basket = await basketService.getById(id);

  response.status(200).json({
    basket,
  });
}
