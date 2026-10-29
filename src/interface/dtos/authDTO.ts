import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string({ required_error: "El nombre es obligatorio" })
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres"),
  email: z
    .string({ required_error: "El correo es obligatorio" })
    .email("Formato de correo electrónico inválido"),
  password: z
    .string({ required_error: "La contraseña es obligatoria" })
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: "El correo es obligatorio" })
    .email("Formato de correo electrónico inválido"),
  password: z
    .string({ required_error: "La contraseña es obligatoria" })
    .min(1, "La contraseña es requerida"),
});

export type RegisterDTO = z.infer<typeof registerSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;
