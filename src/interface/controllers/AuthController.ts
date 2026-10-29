import { Request, Response, NextFunction } from "express";
import { RegisterUserUseCase } from "../../application/use-cases/auth/RegisterUserUseCase.js";
import { LoginUserUseCase } from "../../application/use-cases/auth/LoginUserUseCase.js";
import { registerSchema, loginSchema } from "../dtos/authDTO.js";
import { BadRequestError } from "../../domain/errors/AppError.js";

export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase
  ) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validation = registerSchema.safeParse(req.body);
      if (!validation.success) {
        const firstError = validation.error.errors[0]?.message || "Datos de entrada inválidos";
        throw new BadRequestError(firstError);
      }

      const result = await this.registerUserUseCase.execute(validation.data);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validation = loginSchema.safeParse(req.body);
      if (!validation.success) {
        const firstError = validation.error.errors[0]?.message || "Credenciales inválidas";
        throw new BadRequestError(firstError);
      }

      const result = await this.loginUserUseCase.execute(validation.data);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
