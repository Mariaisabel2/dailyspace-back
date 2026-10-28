import express, { Application, Request, Response } from "express";
import cors from "cors";
import { ENV } from "./config/env.js";

const app: Application = express();

// Middlewares globales
app.use(
  cors({
    origin: [ENV.FRONTEND_URL, "http://localhost:3000", "https://dailyspace-front.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());

// Endpoint de verificación de salud de la API
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    service: "DailySpace API",
    timestamp: new Date().toISOString(),
  });
});

// Ruta raíz informativa
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    name: "DailySpace API REST",
    version: "1.0.0",
    docs: "/api",
    status: "online",
  });
});

export default app;
