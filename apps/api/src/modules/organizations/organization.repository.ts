import { prisma } from "../../database/prisma.js";

const organizationInclude = {
  usuario: {
    select: {
      idUsuario: true,
      nome: true,
      email: true,
      status: true,
    },
  },
} as const;

export const organizationRepository = {
  findPending() {
    return prisma.ong.findMany({
      where: {
        statusVerificacao: "PENDENTE",
      },

      include: organizationInclude,

      orderBy: {
        idOng: "asc",
      },
    });
  },

  findById(idOng: number) {
    return prisma.ong.findUnique({
      where: {
        idOng,
      },

      include: organizationInclude,
    });
  },

  approve(idOng: number) {
    return prisma.ong.update({
      where: {
        idOng,
      },

      data: {
        statusVerificacao: "APROVADA",
      },

      include: organizationInclude,
    });
  },

  reject(idOng: number) {
    return prisma.ong.update({
      where: {
        idOng,
      },

      data: {
        statusVerificacao: "REJEITADA",
      },

      include: organizationInclude,
    });
  },
};
