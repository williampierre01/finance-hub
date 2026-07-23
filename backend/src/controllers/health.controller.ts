import { Request, Response } from "express";

export function healthController(_req: Request, res: Response) {
  return res.status(200).json({
    status: "ok",
    message: "FinanceHub API está funcionando 🚀",
    timestamp: new Date().toISOString(),
  });
}

export function errorTestController(_req: Request, res: Response) {
  throw new Error("Erro proposital para testes");
}