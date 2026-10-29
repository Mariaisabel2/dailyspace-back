import { IPostRepository } from "../../../domain/repositories/IPostRepository.js";
import { NotFoundError } from "../../../domain/errors/AppError.js";

export class DeletePostUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(id: number): Promise<void> {
    const deleted = await this.postRepository.delete(id);
    if (!deleted) {
      throw new NotFoundError(`Publicación con ID ${id} no encontrada`);
    }
  }
}
