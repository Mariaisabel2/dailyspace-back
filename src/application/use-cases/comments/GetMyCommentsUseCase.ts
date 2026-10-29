import { ICommentRepository } from "../../../domain/repositories/ICommentRepository.js";
import { CommentEntity } from "../../../domain/entities/Comment.js";

export class GetMyCommentsUseCase {
  constructor(private readonly commentRepository: ICommentRepository) {}

  async execute(userId: number): Promise<CommentEntity[]> {
    return this.commentRepository.findByUserId(userId);
  }
}
