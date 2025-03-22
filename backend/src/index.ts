// src/index.ts
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { createSchema } from "./schema";
import AppDataSource from "./data-source";

async function startServer() {
  try {
    await AppDataSource.initialize();
    console.log("✅ DB Connected");

    const schema = await createSchema();
    const server = new ApolloServer({ schema });

    await server.start();

    const app = express();
    server.applyMiddleware({ app });

    app.listen(4000, () => {
      console.log(`🚀 Server ready at http://localhost:4000/graphql`);
    });
  } catch (err) {
    console.error("❌ Error starting server", err);
  }
}

startServer();
