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
  const cardsDir = path.join(imagesDir, "cards");
  const thumbsDir = path.join(imagesDir, "thumbs");

  const topLevelFiles = fs.existsSync(imagesDir) ? fs.readdirSync(imagesDir) : [];
  // Tomamos solo originales del nivel superior: sin prefix thumb- ni sufijo _card
  const originalImageFiles = topLevelFiles.filter(
    (f) => /\.(jpe?g|png|webp)$/i.test(f) && !/^almadeluz\.(jpe?g|png|webp)$/i.test(f)
  );

  let sources = originalImageFiles;

  // Si no hay originales en la raíz, intentamos derivar desde la carpeta cards
  if (!sources.length && fs.existsSync(cardsDir)) {
    const cardFiles = fs.readdirSync(cardsDir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
    // Normalizamos a basename sin sufijo _card para usar como nombre y excluimos almadeluz
    sources = cardFiles
      .map((f) => f.replace(/_card(?=\.(jpe?g|png|webp)$)/i, ""))
      .filter((f) => !/^almadeluz\.(jpe?g|png|webp)$/i.test(f));
  }

  const products = sources.map((file) => {
    const base = file.replace(/\.(jpe?g|png|webp)$/i, "");
    const parts = base.split("-");
    const isTibetano = /\b-tibetano\b/i.test(base);
    const isCombo = parts.length === 3 && !isTibetano;

    // Definiciones de pack
    const packs = isCombo ? 3 : 1;
    const unitsPerPack = isTibetano ? 3 : 6;

    // Preferimos servir cards procesadas si existen
    const webpCard = path.join(cardsDir, `${base}.webp`);
    const jpgCard = path.join(cardsDir, `${base}.jpg`);
    const jpegCard = path.join(cardsDir, `${base}.jpeg`);
    const pngCard = path.join(cardsDir, `${base}.png`);

    let imageUrl = `/images/${file}`; // fallback a original en raíz
    if (fs.existsSync(webpCard)) imageUrl = `/images/cards/${base}.webp`;
    else if (fs.existsSync(jpgCard)) imageUrl = `/images/cards/${base}.jpg`;
    else if (fs.existsSync(jpegCard)) imageUrl = `/images/cards/${base}.jpeg`;
    else if (fs.existsSync(pngCard)) imageUrl = `/images/cards/${base}.png`;

    return {
      name: buildTitleFromFilename(base),
      description: isTibetano
        ? "Paquete tibetano (3 sahumerios)."
        : isCombo
          ? "Combo de 3 paquetes estándar (18 sahumerios)."
          : "Paquete estándar (6 sahumerios).",
      price: priceFromParts(parts.length, base),
      stock: stockFromParts(parts.length, base),
      imageUrl,
      unitsPerPack,
      packs,
    };
  });

  if (!products.length) {
    console.warn(
      "⚠️ No se encontraron imágenes en public/images ni en public/images/cards para generar productos."
    );
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
