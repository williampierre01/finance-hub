import express from "express";
import routes from "./routes";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(express.json());

app.use(routes);

// Middleware de tratamento de erros (sempre após as rotas)
app.use(errorHandler);

export { app };