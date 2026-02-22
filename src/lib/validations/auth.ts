import { z } from "zod";

// Mensajes genéricos para no dar pistas a atacantes (OWASP)
const GENERIC_VALIDATION_ERROR = "Verificá los datos ingresados";

export const registerSchema = z.object({
  name: z.string().min(2, GENERIC_VALIDATION_ERROR).max(100, GENERIC_VALIDATION_ERROR),
  email: z.string().email(GENERIC_VALIDATION_ERROR),
  password: z
    .string()
    .min(8, GENERIC_VALIDATION_ERROR)
    .regex(/[A-Z]/, GENERIC_VALIDATION_ERROR)
    .regex(/[a-z]/, GENERIC_VALIDATION_ERROR)
    .regex(/[0-9]/, GENERIC_VALIDATION_ERROR),
});

export const loginSchema = z.object({
  email: z.string().email(GENERIC_VALIDATION_ERROR),
  password: z.string().min(1, GENERIC_VALIDATION_ERROR),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
