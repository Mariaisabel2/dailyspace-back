import { ICommentRepository, CreateCommentData } from "../../../domain/repositories/ICommentRepository.js";
import { IPostRepository } from "../../../domain/repositories/IPostRepository.js";
import { CommentEntity } from "../../../domain/entities/Comment.js";
import { NotFoundError, BadRequestError } from "../../../domain/errors/AppError.js";

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

    // Regla de negocio: no se puede comentar en publicaciones privadas
    if (post.visibility === "Privado") {
      throw new BadRequestError("No se pueden agregar comentarios a una publicación privada");
    }

    // El userId proviene estrictamente del token verificado
    return this.commentRepository.create(data);
  }
}
