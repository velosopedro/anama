import type { RequestHandler } from "express";

export const notFound: RequestHandler = (request, response) => {
  response.status(404).json({
    error: {
      code: "ROUTE_NOT_FOUND",
      message: `Rota ${request.method} ${request.originalUrl} não encontrada.`,
    },
  });
};
