const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function toImageCandidateNames(name) {
  // Genera posibles nombres de archivo para coincidir con los que subiste.
  // Estrategias: underscore, hyphen, camelCase, y versión sin acentos.
  const normalize = (s) => s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita acentos
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .trim();

  const base = normalize(name).toLowerCase();
  const underscores = base.replace(/\s+/g, "_");
  const hyphens = base.replace(/\s+/g, "-");
  const camel = base.replace(/\s+(\w)/g, (_, c) => c.toUpperCase()).replace(/^([a-z])/, (m) => m);

  return [underscores, hyphens, camel].map((n) => `/images/${n}.jpg`);
}

async function main() {
  console.log("🌱 Iniciando seed de productos...");

  await prisma.product.deleteMany();

  const products = [
    {
      name: "Sahumerio Palo Santo",
      description: "Limpieza energética y armonización.",
      price: 3500.0,
      stock: 50,
      imageUrl: "/images/palo_santo.jpg",
    },
    {
      name: "Incienso de Lavanda",
      description: "Relajación, calma y bienestar emocional.",
      price: 3500.0,
      stock: 40,
      // corregir posible typo de archivo: "incienso_lavanda.jpg"
      imageUrl: "/images/incienso_lavanda.jpg",
    },
    {
      name: "Vela de Intención",
      description: "Para rituales, manifestación y meditación.",
      price: 3500.0,
      stock: 100,
      imageUrl: "/images/vela_intencion.jpg",
    },
    // Puedes agregar combos aquí; si no especificas imageUrl, se intentará derivar.
    // { name: "paloSanto-incienso Lavanda", description: "Combo armonización", price: 9000, stock: 15 },
  ];

  const data = products.map((p) => {
    if (p.imageUrl) return p;
    const candidates = toImageCandidateNames(p.name);
    // elegimos la primera opción; en UI hay fallback a almadeluz.jpg si 404
    return { ...p, imageUrl: candidates[0] };
  });

  // Agregar combos de 3 nombres con precio fijo $10.000
  // Ejemplo de archivo: magnolia-reinoDeLaNoche-camposDeLavanda.jpg
  const comboFilenames = [
    "magnolia-reinoDeLaNoche-camposDeLavanda",
    // Agrega aquí más combos si existen en public/images
  ];

  const toTitleFromCombo = (filename) => {
    const parts = filename.split("-");
    const toWords = (s) => s
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/\b([a-z])/g, (m) => m.toUpperCase());
    const title = parts.map(toWords).join(" + ");
    return title;
  };

  const combos = comboFilenames.map((f) => ({
    name: toTitleFromCombo(f),
    description: "Combo de fragancias — paquete de 3.",
    price: 10000.0,
    stock: 20,
    imageUrl: `/images/${f}.jpg`,
  }));

  await prisma.product.createMany({ data: [...data, ...combos] });

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
