import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canTransitionOrderStatus } from "@/modules/orders/domain/orderStatus";
import { canManageUsers } from "@/modules/users/domain/userAccess";

const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"]),
});

export async function PATCH(
  request: Request,
  { params }: { params: { orderId: string } },
) {
  const session = await auth();

  if (!canManageUsers(session?.user?.role)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateOrderStatusSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos invalidos" }, { status: 400 });
  }

  const existingOrder = await prisma.order.findUnique({
    where: { id: params.orderId },
    select: {
      id: true,
      status: true,
    },
  });

  if (!existingOrder) {
    return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
  }

  if (!canTransitionOrderStatus(existingOrder.status, parsed.data.status)) {
    return NextResponse.json({ error: "Transición de estado inválida" }, { status: 400 });
  }

  const order = await prisma.order.update({
    where: { id: params.orderId },
    data: {
      status: parsed.data.status,
    },
    include: {
      items: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return NextResponse.json({ order });
}
