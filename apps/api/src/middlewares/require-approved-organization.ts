import type { RequestHandler } from "express";

import { prisma } from "../database/prisma.js";
import { AppError } from "../shared/errors/app-error.js";

export const requireApprovedOrganization: RequestHandler = async (
  request,
  _response,
  next,
) => {
  if (!request.auth) {
    next(new AppError("Usuário não autenticado.", 401, "UNAUTHENTICATED"));

    return;
  }

  if (request.auth.tipo !== "ONG") {
    next(
      new AppError(
        "Este recurso é exclusivo para ONGs.",
        403,
        "ORGANIZATION_ONLY",
      ),
    );

    return;
  }

  try {
    const organization = await prisma.ong.findUnique({
      where: {
        idUsuario: request.auth.idUsuario,
      },
    });

    if (!organization) {
      next(
        new AppError(
          "Perfil da ONG não encontrado.",
          404,
          "ORGANIZATION_NOT_FOUND",
        ),
      );

      return;
    }

    if (organization.statusVerificacao !== "APROVADA") {
      next(
        new AppError(
          "A ONG ainda não possui homologação para acessar este recurso.",
          403,
          "ORGANIZATION_NOT_APPROVED",
        ),
      );

      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};
