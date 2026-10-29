import { CommentEntity } from "../entities/Comment.js";

export interface CreateCommentData {
  content: string;
  userId: number;
  postId: number;
}

export interface ICommentRepository {
  create(data: CreateCommentData): Promise<CommentEntity>;
  findByUserId(userId: number): Promise<CommentEntity[]>;
  findAll(): Promise<CommentEntity[]>;
  findById(id: number): Promise<CommentEntity | null>;
  delete(id: number): Promise<boolean>;
}
