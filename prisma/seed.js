const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");
const prisma = new PrismaClient();

// Convierte un fragmento camelCase o lowercase en palabras capitalizadas.
function humanizeSegment(seg) {
  return seg
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(/\s+/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

function buildTitleFromFilename(base) {
  const parts = base.split("-");
  return parts.map(humanizeSegment).join(parts.length === 3 ? " + " : " ");
}

function guessDescription(partsCount) {
  if (partsCount === 3) return "Combo de fragancias — paquete de 3.";
  return "Producto aromático / espiritual.";
}

function priceFromParts(partsCount, base) {
  // tibetano 1x3 = $2000
  if (/\b-tibetano\b/i.test(base)) return 2000.0;
  // combo (3 partes) = 3x6 (18 unidades totales) precio fijo actual
  if (partsCount === 3) return 10000.0;
  // estándar 1x6 = $3500
  return 3500.0;
}

function stockFromParts(partsCount, base) {
  if (/\b-tibetano\b/i.test(base)) return 60; // tibetano
  if (partsCount === 3) return 20; // combo
  return 50; // estándar
}

async function main() {
  console.log("🌱 Iniciando seed de productos...");

  await prisma.product.deleteMany();

  const imagesDir = path.join(process.cwd(), "public", "images");
  const files = fs.existsSync(imagesDir) ? fs.readdirSync(imagesDir) : [];

  const imageFiles = files.filter((f) => /\.(jpe?g|png|webp)$/i.test(f));

  const products = imageFiles
    // Excluir imagen fallback que no debe ser producto
    .filter((file) => !/^almadeluz\.(jpe?g|png|webp)$/i.test(file))
    .map((file) => {
      const base = file.replace(/\.(jpe?g|png|webp)$/i, "");
      const parts = base.split("-");
      const isTibetano = /\b-tibetano\b/i.test(base);
      const isCombo = parts.length === 3 && !isTibetano;

      // Definiciones de pack:
      // estándar: packs=1, unitsPerPack=6
      // tibetano: packs=1, unitsPerPack=3
      // combo (3 fragmentos): packs=3, unitsPerPack=6
      const packs = isCombo ? 3 : 1;
      const unitsPerPack = isTibetano ? 3 : 6;

      return {
        name: buildTitleFromFilename(base),
        description: isTibetano
          ? "Paquete tibetano (3 sahumerios)."
          : isCombo
            ? "Combo de 3 paquetes estándar (18 sahumerios)."
            : "Paquete estándar (6 sahumerios).",
        price: priceFromParts(parts.length, base),
        stock: stockFromParts(parts.length, base),
        imageUrl: `/images/${file}`,
        unitsPerPack,
        packs,
      };
    });

  if (!products.length) {
    console.warn("⚠️ No se encontraron imágenes en public/images para generar productos.");
  }

  await prisma.product.createMany({ data: products });

  console.log("🌱 Seed completado.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
