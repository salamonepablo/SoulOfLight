import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json(products);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al obtener productos";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
