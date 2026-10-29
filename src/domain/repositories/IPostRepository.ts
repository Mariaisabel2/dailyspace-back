import { PostEntity, PostVisibility } from "../entities/Post.js";

export interface PostFilters {
  visibility?: PostVisibility;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedPostsResult {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: PostEntity[];
}

export interface CreatePostData {
  author: string;
  title: string;
  media: string;
  content: string;
  visibility: PostVisibility;
}

export interface UpdatePostData {
  title?: string;
  media?: string;
  content?: string;
  visibility?: PostVisibility;
}

export interface IPostRepository {
  findPaginated(filters: PostFilters): Promise<PaginatedPostsResult>;
  findById(id: number): Promise<PostEntity | null>;
  create(data: CreatePostData): Promise<PostEntity>;
  update(id: number, data: UpdatePostData): Promise<PostEntity | null>;
  delete(id: number): Promise<boolean>;
  incrementLikes(id: number): Promise<number | null>;
}
