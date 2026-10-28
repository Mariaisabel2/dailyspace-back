import app from "./app.js";
import { ENV } from "./config/env.js";

const server = app.listen(ENV.PORT, () => {
  console.log(`✨ DailySpace Backend corriendo en el puerto ${ENV.PORT}`);
  console.log(`📡 Entorno: ${ENV.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${ENV.PORT}/health`);
});

// Manejo de apagado controlado
process.on("SIGTERM", () => {
  console.log("Cerrando servidor HTTP ordenadamente...");
  server.close(() => {
    console.log("Servidor cerrado.");
  });
});
