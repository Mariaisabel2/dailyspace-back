import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { AppError } from "../../domain/errors/AppError.js";

/**
 * Middleware centralizado de manejo global de errores.
 * Rúbrica:
 * - Validaciones de body, params y query con 400; 404 cuando no existe; 409 conflicto.
 * - Errores de Prisma capturados.
 * - Sin stack trace en las respuestas.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // 1. Errores personalizados de la aplicación (AppError: 400, 401, 403, 404, 409)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: "error",
      statusCode: err.statusCode,
      message: err.message,
    });
    return;
  }

  // 2. Errores conocidos de Prisma Client
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002: Violación de restricción única (ej. email duplicado)
    if (err.code === "P2002") {
      const target = Array.isArray(err.meta?.target)
        ? (err.meta?.target as string[]).join(", ")
        : "campo único";
      res.status(409).json({
        status: "error",
        statusCode: 409,
        message: `Conflicto de unicidad: el valor para ${target} ya está registrado`,
      });
      return;
    }

    // P2025: Registro no encontrado para actualizar o eliminar
    if (err.code === "P2025") {
      res.status(404).json({
        status: "error",
        statusCode: 404,
        message: "El registro solicitado no fue encontrado en la base de datos",
      });
      return;
    }

    // P2003: Violación de llave foránea
    if (err.code === "P2003") {
      res.status(400).json({
        status: "error",
        statusCode: 400,
        message: "Referencia de llave foránea inválida o inexistente",
      });
      return;
    }
  }

  // 3. Error de validación de sintaxis JSON en Express
  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({
      status: "error",
      statusCode: 400,
      message: "Formato de cuerpo JSON inválido",
    });
    return;
  }

  // 4. Errores no controlados (500 Internal Server Error) sin stack trace expuesto
  console.error("❌ Error no controlado en el servidor:", err.message);
  res.status(500).json({
    status: "error",
    statusCode: 500,
    message: "Error interno del servidor",
  });
}
