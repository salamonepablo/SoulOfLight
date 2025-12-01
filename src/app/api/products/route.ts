import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Evitar duplicados en la respuesta agrupando por nombre
    const products = await prisma.product.findMany({
      distinct: ["name"],
      orderBy: { name: "asc" },
    });
    return NextResponse.json(products);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al obtener productos";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
