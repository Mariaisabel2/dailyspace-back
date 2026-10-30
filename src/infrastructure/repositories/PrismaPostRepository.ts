import {
  IPostRepository,
  PostFilters,
  PaginatedPostsResult,
  CreatePostData,
  UpdatePostData,
} from "../../domain/repositories/IPostRepository.js";
import { PostEntity, PostVisibility } from "../../domain/entities/Post.js";
import { prisma } from "../database/prisma.js";
import { PostVisibility as PrismaVisibility } from "@prisma/client";

export class PrismaPostRepository implements IPostRepository {
  private mapVisibilityToDomain(vis: PrismaVisibility): PostVisibility {
    return vis === PrismaVisibility.Publico ? "Público" : "Privado";
  }

  private mapVisibilityToPrisma(vis: PostVisibility): PrismaVisibility {
    return vis === "Público" ? PrismaVisibility.Publico : PrismaVisibility.Privado;
  }

  private mapToEntity(post: {
    id: number;
    author: string;
    title: string;
    media: string;
    content: string;
    visibility: PrismaVisibility;
    likes: number;
    createdAt: Date;
    updatedAt: Date;
    comments?: { content: string }[];
  }): PostEntity {
    const commentsList = post.comments ? post.comments.map((c) => c.content) : [];
    return new PostEntity(
      post.id,
      post.author,
      post.title,
      post.media,
      post.content,
      this.mapVisibilityToDomain(post.visibility),
      post.likes,
      post.createdAt,
      post.updatedAt,
      commentsList
    );
  }

  async findPaginated(filters: PostFilters): Promise<PaginatedPostsResult> {
    const page = filters.page && filters.page > 0 ? filters.page : 1;
    const limit = filters.limit && filters.limit > 0 ? filters.limit : 6;
    const skip = (page - 1) * limit;

    // Filtros combinados de visibilidad y búsqueda por texto (Bono +2 pts)
    const where: Record<string, unknown> = {};

    if (filters.visibility) {
      where.visibility = this.mapVisibilityToPrisma(filters.visibility);
    }

    if (filters.search && filters.search.trim()) {
      const term = filters.search.trim();
      where.OR = [
        { title: { contains: term, mode: "insensitive" } },
        { content: { contains: term, mode: "insensitive" } },
        { author: { contains: term, mode: "insensitive" } },
      ];
    }

    const [total, posts] = await Promise.all([
      prisma.post.count({ where }),
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          comments: {
            select: { content: true },
            orderBy: { createdAt: "asc" },
          },
        },
      }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      data: posts.map((p) => this.mapToEntity(p)),
    };
  }

  async findById(id: number): Promise<PostEntity | null> {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        comments: {
          select: { content: true },
          orderBy: { createdAt: "asc" },
        },
      },
    });
    if (!post) return null;
    return this.mapToEntity(post);
  }

  async create(data: CreatePostData): Promise<PostEntity> {
    const post = await prisma.post.create({
      data: {
        author: data.author,
        title: data.title,
        media: data.media,
        content: data.content,
        visibility: this.mapVisibilityToPrisma(data.visibility),
      },
    });
    return this.mapToEntity(post);
  }

  async update(id: number, data: UpdatePostData): Promise<PostEntity | null> {
    try {
      const post = await prisma.post.update({
        where: { id },
        data: {
          title: data.title,
          media: data.media,
          content: data.content,
          visibility: data.visibility
            ? this.mapVisibilityToPrisma(data.visibility)
            : undefined,
        },
      });
      return this.mapToEntity(post);
    } catch {
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await prisma.post.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async incrementLikes(id: number): Promise<number | null> {
    try {
      const post = await prisma.post.update({
        where: { id },
        data: { likes: { increment: 1 } },
      });
      return post.likes;
    } catch {
      return null;
    }
  }
}
