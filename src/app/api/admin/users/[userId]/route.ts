import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageUsers, canUpdateUserStatus } from "@/modules/users/domain/userAccess";

const updateUserStatusSchema = z.object({
  isActive: z.boolean(),
});

export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } },
) {
  const session = await auth();

  if (!canManageUsers(session?.user?.role)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateUserStatusSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos invalidos" }, { status: 400 });
  }

  const { userId } = params;
  const { isActive } = parsed.data;

  if (!canUpdateUserStatus(session?.user?.id, userId, isActive)) {
    return NextResponse.json(
      { error: "No podés desactivar tu propio usuario" },
      { status: 400 },
    );
  }

  const existingUser = await prisma.user.findUnique({ where: { id: userId } });

  if (!existingUser) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { isActive },
    select: {
      id: true,
      isActive: true,
      role: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ user: updatedUser });
}
