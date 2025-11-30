export interface Product {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  imageUrl?: string | null;
  unitsPerPack?: number; // sahumerios por paquete (6 estándar, 3 tibetano)
  packs?: number; // cantidad de paquetes incluidos (3 en combo, 1 normal)
}
