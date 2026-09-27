import { prisma } from "../../database/prisma.js";

export const familyRepository = {
  findByUserId(idUsuario: number) {
    return prisma.familia.findUnique({
      where: {
        idUsuario,
      },

      include: {
        endereco: true,

        cestas: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  },

  findActiveBasket(idFamilia: number) {
    return prisma.cesta.findFirst({
      where: {
        idFamilia,

        status: {
          in: ["EM_MONTAGEM", "CONCLUIDA"],
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  },
};
