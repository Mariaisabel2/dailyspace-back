import { z } from "zod";

export const getPostsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(6),
  visibility: z.enum(["Público", "Privado"]).optional(),
  search: z.string().optional(),
});

export const postIdParamSchema = z.object({
  id: z.coerce.number().int().positive({ message: "ID de publicación inválido" }),
});

export const createPostSchema = z.object({
  title: z
    .string({ required_error: "El título es obligatorio" })
    .min(5, "El título debe tener al menos 5 caracteres")
    .max(150, "El título no puede exceder 150 caracteres"),
  media: z
    .string({ required_error: "La imagen es obligatoria" })
    .min(1, "URL o ruta de archivo requerida"),
  content: z
    .string({ required_error: "El contenido es obligatorio" })
    .min(1, "El contenido no puede estar vacío"),
  visibility: z.enum(["Público", "Privado"]).default("Público"),
});

export const updatePostSchema = z.object({
  title: z.string().min(5).max(150).optional(),
  media: z.string().optional(),
  content: z.string().min(1).optional(),
  visibility: z.enum(["Público", "Privado"]).optional(),
});

export type GetPostsQueryDTO = z.infer<typeof getPostsQuerySchema>;
export type CreatePostDTO = z.infer<typeof createPostSchema>;
export type UpdatePostDTO = z.infer<typeof updatePostSchema>;
