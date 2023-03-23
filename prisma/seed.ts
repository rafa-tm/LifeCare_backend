import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.consulta.deleteMany();

  await prisma.cliente.deleteMany();

  await prisma.profissional.deleteMany();

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

  await prisma.profissional.create({
    data: {
      nome: "Gabriel Magri",
      email: "gabriel@email.com",
      telefone: "014997644542",
      area: "Pediatria",
      especialidade: "Geral",
      cpf: "47094784800",
      cidade: "Jaú",
      estado: "São Paulo",
      senha: "1234",
    },
  });

  await prisma.profissional.create({
    data: {
      nome: "Pedro Minatel",
      email: "pedro@email.com",
      telefone: "014997644542",
      area: "Pediatria",
      especialidade: "Geral",
      cpf: "47096784839",
      cidade: "Ribeirão Preto",
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
