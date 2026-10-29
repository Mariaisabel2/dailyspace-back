export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "El recurso ya existe") {
    super(message, 409);
    this.name = "ConflictError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Credenciales inválidas") {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Acceso denegado: permisos insuficientes") {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Recurso no encontrado") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = "Datos de entrada inválidos") {
    super(message, 400);
    this.name = "BadRequestError";
  }
}
