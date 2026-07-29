import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";

import {
  PrismaClient,
  TransactionType,
} from "../src/generated/prisma/client";
import { hashPassword } from "../src/security/password";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL não foi definida");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const demoPassword = "FinanceHub@123";
  const demoPasswordHash = await hashPassword(demoPassword);

  const user = await prisma.user.upsert({
    where: {
      email: "demo@financehub.com",
    },
    update: {
      name: "Usuário Demo",
      passwordHash: demoPasswordHash,
    },
    create: {
      name: "Usuário Demo",
      email: "demo@financehub.com",
      passwordHash: demoPasswordHash,
    },
  });

  await prisma.transaction.deleteMany({
    where: {
      userId: user.id,
    },
  });

  await prisma.transaction.createMany({
    data: [
      {
        userId: user.id,
        title: "Salário",
        amount: 3500,
        type: TransactionType.INCOME,
        category: "Trabalho",
      },
      {
        userId: user.id,
        title: "Supermercado",
        amount: 420.5,
        type: TransactionType.EXPENSE,
        category: "Alimentação",
      },
      {
        userId: user.id,
        title: "Conta de energia",
        amount: 180,
        type: TransactionType.EXPENSE,
        category: "Moradia",
      },
    ],
  });

  console.log("Seed executado com sucesso.");
  console.log(`Usuário: ${user.email}`);
  console.log(`Senha de desenvolvimento: ${demoPassword}`);
}

main()
  .catch((error: unknown) => {
    console.error("Erro ao executar o seed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });