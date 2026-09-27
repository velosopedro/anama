import type { RequestHandler } from "express";

import { AppError } from "../shared/errors/app-error.js";
import type { UserRole } from "../shared/security/token.js";

export function authorize(...allowedRoles: UserRole[]): RequestHandler {
  return (request, _response, next) => {
    if (!request.auth) {
      next(new AppError("Usuário não autenticado.", 401, "UNAUTHENTICATED"));

      return;
    }

    if (!allowedRoles.includes(request.auth.tipo)) {
      next(
        new AppError(
          "Você não possui permissão para acessar este recurso.",
          403,
          "FORBIDDEN",
        ),
      );

      return;
    }

    next();
  };
}
