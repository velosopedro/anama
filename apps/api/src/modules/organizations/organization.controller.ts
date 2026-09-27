import type { Request, Response } from "express";

import { z } from "zod";

import { organizationService } from "./organization.service.js";

const organizationParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export async function listPendingOrganizations(
  _request: Request,
  response: Response,
) {
  const organizations = await organizationService.listPending();

  response.status(200).json({
    organizations,
  });
}

export async function approveOrganization(
  request: Request,
  response: Response,
) {
  const { id } = organizationParamsSchema.parse(request.params);

  const organization = await organizationService.approve(id);

  response.status(200).json({
    organization,
  });
}

export async function rejectOrganization(request: Request, response: Response) {
  const { id } = organizationParamsSchema.parse(request.params);

  const organization = await organizationService.reject(id);

  response.status(200).json({
    organization,
  });
}
