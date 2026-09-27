import type { ErrorRequestHandler } from "express";

import { ZodError } from "zod";

import { AppError } from "../shared/errors/app-error.js";

export const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next,
) => {
  if (error instanceof ZodError) {
    response.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Dados inválidos.",

        details: error.issues.map((issue) => ({
          field: issue.path.join("."),

          message: issue.message,
        })),
      },
    });

    return;
  }

  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
      },
    });

    return;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  ) {
    response.status(409).json({
      error: {
        code: "UNIQUE_CONSTRAINT_VIOLATION",

        message: "Já existe um registro com esses dados.",
      },
    });

    return;
  }

  console.error(error);

  response.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",

      message: "Ocorreu um erro interno no servidor.",
    },
  });
};
