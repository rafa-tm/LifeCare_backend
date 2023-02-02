import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export default async function ConsultaRoutes(app: FastifyInstance) {
  //GET todas as consultas
  app.get("/consultas", async (request, reply) => {
    const consultas = await prisma.consulta.findMany();

    return consultas;
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
