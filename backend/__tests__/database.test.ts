import { Client } from "pg";
import dotenv from "dotenv";
dotenv.config();

describe("📡 PostgreSQL connection", () => {
  let client: Client;

  beforeAll(async () => {
    client = new Client({
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "5432", 10),
      user: process.env.DB_USER || "Zorba",
      password: process.env.DB_PASSWORD || "Poisson11",
      database: process.env.DB_NAME || "litera",
    });

    await client.connect();
  });

  afterAll(async () => {
    await client.end();
  });

  it("should successfully connect and execute SELECT 1", async () => {
    const result = await client.query<{ result: number }>("SELECT 1 as result");
    expect(result.rows[0].result).toBe(1);
  });
});
