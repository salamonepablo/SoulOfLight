const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de productos...");

  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: [
      {
        name: "Sahumerio Palo Santo",
        description: "Limpieza energética y armonización.",
        price: 12.5,
        stock: 50,
        imageUrl: "/images/palo_santo.jpg"
      },
      {
        name: "Incienso de Lavanda",
        description: "Relajación, calma y bienestar emocional.",
        price: 9.0,
        stock: 40,
        imageUrl: "/images/incenso_lavanda.jpg"
      },
      {
        name: "Vela de Intención",
        description: "Para rituales, manifestación y meditación.",
        price: 14.0,
        stock: 100,
        imageUrl: "/images/vela_intencion.jpg"
      }
    ]
  });

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
