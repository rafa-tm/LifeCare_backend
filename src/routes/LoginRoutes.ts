import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export default async function LoginRoutes(app: FastifyInstance) {
  //POST Login do sistema
  app.post("/login", async (request, reply) => {
    const criarProfissionalBody = z.object({
      email: z.string(),
      senha: z.string(),
    });
    const { email, senha } = criarProfissionalBody.parse(request.body);

    const cliente = await prisma.cliente.findFirstOrThrow({
      where: {
        email: email,
        senha: senha,
      },
    });
  });
}
