import { PrismaClient } from "@prisma/client";

/**
 * Instancia centralizada del cliente de Prisma.
 * Siguiendo la arquitectura en 4 capas y la rúbrica de clase,
 * Prisma vive exclusivamente dentro de infrastructure/.
 */
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
});

export default prisma;
