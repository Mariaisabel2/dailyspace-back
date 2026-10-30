import { ICommentRepository } from "../../../domain/repositories/ICommentRepository.js";
import { NotFoundError, ForbiddenError } from "../../../domain/errors/AppError.js";

export class DeleteCommentUseCase {
  constructor(private readonly commentRepository: ICommentRepository) {}

  async execute(commentId: number, currentUserId: number, isAdmin: boolean): Promise<void> {
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) {
      throw new NotFoundError("Comentario no encontrado");
    }

    // Solo el autor del comentario o un administrador pueden eliminarlo
    if (!isAdmin && comment.userId !== currentUserId) {
      throw new ForbiddenError("No tienes permiso para eliminar este comentario");
    }

    await this.commentRepository.delete(commentId);
  }
}
