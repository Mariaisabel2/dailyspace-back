import {
  ICommentRepository,
  CreateCommentData,
} from "../../domain/repositories/ICommentRepository.js";
import { CommentEntity } from "../../domain/entities/Comment.js";
import { prisma } from "../database/prisma.js";

export class PrismaCommentRepository implements ICommentRepository {
  async create(data: CreateCommentData): Promise<CommentEntity> {
    const comment = await prisma.comment.create({
      data: {
        content: data.content,
        userId: data.userId,
        postId: data.postId,
      },
      include: {
        user: { select: { name: true } },
        post: { select: { title: true } },
      },
    });

    return new CommentEntity(
      comment.id,
      comment.content,
      comment.userId,
      comment.postId,
      comment.createdAt,
      comment.user?.name,
      comment.post?.title
    );
  }

  async findByUserId(userId: number): Promise<CommentEntity[]> {
    const comments = await prisma.comment.findMany({
      where: { userId },
      include: {
        user: { select: { name: true } },
        post: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return comments.map(
      (c) =>
        new CommentEntity(
          c.id,
          c.content,
          c.userId,
          c.postId,
          c.createdAt,
          c.user?.name,
          c.post?.title
        )
    );
  }

  async findAll(): Promise<CommentEntity[]> {
    const comments = await prisma.comment.findMany({
      include: {
        user: { select: { name: true } },
        post: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return comments.map(
      (c) =>
        new CommentEntity(
          c.id,
          c.content,
          c.userId,
          c.postId,
          c.createdAt,
          c.user?.name,
          c.post?.title
        )
    );
  }

  async findById(id: number): Promise<CommentEntity | null> {
    const comment = await prisma.comment.findUnique({
      where: { id },
      include: {
        user: { select: { name: true } },
        post: { select: { title: true } },
      },
    });

    if (!comment) return null;

    return new CommentEntity(
      comment.id,
      comment.content,
      comment.userId,
      comment.postId,
      comment.createdAt,
      comment.user?.name,
      comment.post?.title
    );
  }

  async delete(id: number): Promise<boolean> {
    try {
      await prisma.comment.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
