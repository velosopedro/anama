import { prisma } from "./prisma.js";

import { DEVELOPMENT_CATALOG } from "../modules/baskets/basket.config.js";

async function seedItems() {
  console.log("Criando catálogo de itens do ANAMÃ...");

  for (const catalogItem of DEVELOPMENT_CATALOG) {
    const existingItem = await prisma.item.findFirst({
      where: {
        nome: catalogItem.nome,
      },
    });

    if (existingItem) {
      await prisma.item.update({
        where: {
          idItem: existingItem.idItem,
        },

        data: {
          categoria: catalogItem.categoria,

          valorMedio: catalogItem.valorMedio,
        },
      });

      continue;
    }

    await prisma.item.create({
      data: {
        nome: catalogItem.nome,
        categoria: catalogItem.categoria,

        valorMedio: catalogItem.valorMedio,
      },
    });
  }

  console.log("Catálogo criado com sucesso.");
}

async function main() {
  await seedItems();
}

main()
  .catch((error) => {
    console.error("Erro ao executar seed:", error);

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
