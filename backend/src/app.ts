import cors from "cors";
import express from "express";

import { errorHandler } from "./middlewares/error.middleware";
import router from "./routes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());

app.use(router);

app.use(errorHandler);

export { app };