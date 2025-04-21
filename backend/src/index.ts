import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";
import { createSchema } from "./schema";
import AppDataSource from "./data-source";

async function startServer() {
  await AppDataSource.initialize();
  console.log("✅ DB Connected");

  const schema = await createSchema();

  const app = express();

  app.use(cookieParser());

  app.use(
    cors({
      origin: ["http://localhost:3000", "https://litera-app.com"],
      credentials: true,
    })
  );

  const server = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }),
  });

  await server.start();
  server.applyMiddleware({ app, cors: false });

  app.listen(4000, "0.0.0.0", () => {
    console.log(`🚀 Server ready at http://0.0.0.0:4000/graphql`);
  });
}

startServer();
