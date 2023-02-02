import fastify from "fastify";
import cors from "@fastify/cors";
import {
  LoginRoutes,
  ClienteRoutes,
  ProfissionalRoutes,
  ConsultaRoutes,
} from "./routes";

const app = fastify();

app.register(cors);
app.register(LoginRoutes);
app.register(ClienteRoutes);
app.register(ProfissionalRoutes);
app.register(ConsultaRoutes);
app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("O Servidor HTTP está rodando!");
  });
