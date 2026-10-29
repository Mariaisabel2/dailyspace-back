import { Router } from "express";
import { PostController } from "../controllers/PostController.js";
import { PrismaPostRepository } from "../../infrastructure/repositories/PrismaPostRepository.js";
import { GetPostsUseCase } from "../../application/use-cases/posts/GetPostsUseCase.js";
import { GetPostByIdUseCase } from "../../application/use-cases/posts/GetPostByIdUseCase.js";
import { CreatePostUseCase } from "../../application/use-cases/posts/CreatePostUseCase.js";
import { UpdatePostUseCase } from "../../application/use-cases/posts/UpdatePostUseCase.js";
import { DeletePostUseCase } from "../../application/use-cases/posts/DeletePostUseCase.js";
import { authenticateToken, soloAdmin } from "../middlewares/authMiddleware.js";

const postRouter = Router();

// Inyección de dependencias
const postRepository = new PrismaPostRepository();
const getPostsUseCase = new GetPostsUseCase(postRepository);
const getPostByIdUseCase = new GetPostByIdUseCase(postRepository);
const createPostUseCase = new CreatePostUseCase(postRepository);
const updatePostUseCase = new UpdatePostUseCase(postRepository);
const deletePostUseCase = new DeletePostUseCase(postRepository);

const postController = new PostController(
  getPostsUseCase,
  getPostByIdUseCase,
  createPostUseCase,
  updatePostUseCase,
  deletePostUseCase
);

// Endpoints públicos del catálogo
postRouter.get("/", postController.getAll);
postRouter.get("/:id", postController.getById);

// Endpoints protegidos solo para Administrador (Rúbrica: POST, PUT, DELETE solo admin)
postRouter.post("/", authenticateToken, soloAdmin, postController.create);
postRouter.put("/:id", authenticateToken, soloAdmin, postController.update);
postRouter.delete("/:id", authenticateToken, soloAdmin, postController.delete);

export default postRouter;
