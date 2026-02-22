import { z } from "zod";

const orderItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive().max(99),
});

export const createOrderSchema = z
  .object({
    items: z.array(orderItemSchema).min(1),
  })
  .refine(
    (value) => {
      const ids = value.items.map((item) => item.productId);
      return new Set(ids).size === ids.length;
    },
    {
      message: "No se permiten productos duplicados",
      path: ["items"],
    },
  );

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
