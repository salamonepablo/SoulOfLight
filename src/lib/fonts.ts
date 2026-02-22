// Fuentes centrales del proyecto (UI layer)
// Añade aquí nuevas variantes si hace falta.
import { Playfair_Display, Cormorant_Garamond, Cinzel, Cardo } from "next/font/google";

export const playfair = Playfair_Display({ subsets: ["latin"], weight: ["700"], display: "swap" });
export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});
export const cinzel = Cinzel({ subsets: ["latin"], weight: ["700"], display: "swap" });
export const cardo = Cardo({ subsets: ["latin"], weight: ["700"], display: "swap" });

// Selección actual (cambia esta constante para probar rápido)
export const currentBrandFont = cormorant; // Cambiado a Cormorant Garamond para probar estilo más cercano al logo
