import { IPostRepository, UpdatePostData } from "../../../domain/repositories/IPostRepository.js";
import { PostEntity } from "../../../domain/entities/Post.js";
import { NotFoundError } from "../../../domain/errors/AppError.js";

export class UpdatePostUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(id: number, data: UpdatePostData): Promise<PostEntity> {
    const updated = await this.postRepository.update(id, data);
    if (!updated) {
      throw new NotFoundError(`Publicación con ID ${id} no encontrada`);
    }
    return updated;
  }
}
