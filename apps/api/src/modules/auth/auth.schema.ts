import { z } from "zod";

import { formatCnpj, isValidCnpj } from "../../shared/utils/cnpj.js";

const commonFields = {
  nome: z.string().trim().min(2).max(100),

  email: z.string().trim().toLowerCase().email().max(150),

  senha: z.string().min(8).max(72),
};

export const registerSchema = z.discriminatedUnion("tipo", [
  z.object({
    ...commonFields,

    tipo: z.literal("DOADOR"),
  }),

  z.object({
    ...commonFields,

    tipo: z.literal("FAMILIA"),

    numeroIntegrantes: z.coerce.number().int().positive(),
  }),

  z.object({
    ...commonFields,

    tipo: z.literal("ONG"),

    nomeFantasia: z.string().trim().min(2).max(120),

    cnpj: z
      .string()
      .trim()
      .refine(isValidCnpj, {
        message: "CNPJ inválido.",
      })
      .transform(formatCnpj),
  }),
]);

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),

  senha: z.string().min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export type LoginInput = z.infer<typeof loginSchema>;
