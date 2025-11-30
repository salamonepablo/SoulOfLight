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

function priceFromParts(partsCount) {
  return partsCount === 3 ? 10000.0 : 3500.0;
}

function stockFromParts(partsCount) {
  return partsCount === 3 ? 20 : 50;
}

async function main() {
  console.log("🌱 Iniciando seed de productos...");

  await prisma.product.deleteMany();

  const imagesDir = path.join(process.cwd(), "public", "images");
  const files = fs.existsSync(imagesDir) ? fs.readdirSync(imagesDir) : [];

  const imageFiles = files.filter((f) => /\.(jpe?g|png|webp)$/i.test(f));

  const products = imageFiles.map((file) => {
    const base = file.replace(/\.(jpe?g|png|webp)$/i, "");
    const parts = base.split("-");
    return {
      name: buildTitleFromFilename(base),
      description: guessDescription(parts.length),
      price: priceFromParts(parts.length),
      stock: stockFromParts(parts.length),
      imageUrl: `/images/${file}`,
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
