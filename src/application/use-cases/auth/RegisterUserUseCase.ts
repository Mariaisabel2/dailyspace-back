import { IUserRepository } from "../../../domain/repositories/IUserRepository.js";
import { ConflictError } from "../../../domain/errors/AppError.js";
import { SecurityService } from "../../../infrastructure/security/SecurityService.js";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface AuthOutput {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: "admin" | "user";
  };
}

export class RegisterUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: RegisterInput): Promise<AuthOutput> {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) {
      // Rúbrica: Registrar un email ya existente responde 409
      throw new ConflictError("El correo electrónico ya está registrado");
    }

    const passwordHash = await SecurityService.hashPassword(input.password);
    const user = await this.userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: "user",
    });

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
