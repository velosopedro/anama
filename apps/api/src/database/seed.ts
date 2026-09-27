import { prisma } from "./prisma.js";

import { DEVELOPMENT_CATALOG } from "../modules/baskets/basket.config.js";
import { hashPassword } from "../shared/security/password.js";

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

async function seedAdmin() {
  const adminName = process.env.ADMIN_NAME;

  const adminEmail = process.env.ADMIN_EMAIL;

  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminName || !adminEmail || !adminPassword) {
    console.log(
      "ADMIN não configurado no .env. Pulando criação do administrador.",
    );

    return;
  }

  const existingAdmin = await prisma.usuario.findUnique({
    where: {
      email: adminEmail,
    },
  });

  if (existingAdmin) {
    console.log("Administrador já cadastrado.");

    return;
  }

  const senhaHash = await hashPassword(adminPassword);

  await prisma.usuario.create({
    data: {
      nome: adminName,
      email: adminEmail,
      senhaHash,
      tipo: "ADMIN",
      status: "ATIVO",
    },
  });

  console.log("Administrador criado com sucesso.");
}

async function main() {
  await seedItems();
  await seedAdmin();
}

main()
  .catch((error) => {
    console.error("Erro ao executar seed:", error);

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
