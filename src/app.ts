import express, { Application, Request, Response } from "express";
import cors from "cors";
import path from "path";
import { ENV } from "./config/env.js";
import authRouter from "./interface/routes/authRoutes.js";
import postRouter from "./interface/routes/postRoutes.js";
import commentRouter from "./interface/routes/commentRoutes.js";
import uploadRouter from "./interface/routes/uploadRoutes.js";
import { errorHandler } from "./interface/middlewares/errorHandler.js";

const app: Application = express();

// Middlewares globales
app.use(
  cors({
    origin: [
      ENV.FRONTEND_URL,
      "http://localhost:3000",
      "https://dailyspace-front.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());

// Servir archivos estáticos subidos (Bono +4 pts)
const uploadsPath = path.resolve(process.cwd(), "uploads");
app.use("/uploads", express.static(uploadsPath));

// Rutas informativas y de salud
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    service: "DailySpace API",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    name: "DailySpace API REST",
    version: "1.0.0",
    docs: {
      auth: "/api/auth",
      posts: "/api/posts",
      comments: "/api/comments",
      upload: "/api/upload",
    },
    status: "online",
  });
});

// Conexión de routers modulares bajo /api
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);
app.use("/api/upload", uploadRouter);

// Ruta no encontrada (404)
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    status: "error",
    statusCode: 404,
    message: "Ruta de la API no encontrada",
  });
});

// Middleware centralizado de errores (debe ir al final de las rutas)
app.use(errorHandler);

export default app;
