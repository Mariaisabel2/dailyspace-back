import { IPostRepository, PostFilters, PaginatedPostsResult } from "../../../domain/repositories/IPostRepository.js";

export class GetPostsUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(filters: PostFilters): Promise<PaginatedPostsResult> {
    return this.postRepository.findPaginated(filters);
  }
}
