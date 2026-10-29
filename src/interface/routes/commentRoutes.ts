import { Router } from "express";
import { CommentController } from "../controllers/CommentController.js";
import { PrismaCommentRepository } from "../../infrastructure/repositories/PrismaCommentRepository.js";
import { PrismaPostRepository } from "../../infrastructure/repositories/PrismaPostRepository.js";
import { CreateCommentUseCase } from "../../application/use-cases/comments/CreateCommentUseCase.js";
import { GetMyCommentsUseCase } from "../../application/use-cases/comments/GetMyCommentsUseCase.js";
import { GetAllCommentsUseCase } from "../../application/use-cases/comments/GetAllCommentsUseCase.js";
import { authenticateToken, soloAdmin } from "../middlewares/authMiddleware.js";

const commentRouter = Router();

// Inyección de dependencias
const commentRepository = new PrismaCommentRepository();
const postRepository = new PrismaPostRepository();
const createCommentUseCase = new CreateCommentUseCase(commentRepository, postRepository);
const getMyCommentsUseCase = new GetMyCommentsUseCase(commentRepository);
const getAllCommentsUseCase = new GetAllCommentsUseCase(commentRepository);

const commentController = new CommentController(
  createCommentUseCase,
  getMyCommentsUseCase,
  getAllCommentsUseCase
);

// Endpoints de interacción (Rúbrica)
// 1. POST /api/comments: Usuario autenticado (queda a nombre del usuario del token)
commentRouter.post("/", authenticateToken, commentController.create);

// 2. GET /api/comments/mias: Usuario autenticado (solo las suyas)
commentRouter.get("/mias", authenticateToken, commentController.getMyComments);

// 3. GET /api/comments: Solo admin (todas las interacciones)
commentRouter.get("/", authenticateToken, soloAdmin, commentController.getAll);

export default commentRouter;
