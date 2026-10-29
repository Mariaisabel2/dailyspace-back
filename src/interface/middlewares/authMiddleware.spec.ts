import { describe, it, expect, vi } from "vitest";
import { Request, Response, NextFunction } from "express";
import { authenticateToken, requireRole } from "./authMiddleware.js";
import { SecurityService } from "../../infrastructure/security/SecurityService.js";
import { UnauthorizedError, ForbiddenError } from "../../domain/errors/AppError.js";

describe("Middlewares de Autenticación y Autorización (Bono +3 pts)", () => {
  describe("authenticateToken", () => {
    it("debe lanzar 401 si no se envía el header Authorization", () => {
      const req = { headers: {} } as Request;
      const res = {} as Response;
      const next = vi.fn() as unknown as NextFunction;

      expect(() => authenticateToken(req, res, next)).toThrowError(UnauthorizedError);
      expect(() => authenticateToken(req, res, next)).toThrowError(
        "Token de autorización no proporcionado"
      );
      expect(next).not.toHaveBeenCalled();
    });

    it("debe lanzar 401 si el formato del token no es Bearer <token>", () => {
      const req = { headers: { authorization: "Basic token_invalido" } } as unknown as Request;
      const res = {} as Response;
      const next = vi.fn() as unknown as NextFunction;

      expect(() => authenticateToken(req, res, next)).toThrowError(UnauthorizedError);
      expect(() => authenticateToken(req, res, next)).toThrowError(
        "Formato de token inválido. Debe ser: Bearer <token>"
      );
      expect(next).not.toHaveBeenCalled();
    });

    it("debe lanzar 401 si el token JWT es inválido o expiró", () => {
      const req = { headers: { authorization: "Bearer token_falso_invalido" } } as unknown as Request;
      const res = {} as Response;
      const next = vi.fn() as unknown as NextFunction;

      expect(() => authenticateToken(req, res, next)).toThrowError(UnauthorizedError);
      expect(() => authenticateToken(req, res, next)).toThrowError("Token inválido o expirado");
      expect(next).not.toHaveBeenCalled();
    });

    it("debe llamar a next() y adjuntar req.user si el token es válido", () => {
      // Generar token válido con SecurityService
      const validToken = SecurityService.generateToken({ id: 1, role: "admin" });
      const req = { headers: { authorization: `Bearer ${validToken}` } } as unknown as Request;
      const res = {} as Response;
      const next = vi.fn() as unknown as NextFunction;

      authenticateToken(req, res, next);

      expect(req.user).toBeDefined();
      expect(req.user?.id).toBe(1);
      expect(req.user?.role).toBe("admin");
      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  describe("requireRole (Control de Rol)", () => {
    it("debe lanzar 401 si req.user no existe", () => {
      const req = {} as Request;
      const res = {} as Response;
      const next = vi.fn() as unknown as NextFunction;
      const roleMiddleware = requireRole("admin");

      expect(() => roleMiddleware(req, res, next)).toThrowError(UnauthorizedError);
      expect(next).not.toHaveBeenCalled();
    });

    it("debe lanzar 403 Forbidden si el usuario regular intenta acceder a ruta admin", () => {
      const req = { user: { id: 2, role: "user" } } as unknown as Request;
      const res = {} as Response;
      const next = vi.fn() as unknown as NextFunction;
      const soloAdmin = requireRole("admin");

      expect(() => soloAdmin(req, res, next)).toThrowError(ForbiddenError);
      expect(() => soloAdmin(req, res, next)).toThrowError(
        "Acceso restringido: se requiere rol de admin"
      );
      expect(next).not.toHaveBeenCalled();
    });

    it("debe permitir el acceso (llamar a next) si el usuario tiene rol admin", () => {
      const req = { user: { id: 1, role: "admin" } } as unknown as Request;
      const res = {} as Response;
      const next = vi.fn() as unknown as NextFunction;
      const soloAdmin = requireRole("admin");

      soloAdmin(req, res, next);
      expect(next).toHaveBeenCalledTimes(1);
    });
  });
});
