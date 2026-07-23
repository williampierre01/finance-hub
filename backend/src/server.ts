import { app } from "./app";
import { env } from "./config/env";

app.listen(env.port, () => {
  console.log(`🚀 ${env.appName} iniciado`);
  console.log(`🌍 Ambiente: ${env.nodeEnv}`);
  console.log(`📡 Porta: ${env.port}`);
});