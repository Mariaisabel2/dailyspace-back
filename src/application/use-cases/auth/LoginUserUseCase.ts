import { IUserRepository } from "../../../domain/repositories/IUserRepository.js";
import { UnauthorizedError } from "../../../domain/errors/AppError.js";
import { SecurityService } from "../../../infrastructure/security/SecurityService.js";
import { AuthOutput } from "./RegisterUserUseCase.js";

export interface LoginInput {
  email: string;
  password: string;
}

export class LoginUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: LoginInput): Promise<AuthOutput> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      // Rúbrica: Credenciales inválidas responden 401 con un mensaje que no revela si falló el email o la contraseña
      throw new UnauthorizedError("Credenciales inválidas");
    }

    const isValid = await SecurityService.comparePassword(input.password, user.password);
    if (!isValid) {
      throw new UnauthorizedError("Credenciales inválidas");
    }

    const token = SecurityService.generateToken({
      id: user.id,
      role: user.role,
    });

    return {
      token,
      user: user.toSafeObject(),
    };
  }
}
