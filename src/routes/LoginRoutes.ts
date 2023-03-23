import { randomUUID } from "crypto";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export default async function LoginRoutes(app: FastifyInstance) {
  let tokenAcess = "";
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
      },
    });

    if (!cliente) {
      const profissional = await prisma.profissional.findFirst({
        where: {
          email: email,
        },
      });
      if (!profissional) {
        reply.code(401).send({ erro: "Usuário não cadastrado" });
        return;
      } else {
        if (profissional.senha === senha) {
          tokenAcess = profissional.id;
          return { token: tokenAcess, type: "profissional" };
        } else {
          reply.code(401).send({ erro: "Senha incorreta" });
          return;
        }
      }
    }

    if (cliente.senha === senha) {
      tokenAcess = cliente.id;
      return { token: tokenAcess, type: "cliente" };
    } else {
      reply.code(401).send({ erro: "Senha incorreta" });
      return;
    }
  });

  //POST Verifica login do sistema
  app.post("/verificalogin", async (request, reply) => {
    const criarProfissionalBody = z.object({
      token: z.string().uuid(),
    });
    const { token } = criarProfissionalBody.parse(request.body);

    const cliente = await prisma.cliente.findFirst({
      where: {
        id: token,
      },
    });

    if (!cliente) {
      const profissional = await prisma.profissional.findFirst({
        where: {
          id: token,
        },
      });
      if (!profissional) {
        reply.code(401).send({ erro: "Erro no token, faça login novamente!" });
        return;
      } else {
        return { user: profissional };
      }
    }
    return { user: cliente };
  });
}
