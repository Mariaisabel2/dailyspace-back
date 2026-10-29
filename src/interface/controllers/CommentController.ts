import { Request, Response, NextFunction } from "express";
import { CreateCommentUseCase } from "../../application/use-cases/comments/CreateCommentUseCase.js";
import { GetMyCommentsUseCase } from "../../application/use-cases/comments/GetMyCommentsUseCase.js";
import { GetAllCommentsUseCase } from "../../application/use-cases/comments/GetAllCommentsUseCase.js";
import { createCommentSchema } from "../dtos/commentDTO.js";
import { BadRequestError, UnauthorizedError } from "../../domain/errors/AppError.js";

export class CommentController {
  constructor(
    private readonly createCommentUseCase: CreateCommentUseCase,
    private readonly getMyCommentsUseCase: GetMyCommentsUseCase,
    private readonly getAllCommentsUseCase: GetAllCommentsUseCase
  ) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Usuario no autenticado");
      }

      const validation = createCommentSchema.safeParse(req.body);
      if (!validation.success) {
        throw new BadRequestError(
          validation.error.errors[0]?.message || "Datos de comentario inválidos"
        );
      }

      // Rúbrica: El id del usuario que crea una interacción se toma del token, nunca del body
      const comment = await this.createCommentUseCase.execute({
        content: validation.data.content,
        postId: validation.data.postId,
        userId: req.user.id,
      });

      res.status(201).json(comment);
    } catch (error) {
      next(error);
    }
  };

  getMyComments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Usuario no autenticado");
      }

      const comments = await this.getMyCommentsUseCase.execute(req.user.id);
      res.status(200).json(comments);
    } catch (error) {
      next(error);
    }
  };

  getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const comments = await this.getAllCommentsUseCase.execute();
      res.status(200).json(comments);
    } catch (error) {
      next(error);
    }
  };
}
