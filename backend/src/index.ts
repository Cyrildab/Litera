import express from "express";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import AppDataSource from "./data-source";

async function startServer() {
  try {
    await AppDataSource.initialize();
    console.log("✅ Connected to the database");

    const app = express();
    const server = new ApolloServer({
      typeDefs,
      resolvers,
    });

    await server.start();
    server.applyMiddleware({ app });

    const PORT = 4000;
    app.listen(PORT, () => console.log(`🚀 Backend running at http://localhost:${PORT}/graphql`));
  } catch (error) {
    console.error("❌ Error during Data Source initialization", error);
  }
}

startServer();
