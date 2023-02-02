import { randomUUID } from "crypto";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export default async function LoginRoutes(app: FastifyInstance) {
  const tokenAcess = randomUUID();

  //POST Login do sistema
  app.post("/login", async (request, reply) => {
    const criarProfissionalBody = z.object({
      email: z.string(),
      senha: z.string(),
    });
    const { email, senha } = criarProfissionalBody.parse(request.body);

    const cliente = await prisma.cliente.findFirst({
      where: {
        email: email,
        senha: senha,
      },
    });

    if (!cliente) {
      const profissional = await prisma.profissional.findFirst({
        where: {
          email: email,
          senha: senha,
        },
      });
      if (!profissional) {
        reply.code(401).send({ erro: "Usuário não cadastrado" });
        return;
      } else {
        return { token_profissional: tokenAcess };
      }
    }

    return { token_cliente: tokenAcess };
  });
}
