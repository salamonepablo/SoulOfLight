import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageUsers } from "@/modules/users/domain/userAccess";

interface OrderWithItems {
  items: Array<{ productId: number | null }>;
}

interface AdminOrderRecord {
  id: string;
  total: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  items: Array<{
    id: string;
    orderId: string;
    productId: number | null;
    serviceId: number | null;
    quantity: number;
    price: number;
  }>;
}

export async function GET() {
  const session = await auth();

  if (!canManageUsers(session?.user?.role)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const orders = await prisma.order.findMany({
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
    orderBy: {
      createdAt: "desc",
    },
  });

  const productIds = Array.from(
    new Set(
      orders
        .flatMap((order: OrderWithItems) => order.items)
        .map((item: { productId: number | null }) => item.productId)
        .filter((productId: number | null): productId is number => productId !== null),
    ),
  );

  const products =
    productIds.length > 0
      ? await prisma.product.findMany({
          where: { id: { in: productIds } },
          select: { id: true, name: true },
        })
      : [];

  const productNameById = new Map(
    products.map((product: { id: number; name: string }) => [product.id, product.name]),
  );

  const enrichedOrders = orders.map((order: AdminOrderRecord) => ({
    ...order,
    items: order.items.map((item: { productId: number | null }) => ({
      ...item,
      productName: item.productId ? productNameById.get(item.productId) ?? "Producto eliminado" : null,
    })),
  }));

  return NextResponse.json({ orders: enrichedOrders });
}
