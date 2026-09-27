import type { RequestHandler } from "express";

import { AppError } from "../shared/errors/app-error.js";
import { verifyAuthToken } from "../shared/security/token.js";

export const authenticate: RequestHandler = async (
  request,
  _response,
  next,
) => {
  const authorization = request.headers.authorization;

  if (!authorization) {
    next(
      new AppError(
        "Token de autenticação não informado.",
        401,
        "AUTH_TOKEN_MISSING",
      ),
    );

    return;
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    next(
      new AppError(
        "Formato do token inválido.",
        401,
        "INVALID_AUTHORIZATION_HEADER",
      ),
    );

    return;
  }

  try {
    request.auth = await verifyAuthToken(token);

    next();
  } catch (error) {
    next(error);
  }
};
