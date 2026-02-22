import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createOrderSchema } from "@/lib/validations/order";
import { buildOrderItemsFromProducts } from "@/modules/orders/domain/order.service";

const CREATE_ORDER_ERROR = "No se pudo crear la orden";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const productIds = Array.from(
    new Set(
      orders
        .flatMap((order) => order.items)
        .map((item) => item.productId)
        .filter((productId): productId is number => productId !== null),
    ),
  );

  const products =
    productIds.length > 0
      ? await prisma.product.findMany({
          where: { id: { in: productIds } },
          select: { id: true, name: true },
        })
      : [];

  const productNameById = new Map(products.map((product) => [product.id, product.name]));

  const enrichedOrders = orders.map((order) => ({
    ...order,
    items: order.items.map((item) => ({
      ...item,
      productName: item.productId ? productNameById.get(item.productId) ?? "Producto eliminado" : null,
    })),
  }));

  return NextResponse.json({ orders: enrichedOrders });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createOrderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const productIds = parsed.data.items.map((item) => item.productId);

  try {
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      select: {
        id: true,
        price: true,
        stock: true,
      },
    });

    const orderData = buildOrderItemsFromProducts(parsed.data.items, products);

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total: orderData.total,
        items: {
          create: orderData.items,
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : CREATE_ORDER_ERROR;
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
