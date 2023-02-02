import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.cliente.deleteMany();

  await prisma.profissional.deleteMany();

  await prisma.consulta.deleteMany();

  await prisma.cliente.create({
    data: {
      nome: "Rafael Tury Minatel",
      email: "cliente@email.com",
      telefone: "014997644542",
      cpf: "47394784800",
      cidade: "São Carlos",
      estado: "São Paulo",
      senha: "1234",
    },
  });

  await prisma.profissional.create({
    data: {
      nome: "Luiz Fernando de Oliveira",
      email: "profissional@email.com",
      telefone: "014997644542",
      area: "Ortopedia",
      especialidade: "Trauma",
      cpf: "47394784800",
      cidade: "São Carlos",
      estado: "São Paulo",
      senha: "1234",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
