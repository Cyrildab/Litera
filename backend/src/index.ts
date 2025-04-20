import express from "express";
import cors from "cors";
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

    app.use(
      cors({
        origin: ["https://litera-app.com", "https://api.litera-app.com", "http://localhost:3000"],
        credentials: true,
      })
    );

    server.applyMiddleware({ app });

    app.listen(4000, () => {
      console.log(`🚀 Server ready at http://localhost:4000/graphql`);
    });
  } catch (err) {
    console.error("❌ Error starting server", err);
  }
}

startServer();
