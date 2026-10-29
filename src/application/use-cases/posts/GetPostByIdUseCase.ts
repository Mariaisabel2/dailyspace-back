import { IPostRepository } from "../../../domain/repositories/IPostRepository.js";
import { PostEntity } from "../../../domain/entities/Post.js";
import { NotFoundError } from "../../../domain/errors/AppError.js";

export class GetPostByIdUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(id: number): Promise<PostEntity> {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new NotFoundError(`Publicación con ID ${id} no encontrada`);
    }
    return post;
  }
}
