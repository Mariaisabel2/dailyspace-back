import { IPostRepository, CreatePostData } from "../../../domain/repositories/IPostRepository.js";
import { PostEntity } from "../../../domain/entities/Post.js";

export class CreatePostUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(data: CreatePostData): Promise<PostEntity> {
    return this.postRepository.create(data);
  }
}
