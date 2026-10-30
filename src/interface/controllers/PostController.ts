import { Request, Response, NextFunction } from "express";
import { GetPostsUseCase } from "../../application/use-cases/posts/GetPostsUseCase.js";
import { GetPostByIdUseCase } from "../../application/use-cases/posts/GetPostByIdUseCase.js";
import { CreatePostUseCase } from "../../application/use-cases/posts/CreatePostUseCase.js";
import { UpdatePostUseCase } from "../../application/use-cases/posts/UpdatePostUseCase.js";
import { DeletePostUseCase } from "../../application/use-cases/posts/DeletePostUseCase.js";
import { IncrementLikesUseCase } from "../../application/use-cases/posts/IncrementLikesUseCase.js";
import { PrismaUserRepository } from "../../infrastructure/repositories/PrismaUserRepository.js";
import {
  getPostsQuerySchema,
  postIdParamSchema,
  createPostSchema,
  updatePostSchema,
} from "../dtos/postDTO.js";
import { BadRequestError } from "../../domain/errors/AppError.js";

export class PostController {
  constructor(
    private readonly getPostsUseCase: GetPostsUseCase,
    private readonly getPostByIdUseCase: GetPostByIdUseCase,
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly updatePostUseCase: UpdatePostUseCase,
    private readonly deletePostUseCase: DeletePostUseCase,
    private readonly incrementLikesUseCase?: IncrementLikesUseCase
  ) {}

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const queryValidation = getPostsQuerySchema.safeParse(req.query);
      if (!queryValidation.success) {
        throw new BadRequestError(
          queryValidation.error.errors[0]?.message || "Parámetros de consulta inválidos"
        );
      }

      const result = await this.getPostsUseCase.execute(queryValidation.data);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const paramValidation = postIdParamSchema.safeParse(req.params);
      if (!paramValidation.success) {
        throw new BadRequestError("ID de publicación inválido");
      }

      const post = await this.getPostByIdUseCase.execute(paramValidation.data.id);
      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bodyValidation = createPostSchema.safeParse(req.body);
      if (!bodyValidation.success) {
        throw new BadRequestError(
          bodyValidation.error.errors[0]?.message || "Datos de entrada inválidos"
        );
      }

      let author = "mariaisabel";
      if (req.user) {
        const userRepo = new PrismaUserRepository();
        const userFound = await userRepo.findById(req.user.id);
        author = userFound ? userFound.name : `user_${req.user.id}`;
      }

      const newPost = await this.createPostUseCase.execute({
        author,
        ...bodyValidation.data,
      });

      res.status(201).json(newPost);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const paramValidation = postIdParamSchema.safeParse(req.params);
      if (!paramValidation.success) {
        throw new BadRequestError("ID de publicación inválido");
      }

      const bodyValidation = updatePostSchema.safeParse(req.body);
      if (!bodyValidation.success) {
        throw new BadRequestError("Datos de actualización inválidos");
      }

      const updated = await this.updatePostUseCase.execute(
        paramValidation.data.id,
        bodyValidation.data
      );

      res.status(200).json(updated);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const paramValidation = postIdParamSchema.safeParse(req.params);
      if (!paramValidation.success) {
        throw new BadRequestError("ID de publicación inválido");
      }

      await this.deletePostUseCase.execute(paramValidation.data.id);
      res.status(200).json({ message: "Publicación eliminada correctamente" });
    } catch (error) {
      next(error);
    }
  };

  like = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const paramValidation = postIdParamSchema.safeParse(req.params);
      if (!paramValidation.success) {
        throw new BadRequestError("ID de publicación inválido");
      }

      if (!this.incrementLikesUseCase) {
        throw new BadRequestError("Funcionalidad de likes no configurada");
      }

      const likes = await this.incrementLikesUseCase.execute(paramValidation.data.id);
      res.status(200).json({ likes });
    } catch (error) {
      next(error);
    }
  };
}
