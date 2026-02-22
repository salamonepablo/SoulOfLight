import { describe, expect, it } from "vitest";
import { buildOrderItemsFromProducts } from "@/modules/orders/domain/order.service";

describe("buildOrderItemsFromProducts", () => {
  it("calcula total e items con precio de base de datos", () => {
    const result = buildOrderItemsFromProducts(
      [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 1 },
      ],
      [
        { id: 1, price: 3500, stock: 10 },
        { id: 2, price: 5000, stock: 5 },
      ],
    );

    expect(result.total).toBe(12000);
    expect(result.items).toEqual([
      { productId: 1, quantity: 2, price: 3500 },
      { productId: 2, quantity: 1, price: 5000 },
    ]);
  });

  it("lanza error si falta un producto", () => {
    expect(() =>
      buildOrderItemsFromProducts([{ productId: 8, quantity: 1 }], [{ id: 1, price: 3500, stock: 3 }]),
    ).toThrow("Producto no encontrado");
  });

  it("lanza error si no hay stock suficiente", () => {
    expect(() =>
      buildOrderItemsFromProducts([{ productId: 1, quantity: 4 }], [{ id: 1, price: 3500, stock: 3 }]),
    ).toThrow("Stock insuficiente");
  });
});
