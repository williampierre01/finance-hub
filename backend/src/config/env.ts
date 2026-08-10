import dotenv from "dotenv";

dotenv.config();

export const env = {
  appName:
    process.env.APP_NAME ?? "FinanceHub",

  port:
    Number(process.env.PORT) || 3001,

  nodeEnv:
    process.env.NODE_ENV ?? "development",

  corsOrigin:
    process.env.CORS_ORIGIN ??
    "http://localhost:3000",

  jwtExpiresIn:
    process.env.JWT_EXPIRES_IN ?? "1d",

  isProduction:
    process.env.NODE_ENV === "production",
};