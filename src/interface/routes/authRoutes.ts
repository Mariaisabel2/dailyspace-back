import { Router } from "express";
import { AuthController } from "../controllers/AuthController.js";
import { PrismaUserRepository } from "../../infrastructure/repositories/PrismaUserRepository.js";
import { RegisterUserUseCase } from "../../application/use-cases/auth/RegisterUserUseCase.js";
import { LoginUserUseCase } from "../../application/use-cases/auth/LoginUserUseCase.js";

const authRouter = Router();

// Inyección de dependencias
const userRepository = new PrismaUserRepository();
const registerUserUseCase = new RegisterUserUseCase(userRepository);
const loginUserUseCase = new LoginUserUseCase(userRepository);
const authController = new AuthController(registerUserUseCase, loginUserUseCase);

// Endpoints públicos de autenticación
authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);

export default authRouter;
