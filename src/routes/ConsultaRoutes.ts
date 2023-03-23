import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { add, format, parse } from "date-fns";

export default async function ConsultaRoutes(app: FastifyInstance) {
  //GET todas as consultas
  app.get("/consultas", async () => {
    const consultas = await prisma.consulta.findMany();
    return consultas;
  });

  //POST cria nova consulta
  app.post("/consultas", async (request, response) => {
    const criarConsultaBody = z.object({
      clienteId: z.string().uuid(),
      profissionalId: z.string().uuid(),
      data: z.string(),
      hora: z.string(),
      estado: z.boolean(),
    });

    let { clienteId, profissionalId, data, hora, estado } =
      criarConsultaBody.parse(request.body);

    data = format(add(new Date(data), { days: 1 }), "dd/MM/yyyy");

    await prisma.consulta
      .create({
        data: {
          clienteId,
          profissionalId,
          data,
          hora,
          estado,
        },
      })
      .then(() => {
        response.status(200);
      });
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

  //PUT altera estado da consulta
  app.put("/consultas/:id", async (request, response) => {
    const alteraConsultaBody = z.object({
      id: z.string().uuid(),
    });

    const { id } = alteraConsultaBody.parse(request.params);
    const estado = false;

    await prisma.consulta
      .update({
        where: {
          id: id,
        },
        data: {
          estado,
        },
      })
      .then(() => {
        response.status(200);
      });
  });

  //DELETE deleta consulta
  app.delete("/consultas/:id", async (request, response) => {
    const deletaConsultaBody = z.object({
      id: z.string().uuid(),
    });

    const { id } = deletaConsultaBody.parse(request.params);

    await prisma.consulta
      .delete({
        where: {
          id: id,
        },
      })
      .then(() => {
        response.status(200);
      });
  });
}
