import { jwtVerify, SignJWT } from "jose";

import { env } from "../../config/env.js";
import { AppError } from "../errors/app-error.js";

export type UserRole = "DOADOR" | "FAMILIA" | "ONG" | "ADMIN";

interface CreateTokenInput {
  idUsuario: number;
  tipo: UserRole;
}

const secret = new TextEncoder().encode(env.JWT_SECRET);

export async function createAuthToken({ idUsuario, tipo }: CreateTokenInput) {
  return new SignJWT({
    tipo,
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setSubject(String(idUsuario))
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(secret);
}

export async function verifyAuthToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });

    const idUsuario = Number(payload.sub);
    const tipo = payload.tipo;

    if (!Number.isInteger(idUsuario) || !isUserRole(tipo)) {
      throw new Error("Invalid token payload");
    }

    return {
      idUsuario,
      tipo,
    };
  } catch {
    throw new AppError("Token inválido ou expirado.", 401, "INVALID_TOKEN");
  }
}

function isUserRole(value: unknown): value is UserRole {
  return (
    value === "DOADOR" ||
    value === "FAMILIA" ||
    value === "ONG" ||
    value === "ADMIN"
  );
}
