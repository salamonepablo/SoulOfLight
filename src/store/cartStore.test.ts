import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore } from "./cartStore";

// Producto de prueba
const mockProduct = {
  id: 1,
  name: "Sahumerio Lavanda",
  price: 1500,
  imageUrl: "/images/lavanda.jpg",
};

const mockProduct2 = {
  id: 2,
  name: "Sahumerio Ruda",
  price: 1200,
  imageUrl: "/images/ruda.jpg",
};

describe("cartStore", () => {
  // Limpiar el store antes de cada test
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  describe("addToCart", () => {
    it("debe agregar un producto nuevo al carrito", () => {
      const { addToCart } = useCartStore.getState();

      addToCart(mockProduct);

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0]).toMatchObject({
        ...mockProduct,
        quantity: 1,
      });
    });

    it("debe incrementar la cantidad si el producto ya existe", () => {
      const { addToCart } = useCartStore.getState();

      addToCart(mockProduct);
      addToCart(mockProduct);

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0].quantity).toBe(2);
    });

    it("debe manejar múltiples productos diferentes", () => {
      const { addToCart } = useCartStore.getState();

      addToCart(mockProduct);
      addToCart(mockProduct2);

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(2);
      expect(items[0].name).toBe("Sahumerio Lavanda");
      expect(items[1].name).toBe("Sahumerio Ruda");
    });
  });

  describe("removeFromCart", () => {
    it("debe eliminar un producto del carrito", () => {
      const { addToCart, removeFromCart } = useCartStore.getState();

      addToCart(mockProduct);
      addToCart(mockProduct2);
      removeFromCart(mockProduct.id);

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0].id).toBe(mockProduct2.id);
    });

    it("no debe fallar si el producto no existe", () => {
      const { removeFromCart } = useCartStore.getState();

      // No debería lanzar error
      expect(() => removeFromCart(999)).not.toThrow();
    });
  });

  describe("clearCart", () => {
    it("debe vaciar el carrito completamente", () => {
      const { addToCart, clearCart } = useCartStore.getState();

      addToCart(mockProduct);
      addToCart(mockProduct2);
      clearCart();

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(0);
    });

    it("debe funcionar en un carrito ya vacío", () => {
      const { clearCart } = useCartStore.getState();

      expect(() => clearCart()).not.toThrow();
      expect(useCartStore.getState().items).toHaveLength(0);
    });
  });

  describe("cálculos del carrito", () => {
    it("debe permitir calcular el total correctamente", () => {
      const { addToCart } = useCartStore.getState();

      addToCart(mockProduct); // 1500
      addToCart(mockProduct); // +1500 = 3000
      addToCart(mockProduct2); // +1200 = 4200

      const { items } = useCartStore.getState();
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      expect(total).toBe(4200);
    });

    it("debe permitir calcular la cantidad total de items", () => {
      const { addToCart } = useCartStore.getState();

      addToCart(mockProduct);
      addToCart(mockProduct);
      addToCart(mockProduct2);

      const { items } = useCartStore.getState();
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

      expect(totalItems).toBe(3);
    });
  });
});
