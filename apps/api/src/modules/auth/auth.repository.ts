import { prisma } from "../../database/prisma.js";

interface BaseUserData {
  nome: string;
  email: string;
  senhaHash: string;
}

interface FamilyData extends BaseUserData {
  numeroIntegrantes: number;
  codigoPublico: string;
}

interface OrganizationData extends BaseUserData {
  cnpj: string;
  nomeFantasia: string;
}

const profileInclude = {
  familia: true,
  ong: true,
} as const;

export const authRepository = {
  findUserByEmail(email: string) {
    return prisma.usuario.findUnique({
      where: {
        email,
      },
      include: profileInclude,
    });
  },

  findUserById(idUsuario: number) {
    return prisma.usuario.findUnique({
      where: {
        idUsuario,
      },
      include: profileInclude,
    });
  },

  findOrganizationByCnpj(cnpj: string) {
    return prisma.ong.findUnique({
      where: {
        cnpj,
      },
    });
  },

  createDonor(data: BaseUserData) {
    return prisma.usuario.create({
      data: {
        nome: data.nome,
        email: data.email,
        senhaHash: data.senhaHash,
        tipo: "DOADOR",
      },
      include: profileInclude,
    });
  },

  createFamily(data: FamilyData) {
    return prisma.usuario.create({
      data: {
        nome: data.nome,
        email: data.email,
        senhaHash: data.senhaHash,
        tipo: "FAMILIA",

        familia: {
          create: {
            codigoPublico: data.codigoPublico,
            numeroIntegrantes: data.numeroIntegrantes,
          },
        },
      },
      include: profileInclude,
    });
  },

  createOrganization(data: OrganizationData) {
    return prisma.usuario.create({
      data: {
        nome: data.nome,
        email: data.email,
        senhaHash: data.senhaHash,
        tipo: "ONG",

        ong: {
          create: {
            cnpj: data.cnpj,
            nomeFantasia: data.nomeFantasia,
          },
        },
      },
      include: profileInclude,
    });
  },
};
