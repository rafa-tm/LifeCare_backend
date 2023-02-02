import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export default async function ProfissionalRoutes(app: FastifyInstance) {
  //GET lista de profissionais do BD
  app.get("/profissionais", async () => {
    const profissionaisLista = await prisma.profissional.findMany();

    return profissionaisLista;
  });

  //POST cria um profissional
  app.post("/profissionais", async (request) => {
    const criarProfissionalBody = z.object({
      nome: z.string(),
      email: z.string(),
      cpf: z.string().length(11),
      telefone: z.string().length(12),
      area: z.string(),
      especialidade: z.string(),
      cidade: z.string(),
      estado: z.string(),
      senha: z.string(),
    });

    const {
      nome,
      email,
      cpf,
      telefone,
      area,
      especialidade,
      cidade,
      estado,
      senha,
    } = criarProfissionalBody.parse(request.body);

    //Segurança da senha?

    await prisma.profissional.create({
      data: {
        nome,
        email,
        cpf,
        telefone,
        area,
        especialidade,
        cidade,
        estado,
        senha,
      },
    });
  });

  //GET lista de profissionais com por nome
  app.get("/profissionais/filtro", async (request) => {
    const filtroParam = z.object({
      nome: z.string(),
    });

    const { nome } = filtroParam.parse(request.query);
    const listaProfissionaisNome = await prisma.profissional.findMany({
      where: {
        nome: {
          contains: nome,
        },
      },
    });

    return listaProfissionaisNome;
  });

  app.get("/profissionais/filtros", async (request) => {
    const filtrosParam = z.object({
      nome: z.string(),
      area: z.string(),
      especialidade: z.string(),
    });

    const { nome, area, especialidade } = filtrosParam.parse(request.query);
    const listaProfissionaisfiltros = await prisma.profissional.findMany({
      where: {
        OR: [
          {
            nome: {
              contains: nome,
            },
          },
          {
            area: {
              contains: area,
            },
          },
          {
            especialidade: {
              contains: especialidade,
            },
          },
        ],
      },
    });

    return listaProfissionaisfiltros;
  });
}
