import { ICommentRepository } from "../../../domain/repositories/ICommentRepository.js";
import { CommentEntity } from "../../../domain/entities/Comment.js";

export class GetAllCommentsUseCase {
  constructor(private readonly commentRepository: ICommentRepository) {}

  async execute(): Promise<CommentEntity[]> {
    return this.commentRepository.findAll();
  }
}
