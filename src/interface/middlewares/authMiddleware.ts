import { Request, Response, NextFunction } from "express";
import { SecurityService, TokenPayload } from "../../infrastructure/security/SecurityService.js";
import { UnauthorizedError, ForbiddenError } from "../../domain/errors/AppError.js";

// Extender la interfaz Request de Express para incluir el usuario autenticado
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/**
 * Middleware centralizado de autenticación.
 * Lee Authorization: Bearer <token>, lo verifica y deja el usuario disponible en req.user.
 * Sin token o token inválido/expirado -> responde 401.
 */
export function authenticateToken(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    throw new UnauthorizedError("Token de autorización no proporcionado");
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    throw new UnauthorizedError("Formato de token inválido. Debe ser: Bearer <token>");
  }

  const token = parts[1];
  try {
    const payload = SecurityService.verifyToken(token);
    req.user = payload;
    next();
  } catch (_error) {
    throw new UnauthorizedError("Token inválido o expirado");
  }
}

/**
 * Middleware de rol centralizado (ej. soloAdmin).
 * Valida que el usuario autenticado tenga el rol requerido.
 * Token válido pero sin permiso -> responde 403 Forbidden.
 */
export function requireRole(allowedRole: "admin" | "user") {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError("Autenticación requerida");
    }

    if (req.user.role !== allowedRole) {
      throw new ForbiddenError(
        `Acceso restringido: se requiere rol de ${allowedRole}`
      );
    }

    next();
  };
}

export const soloAdmin = requireRole("admin");
