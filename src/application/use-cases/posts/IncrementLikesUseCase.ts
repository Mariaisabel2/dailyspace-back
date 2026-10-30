import { IPostRepository } from "../../../domain/repositories/IPostRepository.js";
import { NotFoundError } from "../../../domain/errors/AppError.js";

export class IncrementLikesUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(postId: number): Promise<number> {
    const likes = await this.postRepository.incrementLikes(postId);
    if (likes === null) {
      throw new NotFoundError("Publicación no encontrada");
    }
    return likes;
  }
}

