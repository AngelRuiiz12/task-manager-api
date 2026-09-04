import "dotenv/config";
import prisma from "../src/lib/prisma.js";
import bcrypt from "bcrypt";

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  const user = await prisma.user.create({
    data: {
      email: "demo@example.com",
      name: "Usuario Demo",
      password: hashedPassword,
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
