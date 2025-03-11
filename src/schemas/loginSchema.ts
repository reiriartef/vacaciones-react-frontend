import { z } from "zod";
export const loginSchema = z.object({
  nombre_usuario: z.string().min(1, "Ingrese nombre de usuario válido"),
  contraseña: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});
