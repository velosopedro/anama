import { app } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./database/prisma.js";

async function bootstrap() {
  try {
    await prisma.$connect();

    const server = app.listen(env.PORT, () => {
      console.log(`ANAMÃ API executando em http://localhost:${env.PORT}`);
    });

    const shutdown = async () => {
      console.log("Encerrando ANAMÃ API...");

      server.close(async () => {
        await prisma.$disconnect();

        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error("Não foi possível iniciar a ANAMÃ API.", error);

    await prisma.$disconnect();

    process.exit(1);
  }
}

void bootstrap();
