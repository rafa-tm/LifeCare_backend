import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export default async function ConsultaRoutes(app: FastifyInstance) {
  //GET todas as consultas
  app.get("/consultas", async () => {
    const consultas = await prisma.consulta.findMany();

    return consultas;
  });

  //POST todas as consultas do usuário
  app.post("/consultasuser", async (request) => {
    const userAuth = z.object({
      type: z.string(),
      token: z.string().uuid(),
    });

    const { type, token } = userAuth.parse(request.body);

    if (type === "cliente") {
      const consultas = await prisma.consulta.findMany({
        where: {
          clienteId: token,
        },
        include: {
          cliente: {
            select: {
              nome: true,
              email: true,
              cpf: true,
              telefone: true,
              cidade: true,
              estado: true,
            },
          },
          profissional: {
            select: {
              nome: true,
              email: true,
              cpf: true,
              telefone: true,
              area: true,
              especialidade: true,
              cidade: true,
              estado: true,
            },
          },
        },
      });
      return consultas;
    } else {
      const consultas = await prisma.consulta.findMany({
        where: {
          profissionalId: token,
        },
        include: {
          cliente: {
            select: {
              nome: true,
              email: true,
              cpf: true,
              telefone: true,
              cidade: true,
              estado: true,
            },
          },
          profissional: {
            select: {
              nome: true,
              email: true,
              cpf: true,
              telefone: true,
              area: true,
              especialidade: true,
              cidade: true,
              estado: true,
            },
          },
        },
      });
      return consultas;
    }
  });

  //POST cria nova consulta
  app.post("/consultas", async (request) => {
    const criarConsultaBody = z.object({
      clienteId: z.string().uuid(),
      profissionalId: z.string().uuid(),
      data: z.string(),
      hora: z.string(),
      estado: z.boolean(),
    });

    const { clienteId, profissionalId, data, hora, estado } =
      criarConsultaBody.parse(request.body);

    await prisma.consulta.create({
      data: {
        clienteId,
        profissionalId,
        data,
        hora,
        estado,
      },
    });
  });
}
