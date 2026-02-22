import { describe, expect, it } from "vitest";
import { createOrderSchema } from "@/lib/validations/order";

describe("createOrderSchema", () => {
  it("acepta un pedido valido", () => {
    const result = createOrderSchema.safeParse({
      items: [
        { productId: 1, quantity: 2 },
        { productId: 3, quantity: 1 },
      ],
    });

    expect(result.success).toBe(true);
  });

  it("rechaza pedido sin items", () => {
    const result = createOrderSchema.safeParse({ items: [] });
    expect(result.success).toBe(false);
  });

  it("rechaza cantidad invalida", () => {
    const result = createOrderSchema.safeParse({
      items: [{ productId: 1, quantity: 0 }],
    });

    expect(result.success).toBe(false);
  });

  it("rechaza productId duplicado", () => {
    const result = createOrderSchema.safeParse({
      items: [
        { productId: 1, quantity: 1 },
        { productId: 1, quantity: 2 },
      ],
    });

    expect(result.success).toBe(false);
  });
});
