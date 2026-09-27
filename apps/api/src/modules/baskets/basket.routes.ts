import { Router } from "express";

import { authenticate } from "../../middlewares/authenticate.js";

import {
  getBasket,
  listActiveBaskets,
  listCatalogItems,
} from "./basket.controller.js";

export const basketRoutes = Router();

basketRoutes.use(authenticate);

basketRoutes.get("/", listActiveBaskets);

basketRoutes.get("/catalog/items", listCatalogItems);

basketRoutes.get("/:id", getBasket);
