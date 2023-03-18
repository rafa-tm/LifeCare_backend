import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export default async function ClienteRoutes(app: FastifyInstance) {
  //GET lista de clientes do banco
  app.get("/clientes", async () => {
    const clientes = await prisma.cliente.findMany();

    return clientes;
  });

  //POST cria um novo cliente
  app.post("/clientes", async (request) => {
    const criarClienteBody = z.object({
      nome: z.string(),
      email: z.string(),
      cpf: z.string().length(11),
      telefone: z.string().length(12),
      cidade: z.string(),
      estado: z.string(),
      senha: z.string(),
    });

    const { nome, email, cpf, telefone, cidade, estado, senha } =
      criarClienteBody.parse(request.body);

    //Segurança da senha?

    await prisma.cliente.create({
      data: {
        nome,
        email,
        cpf,
        telefone,
        cidade,
        estado,
        senha,
      },
    });
  });

  //GET cliente de ID = ?
  app.get("/clientes/:id", async (request) => {
    const idClienteParam = z.object({
      id: z.string().uuid(),
    });

    const { id } = idClienteParam.parse(request.params);
    const cliente = await prisma.cliente.findUnique({
      where: {
        id: id,
      },
    });

    return cliente;
  });
}
