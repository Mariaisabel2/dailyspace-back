import { ICommentRepository, CreateCommentData } from "../../../domain/repositories/ICommentRepository.js";
import { IPostRepository } from "../../../domain/repositories/IPostRepository.js";
import { CommentEntity } from "../../../domain/entities/Comment.js";
import { NotFoundError } from "../../../domain/errors/AppError.js";

export class CreateCommentUseCase {
  constructor(
    private readonly commentRepository: ICommentRepository,
    private readonly postRepository: IPostRepository
  ) {}

  async execute(data: CreateCommentData): Promise<CommentEntity> {
    // Verificar que la publicación exista
    const post = await this.postRepository.findById(data.postId);
    if (!post) {
      throw new NotFoundError(`Publicación con ID ${data.postId} no encontrada`);
    }

    // El userId proviene estrictamente del token verificado
    return this.commentRepository.create(data);
  }
}
