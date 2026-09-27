import { randomUUID } from "node:crypto";

import { prisma } from "./prisma.js";

import { hashPassword } from "../shared/security/password.js";

const DEMO_PASSWORD = "AnamaDemo123!";

async function createDonor() {
  const email = "doador.demo@anama.local";

  const existing = await prisma.usuario.findUnique({
    where: {
      email,
    },
  });

  if (existing) {
    console.log("Doador de demonstração já existe.");

    return;
  }

  const senhaHash = await hashPassword(DEMO_PASSWORD);

  await prisma.usuario.create({
    data: {
      nome: "Doador Demonstração",
      email,
      senhaHash,
      tipo: "DOADOR",
      status: "ATIVO",
    },
  });

  console.log("Doador de demonstração criado.");
}

async function createFamily() {
  const email = "familia.demo@anama.local";

  const existing = await prisma.usuario.findUnique({
    where: {
      email,
    },
  });

  if (existing) {
    console.log("Família de demonstração já existe.");

    return;
  }

  const senhaHash = await hashPassword(DEMO_PASSWORD);

  await prisma.usuario.create({
    data: {
      nome: "Família Demonstração",
      email,
      senhaHash,
      tipo: "FAMILIA",
      status: "ATIVO",

      familia: {
        create: {
          codigoPublico: randomUUID(),

          numeroIntegrantes: 4,

          status: "ATIVA",
        },
      },
    },
  });

  console.log("Família de demonstração criada.");
}

async function createOrganization() {
  const email = "ong.demo@anama.local";

  const existing = await prisma.usuario.findUnique({
    where: {
      email,
    },
  });

  if (existing) {
    console.log("ONG de demonstração já existe.");

    return;
  }

  const senhaHash = await hashPassword(DEMO_PASSWORD);

  await prisma.usuario.create({
    data: {
      nome: "Responsável ONG Demo",
      email,
      senhaHash,
      tipo: "ONG",
      status: "ATIVO",

      ong: {
        create: {
          cnpj: "12.345.678/0001-95",

          nomeFantasia: "Instituto ANAMÃ Demo",

          statusVerificacao: "PENDENTE",
        },
      },
    },
  });

  console.log("ONG de demonstração criada.");
}

async function main() {
  console.log("Criando usuários de demonstração...");

  await createDonor();
  await createFamily();
  await createOrganization();

  console.log("Usuários de demonstração criados com sucesso.");
}

main()
  .catch((error) => {
    console.error("Erro ao criar dados de demonstração:", error);

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
