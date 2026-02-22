interface RequestedOrderItem {
  productId: number;
  quantity: number;
}

interface ProductForOrder {
  id: number;
  price: number;
  stock: number;
}

interface OrderItemForCreate {
  productId: number;
  quantity: number;
  price: number;
}

interface BuildOrderResult {
  items: OrderItemForCreate[];
  total: number;
}

export function buildOrderItemsFromProducts(
  requestedItems: RequestedOrderItem[],
  products: ProductForOrder[],
): BuildOrderResult {
  const productsMap = new Map(products.map((product) => [product.id, product]));

  let total = 0;
  const items: OrderItemForCreate[] = [];

  for (const requestedItem of requestedItems) {
    const product = productsMap.get(requestedItem.productId);

    if (!product) {
      throw new Error("Producto no encontrado");
    }

    if (requestedItem.quantity > product.stock) {
      throw new Error("Stock insuficiente");
    }

    items.push({
      productId: product.id,
      quantity: requestedItem.quantity,
      price: product.price,
    });

    total += product.price * requestedItem.quantity;
  }

  return { items, total };
}
