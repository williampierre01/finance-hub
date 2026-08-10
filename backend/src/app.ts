import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import { env } from "./config/env";
import { errorHandler } from "./middlewares/error.middleware";
import router from "./routes";

const app = express();

app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use(router);

app.use(errorHandler);

export { app };