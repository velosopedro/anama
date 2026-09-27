declare global {
  namespace Express {
    interface Request {
      auth?: {
        idUsuario: number;

        tipo: "DOADOR" | "FAMILIA" | "ONG" | "ADMIN";
      };
    }
  }
}

export {};
