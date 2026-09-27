import { Router } from "express";
import { organizationAdminRoutes } from "../modules/organizations/organization.routes.js";
import { authRoutes } from "../modules/auth/auth.routes.js";
import { basketRoutes } from "../modules/baskets/basket.routes.js";
import { familyRoutes } from "../modules/families/family.routes.js";

export const routes = Router();

routes.get("/health", (_request, response) => {
  response.status(200).json({
    status: "ok",
    application: "ANAMÃ API",
  });
});

routes.use("/api/v1/auth", authRoutes);

routes.use("/api/v1/families", familyRoutes);

routes.use("/api/v1/admin/organizations", organizationAdminRoutes);

routes.use("/api/v1/baskets", basketRoutes);
