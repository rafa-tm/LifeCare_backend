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

  //GET profissional de ID = ?
  app.get("/profissionais/:id", async (request) => {
    const idProfissionalParam = z.object({
      id: z.string().uuid(),
    });

    const { id } = idProfissionalParam.parse(request.params);
    const profissional = await prisma.profissional.findUnique({
      where: {
        id: id,
      },
    });

    return profissional;
  });

  app.post("/filtrosProfissionais", async (request) => {
    const filtrosParam = z.object({
      nome: z.string(),
      area: z.string(),
      especialidade: z.string(),
      cidade: z.string(),
    });

    const { nome, area, especialidade, cidade } = filtrosParam.parse(
      request.body
    );

    if (nome == "" && area == "" && especialidade == "" && cidade == "") {
      const listaProfissionaisfiltros = await prisma.profissional.findMany();
      return listaProfissionaisfiltros;
    }

    const listaProfissionaisfiltros = await prisma.profissional.findMany({
      where: {
        AND: [
          {
            nome: {
              contains: nome,
              not: "",
            },
          },
          {
            area: {
              contains: area,
              not: "",
            },
          },
          {
            especialidade: {
              contains: especialidade,
              not: "",
            },
          },
          {
            cidade: {
              contains: cidade,
              not: "",
            },
          },
        ],
      },
    });

    return listaProfissionaisfiltros;
  });
}
