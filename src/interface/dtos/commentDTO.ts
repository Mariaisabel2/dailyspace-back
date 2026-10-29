import { z } from "zod";

export const createCommentSchema = z.object({
  postId: z.coerce.number().int().positive({ message: "ID de publicación inválido" }),
  content: z
    .string({ required_error: "El contenido del comentario es obligatorio" })
    .min(1, "El comentario no puede estar vacío")
    .max(500, "El comentario no puede exceder 500 caracteres"),
});

export type CreateCommentDTO = z.infer<typeof createCommentSchema>;
