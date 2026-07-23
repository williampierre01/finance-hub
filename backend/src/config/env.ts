import dotenv from "dotenv";

dotenv.config();

export const env = {
  appName: process.env.APP_NAME ?? "FinanceHub",
  port: Number(process.env.PORT) || 3001,
  nodeEnv: process.env.NODE_ENV ?? "development",
};