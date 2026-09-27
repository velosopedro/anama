import { prisma } from "../../database/prisma.js";

const basketInclude = {
  familia: {
    select: {
      codigoPublico: true,
    },
  },

  itens: {
    include: {
      item: true,
    },
  },
} as const;

export const basketRepository = {
  findActive() {
    return prisma.cesta.findMany({
      where: {
        status: "EM_MONTAGEM",
      },

      include: basketInclude,

      orderBy: {
        createdAt: "desc",
      },
    });
  },

  findById(idCesta: number) {
    return prisma.cesta.findUnique({
      where: {
        idCesta,
      },

      include: basketInclude,
    });
  },

  sumConfirmedDonations(idCesta: number) {
    return prisma.doacao.aggregate({
      where: {
        idCesta,
        status: "CONFIRMADA",
      },

      _sum: {
        valorTotal: true,
      },
    });
  },

  findCatalogItems() {
    return prisma.item.findMany({
      orderBy: {
        nome: "asc",
      },
    });
  },

  findItemsByNames(names: string[]) {
    return prisma.item.findMany({
      where: {
        nome: {
          in: names,
        },
      },
    });
  },

  findItemsByIds(ids: number[]) {
    return prisma.item.findMany({
      where: {
        idItem: {
          in: ids,
        },
      },
    });
  },

  createAidBasket(
    idFamilia: number,
    valorEstimado: number,
    items: Array<{
      idItem: number;
      quantidadeNecessaria: number;
    }>,
  ) {
    return prisma.cesta.create({
      data: {
        idFamilia,
        valorEstimado,

        itens: {
          create: items.map((item) => ({
            idItem: item.idItem,

            quantidadeNecessaria: item.quantidadeNecessaria,
          })),
        },
      },

      include: basketInclude,
    });
  },
};
