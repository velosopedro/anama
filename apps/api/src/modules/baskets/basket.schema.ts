import { z } from "zod";

export const aidRequestSchema = z.object({
  itensAdicionais: z
    .array(
      z.object({
        idItem: z.coerce.number().int().positive(),

        quantidade: z.coerce.number().int().positive(),
      }),
    )
    .default([]),
});

export type AidRequestInput = z.infer<typeof aidRequestSchema>;
