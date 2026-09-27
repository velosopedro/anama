import { AppError } from "../../shared/errors/app-error.js";

import { organizationRepository } from "./organization.repository.js";

function serializeOrganization(
  organization: NonNullable<
    Awaited<ReturnType<typeof organizationRepository.findById>>
  >,
) {
  return {
    idOng: organization.idOng,

    cnpj: organization.cnpj,

    nomeFantasia: organization.nomeFantasia,

    statusVerificacao: organization.statusVerificacao,

    responsavel: {
      idUsuario: organization.usuario.idUsuario,

      nome: organization.usuario.nome,

      email: organization.usuario.email,

      status: organization.usuario.status,
    },
  };
}

export const organizationService = {
  async listPending() {
    const organizations = await organizationRepository.findPending();

    return organizations.map(serializeOrganization);
  },

  async approve(idOng: number) {
    const organization = await organizationRepository.findById(idOng);

    if (!organization) {
      throw new AppError("ONG não encontrada.", 404, "ORGANIZATION_NOT_FOUND");
    }

    if (organization.statusVerificacao === "APROVADA") {
      throw new AppError(
        "Esta ONG já está aprovada.",
        409,
        "ORGANIZATION_ALREADY_APPROVED",
      );
    }

    const updated = await organizationRepository.approve(idOng);

    return serializeOrganization(updated);
  },

  async reject(idOng: number) {
    const organization = await organizationRepository.findById(idOng);

    if (!organization) {
      throw new AppError("ONG não encontrada.", 404, "ORGANIZATION_NOT_FOUND");
    }

    if (organization.statusVerificacao === "REJEITADA") {
      throw new AppError(
        "Esta ONG já está rejeitada.",
        409,
        "ORGANIZATION_ALREADY_REJECTED",
      );
    }

    const updated = await organizationRepository.reject(idOng);

    return serializeOrganization(updated);
  },
};
