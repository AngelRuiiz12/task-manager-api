import "dotenv/config";
import prisma from "../src/lib/prisma.js";

async function main() {
  const user = await prisma.user.create({
    data: {
      email: "demo@example.com",
      name: "Usuario Demo",
    },
  });

  const project = await prisma.project.create({
    data: {
      name: "Proyecto Demo",
      userId: user.id,
    },
  });

  console.log("Seed completado:", { user, project });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
