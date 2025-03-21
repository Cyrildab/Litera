import "reflect-metadata";
import dotenv from "dotenv";

dotenv.config();

import AppDataSource from "./data-source";
import { Book } from "./entities/Book";

async function seed() {
  console.log("📦 DB Config:", {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  await AppDataSource.initialize();

  const newBook = new Book("1984", "George Orwell", "Dystopie", "https://example.com/1984.jpg", "Un classique de la littérature politique.");

  const savedBook = await AppDataSource.manager.save(newBook);
  console.log("📚 Book saved:", savedBook);

  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error("❌ Error during seeding:", err);
});
