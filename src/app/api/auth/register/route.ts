import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";

const BCRYPT_ROUNDS = 12;

// Mensaje genérico para no dar pistas a atacantes (OWASP)
const GENERIC_ERROR = "No se pudo completar el registro. Verificá los datos ingresados.";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validar input con Zod
    const validationResult = registerSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });
    }

    const { name, email, password } = validationResult.data;

    // Verificar si el email ya existe
    // IMPORTANTE: Retornamos el mismo mensaje genérico para no revelar si el email existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Mismo mensaje y código que un registro exitoso para no enumerar usuarios
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });
    }

    // Hash de la contraseña (NUNCA guardar en texto plano)
    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // Crear usuario
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isActive: true,
      },
    });

    // No retornamos datos del usuario creado (menos información expuesta)
    return NextResponse.json({ message: "Registro completado" }, { status: 201 });
  } catch (error) {
    console.error("Error en registro:", error);
    // Mismo mensaje genérico para errores internos
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });
  }
}
