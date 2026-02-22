import { describe, expect, it } from "vitest";
import { canTransitionOrderStatus } from "@/modules/orders/domain/orderStatus";

describe("canTransitionOrderStatus", () => {
  it("permite transiciones validas", () => {
    expect(canTransitionOrderStatus("PENDING", "PAID")).toBe(true);
    expect(canTransitionOrderStatus("PAID", "SHIPPED")).toBe(true);
    expect(canTransitionOrderStatus("SHIPPED", "DELIVERED")).toBe(true);
    expect(canTransitionOrderStatus("PENDING", "CANCELLED")).toBe(true);
  });

  it("permite mantener el mismo estado", () => {
    expect(canTransitionOrderStatus("PENDING", "PENDING")).toBe(true);
  });

  it("bloquea transiciones invalidas", () => {
    expect(canTransitionOrderStatus("PENDING", "DELIVERED")).toBe(false);
    expect(canTransitionOrderStatus("CANCELLED", "PAID")).toBe(false);
    expect(canTransitionOrderStatus("DELIVERED", "SHIPPED")).toBe(false);
  });
});
