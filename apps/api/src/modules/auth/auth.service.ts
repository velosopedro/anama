import { randomUUID } from "node:crypto";

import { AppError } from "../../shared/errors/app-error.js";
import {
  comparePassword,
  hashPassword,
} from "../../shared/security/password.js";
import { createAuthToken, type UserRole } from "../../shared/security/token.js";

import { authRepository } from "./auth.repository.js";

import type { LoginInput, RegisterInput } from "./auth.schema.js";

function toPublicUser(user: {
  idUsuario: number;
  nome: string;
  email: string;
  tipo: string;
  status: string;

  familia: {
    idFamilia: number;
    codigoPublico: string;
    numeroIntegrantes: number;
    status: string;
  } | null;

  ong: {
    idOng: number;
    cnpj: string;
    nomeFantasia: string;
    statusVerificacao: string;
  } | null;
}) {
  return {
    idUsuario: user.idUsuario,
    nome: user.nome,
    email: user.email,
    tipo: user.tipo,
    status: user.status,

    familia: user.familia
      ? {
          idFamilia: user.familia.idFamilia,

          codigoPublico: user.familia.codigoPublico,

          numeroIntegrantes: user.familia.numeroIntegrantes,

          status: user.familia.status,
        }
      : null,

    ong: user.ong
      ? {
          idOng: user.ong.idOng,
          cnpj: user.ong.cnpj,
          nomeFantasia: user.ong.nomeFantasia,

          statusVerificacao: user.ong.statusVerificacao,
        }
      : null,
  };
}

export const authService = {
  async register(input: RegisterInput) {
    const existingUser = await authRepository.findUserByEmail(input.email);

    if (existingUser) {
      throw new AppError("E-mail já cadastrado.", 409, "EMAIL_ALREADY_EXISTS");
    }

    if (input.tipo === "ONG") {
      const existingOrganization = await authRepository.findOrganizationByCnpj(
        input.cnpj,
      );

      if (existingOrganization) {
        throw new AppError("CNPJ já cadastrado.", 409, "CNPJ_ALREADY_EXISTS");
      }
    }

    const senhaHash = await hashPassword(input.senha);

    let user;

    switch (input.tipo) {
      case "DOADOR":
        user = await authRepository.createDonor({
          nome: input.nome,
          email: input.email,
          senhaHash,
        });

        break;

      case "FAMILIA":
        user = await authRepository.createFamily({
          nome: input.nome,
          email: input.email,
          senhaHash,

          numeroIntegrantes: input.numeroIntegrantes,

          codigoPublico: randomUUID(),
        });

        break;

      case "ONG":
        user = await authRepository.createOrganization({
          nome: input.nome,
          email: input.email,
          senhaHash,
          cnpj: input.cnpj,

          nomeFantasia: input.nomeFantasia,
        });

        break;
    }

    const token = await createAuthToken({
      idUsuario: user.idUsuario,
      tipo: user.tipo as UserRole,
    });

    return {
      token,
      user: toPublicUser(user),
    };
  },

  async login(input: LoginInput) {
    const user = await authRepository.findUserByEmail(input.email);

    if (!user) {
      throw new AppError(
        "E-mail ou senha inválidos.",
        401,
        "INVALID_CREDENTIALS",
      );
    }

    const passwordMatches = await comparePassword(input.senha, user.senhaHash);

    if (!passwordMatches) {
      throw new AppError(
        "E-mail ou senha inválidos.",
        401,
        "INVALID_CREDENTIALS",
      );
    }

    if (user.status !== "ATIVO") {
      throw new AppError("Esta conta não está ativa.", 403, "USER_NOT_ACTIVE");
    }

    const token = await createAuthToken({
      idUsuario: user.idUsuario,
      tipo: user.tipo as UserRole,
    });

    return {
      token,
      user: toPublicUser(user),
    };
  },

  async me(idUsuario: number) {
    const user = await authRepository.findUserById(idUsuario);

    if (!user) {
      throw new AppError("Usuário não encontrado.", 404, "USER_NOT_FOUND");
    }

    return toPublicUser(user);
  },
};
