import { Router } from "express";

import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";

import { createAidRequest, getMyFamily } from "./family.controller.js";

export const familyRoutes = Router();

familyRoutes.get("/me", authenticate, authorize("FAMILIA"), getMyFamily);

familyRoutes.post(
  "/me/aid-requests",
  authenticate,
  authorize("FAMILIA"),
  createAidRequest,
);
