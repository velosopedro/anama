import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce.number().int().positive().default(3333),

  DATABASE_URL: z.string().min(1),

  JWT_SECRET: z.string().min(32),

  CORS_ORIGIN: z.string().url(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Variáveis de ambiente inválidas:");
  console.error(z.treeifyError(parsedEnv.error));

  process.exit(1);
}

export const env = parsedEnv.data;
