import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST || "database",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ["src/entities/*.ts"],
  synchronize: true,
  logging: true,
});

export default AppDataSource;
