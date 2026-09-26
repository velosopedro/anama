import "dotenv/config";

import cors from "cors";
import express from "express";
import helmet from "helmet";

const app = express();

const PORT = Number(process.env.PORT) || 3333;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", (_request, response) => {
  return response.status(200).json({
    status: "ok",
    application: "ANAMÃ API",
  });
});

app.listen(PORT, () => {
  console.log(`ANAMÃ API executando na porta ${PORT}`);
});
