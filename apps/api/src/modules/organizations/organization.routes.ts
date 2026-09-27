import { Router } from "express";

import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";

import {
  approveOrganization,
  listPendingOrganizations,
  rejectOrganization,
} from "./organization.controller.js";

export const organizationAdminRoutes = Router();

organizationAdminRoutes.use(authenticate);

organizationAdminRoutes.use(authorize("ADMIN"));

organizationAdminRoutes.get("/pending", listPendingOrganizations);

organizationAdminRoutes.patch("/:id/approve", approveOrganization);

organizationAdminRoutes.patch("/:id/reject", rejectOrganization);
